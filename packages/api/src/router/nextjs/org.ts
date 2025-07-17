import type { TRPCRouterRecord } from "@trpc/server";

import { accessStep } from "./org/access";
import { all } from "./org/all";
import { contractorStep1, getContractorStep1 } from "./org/steps/step1";
import { contractorStep2, getContractorStep2 } from "./org/steps/step2";
import { contractorStep3, getContractorStep3 } from "./org/steps/step3";
import { contractorStep4, getContractorStep4 } from "./org/steps/step4";

export const orgRoute = {
  accessStep,
  all,
  getContractorStep1,
  getContractorStep2,
  getContractorStep3,
  getContractorStep4,
  contractorStep1,
  contractorStep2,
  contractorStep3,
  contractorStep4,
} satisfies TRPCRouterRecord;
