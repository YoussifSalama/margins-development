
export const APPLICATION_STATUSES = ["new", "reviewed", "shortlisted", "rejected"] as const;

// ─── CV upload rules: the apply form shows them, the server enforces them ────

export const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
export const CV_ACCEPT = ".pdf,.doc,.docx";
export const CV_MAX_BYTES = 5 * 1024 * 1024;
