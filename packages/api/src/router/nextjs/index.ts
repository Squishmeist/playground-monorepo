import { createTRPCRouter } from "../../trpc";
import { authRouter } from "./auth";
import { flagRouter } from "./flag";
import { postRouter } from "./post";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  flag: flagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
