import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            profileImg: string | null;
        };
    }
    interface User {
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        picture: string | null;
        sub?: string;
    }
}
