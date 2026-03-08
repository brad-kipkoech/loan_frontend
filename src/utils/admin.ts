export const ADMIN_EMAILS = [
  "admin@company.com",
  "owner@company.com",
  "bradley@company.com"
];

export function isAdmin(email?: string) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}