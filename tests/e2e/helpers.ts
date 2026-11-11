import {
  expect,
  type APIRequestContext,
  type BrowserContext,
} from "@playwright/test";

export const ORIGIN = "http://localhost:3000";
export const PASSWORD = "password";
export const PIN = "0123";

export async function csrf(request: APIRequestContext) {
  const response = await request.get("/api/auth/csrf");
  expect(response.ok()).toBeTruthy();
  return (await response.json()).csrfToken as string;
}

export async function mutate(
  request: APIRequestContext,
  path: string,
  data: unknown = {},
  method = "POST",
) {
  return request.fetch(path, {
    method,
    data,
    headers: { Origin: ORIGIN, "X-CSRF-Token": await csrf(request) },
  });
}

export async function createFamily(context: BrowserContext) {
  const request = context.request;
  const email = `family-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  let response = await mutate(request, "/api/auth/signup", {
    email,
    password: PASSWORD,
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  response = await mutate(request, "/api/parent/pin/setup", {
    password: PASSWORD,
    pin: PIN,
    confirmPin: PIN,
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  response = await mutate(request, "/api/parent/pin/verify", { pin: PIN });
  expect(response.ok(), await response.text()).toBeTruthy();
  response = await mutate(request, "/api/parent/profiles", {
    firstName: "Alex",
    grade: "3",
    avatarKey: "fox",
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  const kid = await response.json();
  expect(typeof kid.id).toBe("string");
  response = await mutate(request, "/api/session/kid", { profileId: kid.id });
  expect(response.ok(), await response.text()).toBeTruthy();
  return { email, password: PASSWORD, pin: PIN, kid };
}
