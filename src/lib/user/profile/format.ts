export function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
}

export function eventYear(dateString: string) {
  const date = new Date(dateString);
  return date.getFullYear();
}