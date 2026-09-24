/**
 * Utility for dynamic, real-time age calculation from Date of Birth (DOB).
 * Automatically updates a profile's age year-after-year on their birthday.
 */

export function calculateAge(
  dob?: string | null,
  fallbackAge?: string | number | null
): string {
  if (!dob || dob === "N/A" || dob === "—" || dob.trim() === "") {
    return fallbackAge ? String(fallbackAge) : "—";
  }

  const cleanDob = dob.trim();
  let birthDate: Date | null = null;

  // Case 1: YYYY-MM-DD or YYYY/MM/DD (ISO standard, e.g., "1993-01-03")
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanDob)) {
    const parts = cleanDob.split(/[-/]/).map((n) => parseInt(n, 10));
    birthDate = new Date(parts[0], parts[1] - 1, parts[2]);
  }
  // Case 2: DD/MM/YYYY or DD-MM-YYYY (Indian standard, e.g., "03/01/1993" or "14/08/2000")
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanDob)) {
    const parts = cleanDob.split(/[-/]/).map((n) => parseInt(n, 10));
    birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
  }
  // Case 3: Other parseable date strings
  else {
    const parsed = new Date(cleanDob);
    if (!isNaN(parsed.getTime())) {
      birthDate = parsed;
    }
  }

  if (!birthDate || isNaN(birthDate.getTime())) {
    return fallbackAge ? String(fallbackAge) : "—";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Realistic age check for matrimony (15 to 110)
  if (age >= 15 && age <= 110) {
    return String(age);
  }

  return fallbackAge ? String(fallbackAge) : "—";
}

/**
 * Returns clean formatted DOB string for display.
 */
export function formatDisplayDob(dob?: string | null): string {
  if (!dob || dob === "N/A" || dob.trim() === "") return "N/A";
  
  const cleanDob = dob.trim();
  
  // If already DD/MM/YYYY, return directly
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDob)) {
    return cleanDob;
  }
  
  // If YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleanDob)) {
    const parts = cleanDob.split("-");
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
  }

  return cleanDob;
}
