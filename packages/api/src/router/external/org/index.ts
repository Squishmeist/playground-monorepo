import type { TRPCRouterRecord } from "@trpc/server";

import { accessStep } from "./access";
import { contractorStep1, getContractorStep1 } from "./steps/step1";
import { contractorStep2, getContractorStep2 } from "./steps/step2";
import { contractorStep3, getContractorStep3 } from "./steps/step3";
import { contractorStep4, getContractorStep4 } from "./steps/step4";

export const orgRoute = {
  accessStep,
  getContractorStep1,
  getContractorStep2,
  getContractorStep3,
  getContractorStep4,
  contractorStep1,
  contractorStep2,
  contractorStep3,
  contractorStep4,
} satisfies TRPCRouterRecord;
