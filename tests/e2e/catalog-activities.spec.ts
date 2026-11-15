import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";
import type { ActivitySession } from "../../lib/activity-types";
import { createFamily, mutate, PIN } from "./helpers";

const execute=promisify(execFile);
const cases=[
  {name:"multiplication",grade:"3",skill:"3.OA.A.1-1"},
  {name:"division",grade:"3",skill:"3.OA.A.2-1"},
  {name:"measurement",grade:"2",skill:"2.MD.A.1-2"},
  {name:"coordinates",grade:"5",skill:"5.G.A.1-1"},
  {name:"phonics",grade:"1",skill:"RF.1.3-2"},
  {name:"fluency",grade:"3",skill:"RF.3.4-2"},
  {name:"writing",grade:"3",skill:"W.3.3-1"},
  {name:"editing",grade:"3",skill:"L.3.2-1"},
  {name:"handwriting",grade:"K",skill:"L.K.1-1"},
  {name:"sorting",grade:"1",skill:"L.1.5-1"},
] as const;

test.use({permissions:["microphone"],launchOptions:{args:[
  "--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream",
  `--use-file-for-fake-audio-capture=${path.join(process.cwd(),"fixtures/synthetic-reading.wav")}`,
]}});

async function act(page:Page,session:ActivitySession,index:number) {
  const scene=session.currentScene!;
  if(scene.component==="quantity_lab") {
    const each=scene.params.stock/scene.params.containers.length;
    if(each===5) await page.getByRole("radio",{name:"5",exact:true}).check();
    for(const container of scene.params.containers) {
      for(let n=0;n<(each===5?1:each);n++) await page.getByRole("button",{name:`Add pieces to ${container.label}`,exact:true}).click();
      await expect(page.getByRole("region",{name:container.label,exact:true})).toHaveAttribute("data-count",String(each));
    }
    await expect(page.getByRole("region",{name:"Quantity lab",exact:true})).toHaveAttribute("data-loose","0");
    await expect(page.getByLabel("Equal group relationship",{exact:true})).toHaveCount(index===2?0:1);
  } else if(scene.component==="math_workspace") {
    if(scene.params.mode==="grid") {
      const match=scene.prompt.match(/\((\d+), (\d+)\)/)!;
      await page.getByRole("button",{name:`Mark point ${match[1]}, ${match[2]}`,exact:true}).press("Enter");
    } else {
      const value=scene.params.objects[0].width;
      await page.getByRole("button",{name:`Mark ${value} ${scene.params.unitLabel}`,exact:true}).press("Enter");
    }
  } else if(scene.component==="text_editor") {
    const input=page.getByLabel(scene.params.mode==="edit"?"Revise your draft":"Your writing",{exact:true});
    if(scene.params.mode==="edit") {
      await input.fill(["The Fox and the Moon","A Boat on the River","The Owl in the Tower"][index]);
    } else await input.fill(scene.params.wordBank.join(",")==="robin,oak" ? "A robin is a bird because it has feathers. An oak is a tree because it has a trunk and branches." : "Nia stood at the river with her friend Sam. Their map had blown into a tree, so they followed the bank to find a safe way across.");
  } else if(scene.component==="sort_connect") {
    for(const [i,piece] of scene.params.pieces.entries()) {
      await page.getByRole("button",{name:`Choose piece ${piece.text}`,exact:true}).click();
      await page.getByRole("button",{name:`Place in ${scene.params.targets[i<2?0:1].label}`,exact:true}).click();
    }
  } else if(scene.component==="oral_studio") {
    await page.getByRole("button",{name:"Start recording",exact:true}).click();
    await expect(page.getByRole("button",{name:"Stop recording",exact:true})).toBeVisible();
    // Capture actual audio from Chromium's synthetic microphone fixture.
    await page.waitForTimeout(1300);
    await page.getByRole("button",{name:"Stop recording",exact:true}).click();
    await page.getByRole("button",{name:"Use this recording",exact:true}).click();
    await expect(page.getByText("Recording saved and ready to submit.",{exact:true})).toBeVisible();
  } else if(scene.component==="drawing_studio") {
    const board=page.getByRole("application",{name:"Your drawing board",exact:true});
    await board.scrollIntoViewIfNeeded();
    const box=(await board.boundingBox())!;
    await page.mouse.move(box.x+box.width*.2,box.y+box.height*.2);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*.8,box.y+box.height*.2,{steps:8});
    await page.mouse.up();
    await page.mouse.move(box.x+box.width*.5,box.y+box.height*.2);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*.5,box.y+box.height*.8,{steps:8});
    await page.mouse.up();
    await expect(page.getByText("2 strokes saved. A parent will review your drawing.",{exact:true})).toBeVisible();
  } else throw new Error(`Unexpected family control ${scene.component}`);
}

