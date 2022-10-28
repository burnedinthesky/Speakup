import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../utils/prisma";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) throw new Error("Credentials not provided");
                const user = await prisma.user.findUniqueOrThrow({
                    where: {
                        email: credentials?.email,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImg: true,
                        password: true,
                    },
                });

                let date = new Date();
                date.setDate(date.getDate() + 30);

                if (user.password !== credentials.password)
                    throw new Error("Incorrect Password");

                if (user) {
                    return {
                        ...user,
                        password: undefined,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.picture = user.profileImg;
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    profileImg: token.picture,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/user/signin",
    },
    session: {
        strategy: "jwt",
    },
});
