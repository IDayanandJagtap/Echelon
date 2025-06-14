export function formatDateString(date: Date|string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  export function getCurrentFormattedDate() {
    const date = new Date();
    return formatDateString(date);
  }
  