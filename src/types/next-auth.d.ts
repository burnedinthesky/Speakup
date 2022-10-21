import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            name: string;
            email: string;
            profileImg: string | null;
        };
    }
    interface User {
        name: string;
        email: string;
        profileImg: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        name: string;
        email: string;
        picture: string | null;
        sub?: string;
    }
}
