import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { ExternalRouter } from "@squishmeist/api";
import { createTRPCContext, externalRouter } from "@squishmeist/api";

import { auth } from "~/app/module/auth/server";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  // Check for impersonation cookie and add it as a header
  const cookieStore = await cookies();
  const impersonateUser = cookieStore.get("impersonate-user")?.value;
  if (impersonateUser) heads.set("x-impersonate-user", impersonateUser);

  return createTRPCContext({
    headers: heads,
    auth,
    app: "external",
  });
});

const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<ExternalRouter>({
  router: externalRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

// For direct server-side calls
export const api = cache(async () => {
  const context = await createContext();
  return externalRouter.createCaller(context);
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
