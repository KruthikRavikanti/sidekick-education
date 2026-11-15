import type { ActivityVisual } from "@/lib/activity-types";

const colors = { green: "#7b9c58", blue: "#73a3cf", red: "#ce7770", yellow: "#e0be5e", gray: "#a2a8ae", brown: "#a57851" };

function VisualItem({ item, position }: { item: ActivityVisual["items"][number]; position: number }) {
  const { x, y, width: w, height: h } = item;
  const fill = colors[item.color];
  const common = { fill, stroke: "#334838", strokeWidth: 0.55 };
  let shape;
  switch (item.kind) {
    case "rect": shape = <rect x={x} y={y} width={w} height={h} {...common} />; break;
    case "circle": shape = <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...common} />; break;
    case "triangle": shape = <polygon points={`${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`} {...common} />; break;
    case "line": shape = <line x1={x} y1={y} x2={x + w} y2={y + h} stroke={fill} strokeWidth="1.2" />; break;
    case "cube": shape = <g><polygon points={`${x},${y + h * .25} ${x + w * .5},${y} ${x + w},${y + h * .25} ${x + w * .5},${y + h * .5}`} {...common} /><polygon points={`${x},${y + h * .25} ${x + w * .5},${y + h * .5} ${x + w * .5},${y + h} ${x},${y + h * .75}`} {...common} opacity=".85" /><polygon points={`${x + w * .5},${y + h * .5} ${x + w},${y + h * .25} ${x + w},${y + h * .75} ${x + w * .5},${y + h}`} {...common} opacity=".65" /></g>; break;
    case "sphere": shape = <g><ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...common} /><ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 8} fill="none" stroke="#334838" strokeDasharray="1 1" strokeWidth=".5" /><ellipse cx={x + w * .38} cy={y + h * .32} rx={w * .13} ry={h * .12} fill="white" opacity=".5" /></g>; break;
    case "cone": shape = <g><path d={`M ${x} ${y + h * .8} L ${x + w / 2} ${y} L ${x + w} ${y + h * .8}`} {...common} /><ellipse cx={x + w / 2} cy={y + h * .8} rx={w / 2} ry={h * .2} {...common} /></g>; break;
    case "cylinder": shape = <g><rect x={x} y={y + h * .15} width={w} height={h * .7} {...common} /><ellipse cx={x + w / 2} cy={y + h * .85} rx={w / 2} ry={h * .15} {...common} /><ellipse cx={x + w / 2} cy={y + h * .15} rx={w / 2} ry={h * .15} {...common} /></g>; break;
    case "penny": case "nickel": case "dime": case "quarter": {
      shape = <image x={x} y={y} width={w} height={h} href={`/activities/coins/${item.kind}.jpg`} preserveAspectRatio="xMidYMid meet" />;
      break;
    }
    case "sun": shape = <g><circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * .3} fill="#e4c05d" stroke="#a78630" strokeWidth=".5" />{Array.from({ length: 8 }, (_, index) => {
      const angle = index * Math.PI / 4, cx = x + w / 2, cy = y + h / 2;
      return <line key={index} x1={cx + Math.cos(angle) * w * .36} y1={cy + Math.sin(angle) * h * .36} x2={cx + Math.cos(angle) * w * .48} y2={cy + Math.sin(angle) * h * .48} stroke="#d1ab3e" strokeWidth="1" />;
    })}</g>; break;
    case "tree": shape = <g><rect x={x + w * .44} y={y + h * .5} width={w * .14} height={h * .5} fill="#8c633e" /><ellipse cx={x + w / 2} cy={y + h * .35} rx={w / 2} ry={h * .35} fill={fill} stroke="#335237" strokeWidth=".5" /></g>; break;
    case "fox": shape = <g><polygon points={`${x},${y} ${x + w * .3},${y + h * .2} ${x + w * .7},${y + h * .2} ${x + w},${y} ${x + w * .86},${y + h * .7} ${x + w * .5},${y + h} ${x + w * .14},${y + h * .7}`} fill="#bd7e46" stroke="#63472d" strokeWidth=".5" /><polygon points={`${x + w * .14},${y + h * .55} ${x + w * .5},${y + h * .7} ${x + w * .86},${y + h * .55} ${x + w * .5},${y + h}`} fill="#f6eee0" /><circle cx={x + w * .32} cy={y + h * .45} r={w * .035} fill="#2f342f" /><circle cx={x + w * .68} cy={y + h * .45} r={w * .035} fill="#2f342f" /><circle cx={x + w * .5} cy={y + h * .78} r={w * .05} fill="#2f342f" /></g>; break;
    case "book": shape = <g><path d={`M ${x} ${y} Q ${x + w * .25} ${y - h * .12} ${x + w / 2} ${y} Q ${x + w * .75} ${y - h * .12} ${x + w} ${y} L ${x + w} ${y + h} Q ${x + w * .75} ${y + h * .88} ${x + w / 2} ${y + h} Q ${x + w * .25} ${y + h * .88} ${x} ${y + h} Z`} fill="#fffdf5" stroke="#53694b" strokeWidth=".8" /><line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#53694b" strokeWidth=".5" /></g>; break;
    case "text": shape = <text x={x} y={y + h * .65} fontSize={Math.max(4, Math.min(h * .65, 5))} fill="#263c2f">{item.label}</text>; break;
  }
  const coin = ["penny", "nickel", "dime", "quarter"].includes(item.kind);
  const label = coin ? `Coin picture ${position + 1}` : item.label || item.kind;
  const visibleLabel = coin && !/^(?:coin|picture)\s*[a-z0-9]+$/i.test(item.label) ? "" : item.label;
  return <g role="img" aria-label={label}><title>{label}</title>{shape}{item.kind !== "text" && visibleLabel ? <text x={x + w / 2} y={Math.min(99, y + h + 4)} fontSize="3.8" fill="#334838" textAnchor="middle">{visibleLabel}</text> : null}</g>;
}

export function FamilyVisual({ visual }: { visual: ActivityVisual | null }) {
  if (!visual) return null;
  const book = visual.kind === "book_cover" || visual.kind === "book_pages";
  return <figure className={`activity-family-visual activity-visual-${visual.kind}`} aria-label={visual.title}>
    {book ? <div className="activity-book-heading"><h3>{visual.title}</h3>{visual.author ? <p>By {visual.author}</p> : null}</div> : <figcaption>{visual.title}</figcaption>}
    <svg viewBox="0 0 100 100" role="group" aria-label={book ? "Book illustration" : "Activity illustration"}>
      {visual.kind === "book_pages" ? <><rect x="1" y="1" width="98" height="98" rx="2" fill="#fffefa" stroke="#b7baa9" strokeWidth=".5" /><line x1="50" y1="1" x2="50" y2="99" stroke="#c6c9ba" strokeWidth=".8" /></> : null}
      {visual.items.map((item, index) => <VisualItem key={item.id} item={item} position={index} />)}
    </svg>
    {visual.caption ? <p className="activity-visual-caption">{visual.caption}</p> : null}
  </figure>;
}
