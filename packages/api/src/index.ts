import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AdminRouter } from "./router/admin";
import type { AppRouter } from "./router/nextjs";
import { adminRouter } from "./router/admin";
import { appRouter } from "./router/nextjs";
import { createTRPCContext } from "./trpc";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type AppRouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type AppRouterOutputs = inferRouterOutputs<AppRouter>;

// Admin-specific type inference helpers
type AdminRouterInputs = inferRouterInputs<AdminRouter>;
type AdminRouterOutputs = inferRouterOutputs<AdminRouter>;

export { createTRPCContext, appRouter, adminRouter };

export type {
  AppRouter,
  AppRouterInputs,
  AppRouterOutputs,
  AdminRouter,
  AdminRouterInputs,
  AdminRouterOutputs,
};