for(const item of cases) test(`${item.name}: normal upload to playable challenge and protected assessment`,async({page,context})=>{
  test.setTimeout(75_000);
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  const family=await createFamily(context,item.grade);
  await page.goto("/kid/homework");
  await page.getByLabel("Choose work image",{exact:true}).setInputFiles(path.join(process.cwd(),`public/samples/activity-catalog-${item.name}-work.png`));
  const extracted=page.waitForResponse(r=>r.url().endsWith("/api/extract")&&r.request().method()==="POST");
  await page.getByRole("button",{name:"Read my work",exact:true}).click();
  const uploaded=await extracted;expect(uploaded.status()).toBe(200);
  const uploadId=uploaded.headers()["x-sidekick-upload-id"];
  await execute("backend/.venv/bin/python",["tests/e2e/catalog_activity_fixture.py",process.env.SIDEKICK_E2E_DATABASE_URL!,family.kid.id,uploadId]);
  const started=page.waitForResponse(r=>r.url().endsWith("/api/activities/kid/start")&&r.status()===200);
  await page.getByRole("button",{name:"Try an activity",exact:true}).click();
  let session=await(await started).json() as ActivitySession;
  expect(session.origin).toBe("model_generated");expect(session.targetSkill.id).toBe(item.skill);
  for(let index=0;index<3;index++) {
    await expect(page.getByRole("heading",{name:session.currentScene!.prompt,exact:true})).toBeVisible();
    await expect(page.getByRole("region",{name:"Learning tip",exact:true})).toHaveCount(index===2?0:1);
    if(index===2) await expect(page.getByRole("button",{name:"Show a hint",exact:true})).toHaveCount(0);
    await act(page,session,index);
    if(index===2) await page.screenshot({path:test.info().outputPath(`${item.name}-fresh-challenge.png`),fullPage:true});
    const saved=page.waitForResponse(r=>r.url().endsWith(`/api/activities/kid/sessions/${session.id}/submit`)&&r.status()===200);
    await page.getByRole("button",{name:index===2?"Save my answer":"Check it",exact:true}).click();
    session=await(await saved).json();
    if(index<2) {
      const next=page.waitForResponse(r=>r.url().endsWith(`/api/activities/kid/sessions/${session.id}/next`)&&r.status()===200);
      await page.getByRole("button",{name:"Next",exact:true}).click();session=await(await next).json();
    }
  }
  await expect(page.getByText("ACTIVITY COMPLETE",{exact:true})).toBeVisible();
  const manual=["phonics","fluency","writing","handwriting","sorting"].includes(item.name);
  expect(session.finalResult!.correct).toBe(manual?null:true);
  expect((await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).status()).toBe(403);
  await mutate(context.request,"/api/session/picker");await page.goto("/profiles");
  await page.getByRole("button",{name:/Parent.*PIN protected/}).click();
  await page.getByLabel("Parent PIN",{exact:true}).fill(PIN);
  await page.getByRole("button",{name:"Enter parent mode",exact:true}).click();
  await page.getByRole("button",{name:"Activities",exact:true}).click();
  await expect(page.getByRole("heading",{name:session.title,exact:true})).toBeVisible();
  if(manual) {
    await expect(page.getByText("Parent review needed",{exact:true})).toBeVisible();
    const audio=["phonics","fluency"].includes(item.name);
    if(audio) {
      const media=await context.request.get(`/api/activities/parent/${family.kid.id}/recordings/${session.finalResult!.recordingId}`);
      expect(media.status()).toBe(200);expect((await media.body()).length).toBeGreaterThan(1000);
    }
    await page.getByRole("radio",{name:audio?"Needs another try":"Demonstrated the goal",exact:true}).check();
    const observed=page.getByRole("checkbox",{name:"I observed the child take part in this activity.",exact:true});
    if(await observed.count()) await observed.check();
    await page.getByLabel("Review note (optional)",{exact:true}).fill(audio?"The synthetic clip does not contain the complete challenge reading.":"Reviewed the saved independent artifact against the goal.");
    await page.getByRole("button",{name:"Save parent review",exact:true}).click();
    await expect(page.getByText("Parent review needed",{exact:true})).toHaveCount(0);
  }
  const history=await(await context.request.get(`/api/activities/parent/${family.kid.id}/history`)).json();
  expect(history.activities[0].finalResult.correct).toBe(!["phonics","fluency"].includes(item.name));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  const proof=await execute("backend/.venv/bin/python",["tests/e2e/catalog_activity_proof.py",process.env.SIDEKICK_E2E_DATABASE_URL!,session.id]);
  await mkdir("test-results/catalog-evidence",{recursive:true});
  await writeFile(`test-results/catalog-evidence/${item.name}.json`,proof.stdout);
});
