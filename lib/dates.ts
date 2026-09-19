// <input type="datetime-local"> has no timezone. Convert in the browser (editor's
// timezone) so the server — UTC on Vercel — never has to guess.
export const toLocalInput = (value: Date | string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

export const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : "");

export const formatDateTime = (value: Date | string | null | undefined) =>
  value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
