import { createRouter } from "../createRouter";
import { TRPCError } from "@trpc/server";

import { tuple, z } from "zod";
import { User } from "@prisma/client";

import { sendgrid } from "../../utils/sendgrid";

export const userRouter = createRouter()
    .mutation("registerUser", {
        input: z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string().min(2).max(16),
        }),
        async resolve({ ctx, input }) {
            const { email, name, password } = input;

            const sameName = await ctx.prisma.user.findMany({
                where: { name: input.name },
            });

            if (sameName.length)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Username taken",
                });

            const sameEmail = await ctx.prisma.user.findMany({
                where: { email: input.email },
            });

            if (sameEmail.length)
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Email registered",
                });

            const user = await ctx.prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            });

            const token = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            let date = new Date();
            date.setDate(date.getDate() + 1);

            const emailToken = await ctx.prisma.credEmailVerToken.create({
                data: {
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    expiers: date,
                    valToken: token,
                },
            });

            const msg = {
                to: user.email,
                from: "noreply@speakup.place",
                subject: "Speakup 驗證碼",
                html: `您的Speakup驗證碼為 <strong>${emailToken.valToken}</strong>`,
            };

            await sendgrid.send(msg);

            return emailToken.id;
        },
    })
    .mutation("resendEmail", {
        input: z.object({
            verId: z.string(),
        }),
        async resolve({ ctx, input }) {
            const verifier = await ctx.prisma.credEmailVerToken.findUnique({
                where: {
                    id: input.verId,
                },
                select: {
                    user: {
                        include: {
                            CredEmailLimiter: true,
                        },
                    },
                },
            });
            if (!verifier)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Verifier not found",
                });
            const user = verifier.user;

            let prevDay = new Date();
            prevDay.setDate(prevDay.getDate() - 1);

            let credEmailLimiterId: number | undefined;
            let prevCount: number = 0;

            function getSecDiff(startDate: Date, endDate: Date) {
                return Math.round(
                    Math.abs(endDate.getTime() - startDate.getTime()) / 1000
                );
            }

            if (user.CredEmailLimiter) {
                if (user.CredEmailLimiter.id) {
                    credEmailLimiterId = user.CredEmailLimiter.id;
                    prevCount = user.CredEmailLimiter.emailsSentInDay;
                    if (user.CredEmailLimiter.dayStartTime < prevDay) {
                        prevCount = 0;
                        await ctx.prisma.credEmailLimiter.update({
                            where: {
                                id: user.CredEmailLimiter.id,
                            },
                            data: {
                                dayStartTime: new Date(),
                                emailsSentInDay: 0,
                            },
                        });
                    } else if (user.CredEmailLimiter.emailsSentInDay >= 5) {
                        throw new TRPCError({
                            code: "TIMEOUT",
                            message: "Day quota exhausted",
                        });
                    } else if (
                        getSecDiff(
                            user.CredEmailLimiter.lastEmailSent,
                            new Date()
                        ) < 60
                    ) {
                        throw new TRPCError({
                            code: "TIMEOUT",
                            message: "Cooling down",
                        });
                    }
                }
            } else {
                const limiter = await ctx.prisma.credEmailLimiter.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                });
                credEmailLimiterId = limiter.id;
            }

            const token = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            let nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);

            const emailToken = await ctx.prisma.credEmailVerToken.update({
                where: {
                    id: input.verId,
                },
                data: {
                    expiers: nextDay,
                    failedCount: 0,
                    valToken: token,
                },
            });

            const msg = {
                to: user.email,
                from: "noreply@speakup.place",
                subject: "Speakup 驗證碼",
                html: `您的Speakup驗證碼為 <strong>${emailToken.valToken}</strong>`,
            };

            await sendgrid.send(msg);

            await ctx.prisma.credEmailLimiter.update({
                where: {
                    id: credEmailLimiterId,
                },
                data: {
                    emailsSentInDay: prevCount + 1,
                    lastEmailSent: new Date(),
                },
            });

            return emailToken.id;
        },
    })
    .mutation("verifyEmail", {
        input: z.object({
            verId: z.string(),
            verToken: z.string().length(6),
        }),
        async resolve({ ctx, input }) {
            const verifier = await ctx.prisma.credEmailVerToken.findUnique({
                where: { id: input.verId },
            });

            if (!verifier)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Verifier not found",
                });

            if (verifier.expiers < new Date()) {
                await ctx.prisma.credEmailVerToken.delete({
                    where: {
                        id: verifier.id,
                    },
                });
                await ctx.prisma.user.delete({
                    where: {
                        id: verifier.userId,
                    },
                });
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Token expired",
                });
            }

            if (verifier.valToken !== input.verToken) {
                await ctx.prisma.credEmailVerToken.update({
                    where: {
                        id: verifier.id,
                    },
                    data: {
                        failedCount: verifier.failedCount + 1,
                    },
                });

                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Validation failed",
                });
            }

            await ctx.prisma.credEmailVerToken.delete({
                where: {
                    userId: verifier.userId,
                },
            });

            await ctx.prisma.credEmailLimiter.delete({
                where: {
                    userId: verifier.userId,
                },
            });

            await ctx.prisma.user.update({
                where: {
                    id: verifier.userId,
                },
                data: {
                    emailVerified: new Date(),
                },
            });

            return verifier.userId;
        },
    });
