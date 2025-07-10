import { flag } from "flags/next";

export const accountFlag = flag({
  key: "account-flag",
  decide() {
    return true;
  },
});

export const jobFlag = flag({
  key: "job-flag",
  decide() {
    return false;
  },
});
