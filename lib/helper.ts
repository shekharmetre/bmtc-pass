export function getPassDates(baseDate: Date = new Date()) {
  // Clone so we don't mutate the argument
  const issuedOn = new Date(baseDate);
  issuedOn.setDate(issuedOn.getDate() - 10); // subtract 10 days

  const validTill = new Date(issuedOn);
  validTill.setMonth(validTill.getMonth() + 1); // add 1 month from issuedOn

  const format = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return {
    issuedOn: format(issuedOn),
    validTill: format(validTill),
  };
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format and then replace commas/spaces to match exact style if needed
  const formatted = new Intl.DateTimeFormat("en-GB", options).format(date);
  return formatted // remove comma after year
}

export function parseBusData(qrString: string) {
  try {
    // Extract value inside pa=....@
    const paMatch = qrString.match(/pa=([\w\d]+)@/i);
    if (!paMatch) return null;

    const pa = paMatch[1]; // ka57f2271

    // Find prefix (letters + numbers until last 4 digits)
    const prefix = pa.slice(0, -4).toUpperCase(); // KA57F
    const busNumber = pa.slice(-4); // 2271

    const result = { prefix, busNumber, time: formatDate(new Date()) };

    // Save to localStorage (replace previous)
    localStorage.setItem("lastValidatedBus", JSON.stringify(result));

    return result;
  } catch (err) {
    console.error("Failed to parse bus QR:", err);
    return null;
  }
}
interface PassengerForm {
  name: string
  idType: "Aadhar"
  idNumber: string
  image?: string // Base64 string
}


export const getPassengerData = (): PassengerForm | null => {
  const data = localStorage.getItem("passengerForm")
  if (!data) return null
  try {
    return JSON.parse(data) as PassengerForm
  } catch (error) {
    console.error("Failed to parse passengerForm from localStorage:", error)
    return null
  }
}

// Universal helper
export function getValueFromArray<T extends { title?: string; [key: string]: any }>(
  arr: T[] | any,
  titleToFind: string,
  valueKey: keyof T
): any | undefined {
  if (!Array.isArray(arr)) return undefined;

  const found = arr.find(item => item && item.title === titleToFind);
  return found ? found[valueKey] : undefined;
}



