export default function parseDate(dateString) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}
