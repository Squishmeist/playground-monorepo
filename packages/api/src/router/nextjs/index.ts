import { createTRPCRouter } from "../../trpc";
import { authRoute } from "./auth";
import { flagRoute } from "./flag";
import { groupRoute } from "./group";
import { jobRoute } from "./job";
import { orgRoute } from "./org";
import { testRoute } from "./test";

export const appRouter = createTRPCRouter({
  auth: authRoute,
  group: groupRoute,
  job: jobRoute,
  flag: flagRoute,
  test: testRoute,
  org: orgRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
