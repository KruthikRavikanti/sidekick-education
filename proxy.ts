import { NextResponse, type NextRequest } from "next/server";
import { ACTIVITY_RETURN_HEADER, safeActivityReturn } from "./lib/activity-return";

// Carry the requested pathname into the server auth gate. This does not grant
// access or select an owner/profile; those checks remain server-side.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const target = safeActivityReturn(request.nextUrl.pathname);
  headers.delete(ACTIVITY_RETURN_HEADER);
  if (target) headers.set(ACTIVITY_RETURN_HEADER, target);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: "/kid/activity-preview/:path*" };
