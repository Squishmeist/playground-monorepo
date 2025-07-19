import { createTRPCRouter } from "../../trpc";
import { authRoute } from "./auth";
import { orgRoute } from "./org";

export const externalRouter = createTRPCRouter({
  auth: authRoute,
  org: orgRoute,
});

// export type definition of API
export type ExternalRouter = typeof externalRouter;
