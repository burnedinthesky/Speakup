import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { CheckAvcClearance } from "./types/advocate/user.types";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    if (!token)
        return NextResponse.redirect(new URL("/user/signin", request.url));
    let rootURL = "";
    let slashCounter = 0;
    for (let i = 0; i < request.url.length && slashCounter < 3; i++) {
        rootURL += request.url[i];
        if (request.url[i] == "/") slashCounter += 1;
    }
    rootURL = rootURL.substring(0, rootURL.length - 1);
    const URLPath = request.url.substring(rootURL.length, request.url.length);
    const res = await fetch(`${rootURL}/api/auth/validateuser`, {
        method: "POST",
        body: JSON.stringify({
            id: token.id,
        }),
    });
    if (!res.ok)
        return NextResponse.redirect(new URL("/user/signin", request.url));
    const valData = await res.json();
    if (res.status === 201) {
        if (!valData.Token)
            return NextResponse.redirect(new URL(`/user/signup`, request.url));
        return NextResponse.redirect(
            new URL(`/user/signup?token=${valData.Token}`, request.url)
        );
    }
    if (valData.Message === "Onboard" && URLPath !== "/user/onboarding")
        return NextResponse.redirect(new URL(`/user/onboarding`, request.url));
    else if (valData.Message !== "Onboard" && URLPath === "/user/onboarding")
        return NextResponse.redirect(new URL(`/home`, request.url));

    if (
        URLPath.substring(0, 9) === "/advocate" &&
        !CheckAvcClearance(token.role)
    ) {
        return NextResponse.redirect(new URL(`/home`, request.url));
    }
}

export const config = {
    matcher: [
        "/user/onboarding",
        "/home",
        "/search",
        "/search/results",
        "/collections",
        "/user/settings",
        "/advocate",
        "/advocate/:path*",
    ],
};
