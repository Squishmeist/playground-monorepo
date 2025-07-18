/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod/v4";

import type { Auth } from "@squishmeist/auth";
import { db } from "@squishmeist/db/client";
import { logger } from "@squishmeist/telemetry";

type Session = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export interface TRPCContext {
  authApi: Auth["api"];
  session?: Session & {
    impersonatedBy?: Session["user"];
  };
  db: typeof db;
  app: "internal" | "external";
}

export const createTRPCContext = async (opts: {
  headers: Headers;
  auth: Auth;
  app: TRPCContext["app"];
}): Promise<TRPCContext> => {
  const authApi = opts.auth.api;
  const impersonateUser = opts.headers.get("x-impersonate-user");
  const session = await authApi.getSession({
    headers: opts.headers,
  });

  if (!impersonateUser || session?.user.type !== "INTERNAL") {
    return {
      authApi,
      session: session ?? undefined,
      db,
      app: opts.app,
    };
  }

  console.log(
    `Impersonating user ${impersonateUser} for session ${session.user.id}`,
  );

  const effectiveUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, impersonateUser),
  });
  if (!effectiveUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User with ID ${impersonateUser} not found`,
    });
  }
  if (effectiveUser.type !== "EXTERNAL") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Can only impersonate EXTERNAL users",
    });
  }

  return {
    authApi,
    session: {
      session: session.session,
      user: effectiveUser,
      impersonatedBy: session.user,
    },
    db,
    app: opts.app,
  };
};
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError
          ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
          : null,
    },
  }),
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Telemetry middleware for logging requests, responses, and collecting stats
 *
 * Adds artificial delay in development to simulate network latency.
 */
const telemetryMiddleware = t.middleware(
  async ({ next, path, type, ctx, getRawInput }) => {
    const startTime = Date.now();

    if (t._config.isDev) {
      // artificial delay in dev 100-500ms
      const waitMs = Math.floor(Math.random() * 400) + 100;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const result = await next();
    const duration = Date.now() - startTime;

    const rawInput = await getRawInput();

    switch (result.ok) {
      case true:
        logger.info({
          app: ctx.app,
          message: "request successful",
          route: path,
          type: type.toUpperCase(),
          duration,
          labels: {
            userId: ctx.session?.user.id ?? "unknown",
            impersonatedBy: ctx.session?.impersonatedBy?.id ?? "none",
          },
        });
        break;
      case false:
        logger.error({
          app: ctx.app,
          message: "request failed",
          route: path,
          type: type.toUpperCase(),
          duration,
          labels: {
            userId: ctx.session?.user.id ?? "unknown",
            impersonatedBy: ctx.session?.impersonatedBy?.id ?? "none",
            input: JSON.stringify(rawInput),
            errorCode: result.error.code,
            errorMessage: result.error.message,
            errorName: result.error.name,
          },
        });
        break;
    }

    // You could send metrics to your monitoring service here
    // Example: metrics.increment('trpc.success', { path, type });
    // Example: metrics.timing('trpc.duration', duration, { path, type });
    return result;
  },
);

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(telemetryMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(telemetryMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
