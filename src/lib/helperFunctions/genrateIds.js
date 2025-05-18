import { v4 as uuidv4 } from "uuid";

export function generateUUID() {
  return uuidv4(); // Returns a standard UUID
}

export function generateCustomID(prefix) {
  // Generate a UUID and remove dashes
  const uuidPart = uuidv4().replace(/-/g, "");

  // Extract a substring ensuring total length is max 8 characters
  const maxIDLength = 8 - prefix.length; // Remaining length after prefix
  const randomID = uuidPart.substring(0, maxIDLength).toUpperCase();

  return `${prefix}${randomID}`;
}
