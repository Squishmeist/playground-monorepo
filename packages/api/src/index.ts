import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { InternalRouter } from "./router/internal";
import type { ExternalRouter} from "./router/external";
import { externalRouter } from "./router/external";
import { internalRouter } from "./router/internal";
import { createTRPCContext } from "./trpc";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type InternalRouterInputs = inferRouterInputs<InternalRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type InternalRouterOutputs = inferRouterOutputs<InternalRouter>;

// Internal-specific type inference helpers
type ExternalRouterInputs = inferRouterInputs<ExternalRouter>;
type ExternalRouterOutputs = inferRouterOutputs<ExternalRouter>;

export { createTRPCContext, externalRouter, internalRouter };

export type {
  ExternalRouter,
  ExternalRouterInputs,
  ExternalRouterOutputs,
  InternalRouter,
  InternalRouterInputs,
  InternalRouterOutputs,
};
