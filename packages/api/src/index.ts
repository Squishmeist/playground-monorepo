import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { InternalRouter } from "./router/internal";
import type { AppRouter } from "./router/nextjs";
import { internalRouter } from "./router/internal";
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

// Internal-specific type inference helpers
type InternalRouterInputs = inferRouterInputs<InternalRouter>;
type InternalRouterOutputs = inferRouterOutputs<InternalRouter>;

export { createTRPCContext, appRouter, internalRouter };

export type {
  AppRouter,
  AppRouterInputs,
  AppRouterOutputs,
  InternalRouter,
  InternalRouterInputs,
  InternalRouterOutputs,
};
