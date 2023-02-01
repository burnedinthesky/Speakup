import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return input;
	}),
});

export type AppRouter = typeof appRouter;
