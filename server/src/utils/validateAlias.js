import { RESERVED_WORDS } from "./reservedWord.js";
import { ApiError } from "../utils/ApiError.js";

export const validateAlias = (alias) => {

  if (!alias) return null;

  const normalized = alias.trim().toLowerCase();

  // format validation
  const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;

  if (!aliasRegex.test(normalized)) {
    throw new ApiError(400, "Alias can only contain letters, numbers, _ or -");
  }

  // reserved words check
  if (RESERVED_WORDS.includes(normalized)) {
    throw new ApiError(400, "This alias is reserved");
  }

  return normalized;
};