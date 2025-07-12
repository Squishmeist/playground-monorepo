import { createTRPCRouter } from "../../trpc";
import { info } from "./routes";

/**
 * Router for the internal application
 * Contains all routes needed for internal functionality
 * This is a standalone router that can be used independently
 */
export const internalRouter = createTRPCRouter({
  info,
});

export type InternalRouter = typeof internalRouter;
