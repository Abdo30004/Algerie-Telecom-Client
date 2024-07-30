export function formatApiDate(date: string) {
  return new Date(date.split("-").reverse().join("-"));
}
