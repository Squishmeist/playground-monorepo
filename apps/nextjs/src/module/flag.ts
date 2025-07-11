import { flag } from "flags/next";

import { db } from "@squishmeist/db/client";

const flagCache = new Map<string, { value: boolean; expires: number }>();
// no cache in development, 10 minutes in production
const CACHE_TTL = process.env.NODE_ENV === "production" ? 10 * 60 * 1000 : 0;

async function getFlag(flagName: string): Promise<boolean> {
  const cached = flagCache.get(flagName);
  if (cached && cached.expires > Date.now()) return cached.value;

  const flag = await db.query.flag.findFirst({
    where: (fields, { eq }) => eq(fields.name, flagName),
  });

  const enabled = flag?.enabled ?? false;
  flagCache.set(flagName, { value: enabled, expires: Date.now() + CACHE_TTL });

  return enabled;
}

function createFlag(flagName: string) {
  const flagInstance = flag({
    key: `${flagName.toLowerCase()}-flag`,
    async decide() {
      return await getFlag(flagName);
    },
  });

  return async (forceRefresh?: boolean): Promise<boolean> => {
    if (forceRefresh) flagCache.delete(flagName);
    return await flagInstance();
  };
}

export const accountFlag = createFlag("ACCOUNT");
export const jobFlag = createFlag("JOB");
