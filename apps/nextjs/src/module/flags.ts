import { flag } from "flags/next";

import { db } from "@squishmeist/db/client";

const flagCache = new Map<string, { value: boolean; expires: number }>();
// no cache in development, 10 minutes in production
const CACHE_TTL = process.env.NODE_ENV === "production" ? 10 * 60 * 1000 : 0;

async function getFlag(
  flagName: string,
  forceRefresh?: boolean,
): Promise<boolean> {
  if (forceRefresh) {
    flagCache.delete(flagName);
  }
  const cached = flagCache.get(flagName);
  if (cached && cached.expires > Date.now()) return cached.value;

  const flag = await db.query.flag.findFirst({
    where: (fields, { eq }) => eq(fields.name, flagName),
  });

  const enabled = flag?.enabled ?? false;
  flagCache.set(flagName, { value: enabled, expires: Date.now() + CACHE_TTL });

  return enabled;
}

export const accountFlag = flag({
  key: "account-flag",
  async decide() {
    return await getFlag("ACCOUNT");
  },
});

export const jobFlag = flag({
  key: "job-flag",
  async decide() {
    return await getFlag("JOB");
  },
});
