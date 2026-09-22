/**
 * User Onboarding & Approval API Client
 * =====================================
 * Re-exports onboarding service and types for application-wide use.
 */

export * from "@/app/gadgetiq/(lens)/onboarding/types";
export * from "@/app/gadgetiq/(lens)/onboarding/services";

import { onboardingService } from "@/app/gadgetiq/(lens)/onboarding/services";
export const brahmaOnboarding = onboardingService;
