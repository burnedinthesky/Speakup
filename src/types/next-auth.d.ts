import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

interface SessionUser {
    id: string;
    name: string;
    email: string;
    profileImg: string | null;
    reputation: number;
    role: "USER" | "ADVOCATE" | "SENIOR_ADVOCATE" | "ADMIN";
}

declare module "next-auth" {
    interface Session {
        user: SessionUser;
    }
    interface User extends SessionUser {}
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        picture: string | null;
        reputation: number;
        role: "USER" | "ADVOCATE" | "SENIOR_ADVOCATE" | "ADMIN";
        sub?: string;
    }
}
