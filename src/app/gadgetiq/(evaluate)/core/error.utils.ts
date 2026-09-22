/**
 * Normalized Friendly Error Message Handler for Gadget Evaluate (XC-QC)
 * =====================================================================
 * Converts raw network errors, HTTP status errors, and technical exception strings
 * into clean, user-friendly human-readable messages.
 */

export function getFriendlyErrorMessage(err: any, fallbackMessage: string = "Something went wrong. Please try again."): string {
  if (!err) return fallbackMessage;

  // 1. If err is already a clean string
  if (typeof err === "string") {
    if (isTechnicalErrorString(err)) {
      return fallbackMessage;
    }
    return err;
  }

  // 2. Extract message from backend response if available
  const responseData = err.response?.data || err.data;
  const backendMsg = responseData?.message || responseData?.error || responseData?.RespMsg || err.message;

  // 3. Check for network / CORS / connection errors
  if (
    err.name === "TypeError" ||
    err.name === "NetworkError" ||
    err.name === "AbortError" ||
    (typeof backendMsg === "string" && (
      backendMsg.includes("Failed to fetch") ||
      backendMsg.includes("NetworkError") ||
      backendMsg.includes("network") ||
      backendMsg.includes("ECONNREFUSED") ||
      backendMsg.includes("timed out") ||
      backendMsg.includes("AbortError")
    ))
  ) {
    return "Unable to connect to evaluation service. Please check your network connection.";
  }

  // 4. Check for HTTP status codes
  const status = err.status || err.statusCode || err.response?.status;
  if (status === 401 || status === 403) {
    return "Session expired or unauthorized. Please log in again.";
  }
  if (status === 404) {
    return "The requested record was not found.";
  }
  if (status >= 500) {
    return "Evaluation service is currently unavailable. Please try again shortly.";
  }

  // 5. If we have a clean, non-technical backend message, use it
  if (typeof backendMsg === "string" && backendMsg.trim() && !isTechnicalErrorString(backendMsg)) {
    return backendMsg;
  }

  return fallbackMessage;
}

function isTechnicalErrorString(str: string): boolean {
  const technicalPatterns = [
    "TypeError",
    "SyntaxError",
    "ReferenceError",
    "Failed to fetch",
    "Unexpected token",
    "JSON.parse",
    "at ",
    "null is not",
    "undefined is not",
    "stack trace",
    "object Object",
    "AxiosError",
  ];
  return technicalPatterns.some((pattern) => str.includes(pattern));
}
