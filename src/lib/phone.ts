import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/min";
import type { CountryCode } from "libphonenumber-js";

/**
 * Shared phone-number validation (ITU-T E.164 / libphonenumber rules).
 *
 * - Numbers starting with "+" are validated against the numbering plan of the
 *   country their calling code belongs to (length, area/mobile prefixes).
 * - Numbers without a "+" are treated as national numbers of DEFAULT_COUNTRY.
 */
export const DEFAULT_PHONE_COUNTRY: CountryCode = "IN";

const ALLOWED_CHARS = /^\+?[0-9\s\-().]+$/;

/** Returns an error message, or null when the number is valid. */
export function getPhoneError(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): string | null {
  const phone = value.trim();
  if (!phone) return "Phone number is required";

  if (!ALLOWED_CHARS.test(phone) || phone.lastIndexOf("+") > 0) {
    return "Use digits only, with an optional leading + and country code";
  }

  if (!isValidPhoneNumber(phone, defaultCountry)) {
    return phone.startsWith("+")
      ? "Enter a valid phone number for this country code (e.g. +91 98765 43210)"
      : "Enter a valid phone number, or include your country code (e.g. +1 415 555 2671)";
  }

  return null;
}

/** Strips characters that can never be part of a phone number as the user types. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^0-9+\s\-().]/g, "").slice(0, 20);
}

/** E.164 form (e.g. +919876543210) for a valid number, otherwise the trimmed input. */
export function toE164(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): string {
  const parsed = parsePhoneNumberFromString(value.trim(), defaultCountry);
  return parsed?.isValid() ? parsed.number : value.trim();
}
