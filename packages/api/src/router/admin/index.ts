import { createTRPCRouter } from "../../trpc";
import { adminRoutes } from "./routes";

/**
 * Router for the admin application
 * Contains all routes needed for admin functionality
 * This is a standalone router that can be used independently
 */
export const adminRouter = createTRPCRouter({
  admin: adminRoutes,
});

export type AdminRouter = typeof adminRouter;
