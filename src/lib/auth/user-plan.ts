export type UserPlan = "Free" | "Pro";

export function resolveUserPlan(value: unknown): UserPlan {
  if (typeof value !== "string") {
    return "Free";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "pro") {
    return "Pro";
  }

  return "Free";
}
