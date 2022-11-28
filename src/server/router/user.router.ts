import { TRPCError } from "@trpc/server";
import { createHash } from "crypto";

import { z } from "zod";

import { sendgrid } from "../../utils/sendgrid";
import { loggedInProcedure, publicProcedure, router } from "../trpc";

const hashPassword = (pwd: string) => {
    return createHash("sha256").update(pwd).digest("hex");
};

export const userRouter = router({
    registerUser: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string(),
                name: z.string().min(2).max(16),
            })
        )
        .mutation(async ({ ctx, input }) => {
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

            const hashedPassword = hashPassword(password);

            const user = await ctx.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
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
        }),

    resendEmail: publicProcedure
        .input(
            z.object({
                verId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const verifier = await ctx.prisma.credEmailVerToken.findUnique({
                where: {
                    id: input.verId,
                },
                select: {
                    user: {
                        include: {
                            credEmailLimiter: true,
                        },
                    },
                },
            });
            if (!verifier)
                throw new TRPCError({
                    code: "NOT_FOUND",
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

            if (user.credEmailLimiter) {
                if (user.credEmailLimiter.id) {
                    credEmailLimiterId = user.credEmailLimiter.id;
                    prevCount = user.credEmailLimiter.emailsSentInDay;
                    if (user.credEmailLimiter.dayStartTime < prevDay) {
                        prevCount = 0;
                        await ctx.prisma.credEmailLimiter.update({
                            where: {
                                id: user.credEmailLimiter.id,
                            },
                            data: {
                                dayStartTime: new Date(),
                                emailsSentInDay: 0,
                            },
                        });
                    } else if (user.credEmailLimiter.emailsSentInDay >= 5) {
                        throw new TRPCError({
                            code: "TIMEOUT",
                            message: "Day quota exhausted",
                        });
                    } else if (
                        getSecDiff(
                            user.credEmailLimiter.lastEmailSent,
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
        }),
    verifyEmail: publicProcedure
        .input(
            z.object({
                verId: z.string(),
                verToken: z.string().length(6),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const verifier = await ctx.prisma.credEmailVerToken.findUnique({
                where: { id: input.verId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            password: true,
                        },
                    },
                },
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

            await ctx.prisma.user.update({
                where: {
                    id: verifier.userId,
                },
                data: {
                    emailVerified: new Date(),
                },
            });

            return {
                userId: verifier.userId,
                email: verifier.user.email,
                password: verifier.user.password,
            };
        }),
    sendResetPwdLink: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: { email: input.email },
            });
            if (user) {
                const genToken = (length: number) => {
                    var result = "";
                    var characters =
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(
                            Math.floor(Math.random() * charactersLength)
                        );
                    }
                    return result;
                };

                const nextHour = new Date();
                nextHour.setTime(nextHour.getTime() + 60 * 60 * 1000);

                const verToken = await ctx.prisma.verificationToken.create({
                    data: {
                        identifier: input.email,
                        token: genToken(64),
                        expires: nextHour,
                    },
                });

                const resetUrl = `https://speakup.place/user/password/new?token=${verToken.token}`;

                const msg = {
                    to: user.email,
                    from: "noreply@speakup.place",
                    subject: "Speakup 重設密碼",
                    html: `
                    ${user.name} 您好

                    您申請的密碼重設連結為 <a href=${resetUrl}>${resetUrl}</a>
                    
                    若您沒有申請重設密碼，請忽略本信件
                    `,
                };

                await sendgrid.send(msg);
            }
        }),
    resetPwd: publicProcedure
        .input(
            z.object({
                token: z.string().nullish(),
                oldPwd: z.string().nullish(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            let userId: string = "";

            if (input.token) {
                const resetToken =
                    await ctx.prisma.verificationToken.findUnique({
                        where: { token: input.token },
                    });

                if (!resetToken)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Token not found",
                    });

                const tokenUser = await ctx.prisma.user.findUniqueOrThrow({
                    where: {
                        email: resetToken.identifier,
                    },
                    select: {
                        id: true,
                    },
                });

                userId = tokenUser.id;
            } else if (ctx.user && input.oldPwd) {
                const hashedOldPwd = hashPassword(input.oldPwd);
                if (ctx.user.password !== hashedOldPwd) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Current password incorrect",
                    });
                }

                userId = ctx.user.id;
            } else {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Invalid credentials",
                });
            }

            const hashedPassword = hashPassword(input.password);

            const prevUser = await ctx.prisma.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    password: true,
                },
            });

            if (prevUser.password === hashedPassword) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Password same as previous",
                });
            }

            const user = await ctx.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    password: hashedPassword,
                },
            });

            if (input.token)
                await ctx.prisma.verificationToken.delete({
                    where: { token: input.token },
                });

            return {
                userId: user.id,
                email: user.email,
                password: user.password,
            };
        }),
    onboard: loggedInProcedure
        .input(
            z.object({
                birthDate: z.date(),
                gender: z.enum(["m", "f", "o"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id,
                },
                data: {
                    onBoarded: true,
                    birthday: input.birthDate,
                    gender: input.gender,
                },
            });
        }),
});
