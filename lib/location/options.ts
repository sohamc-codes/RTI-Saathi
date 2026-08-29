import { LOCAL_AUTHORITY_DATA } from "@/lib/authority/data";
import { MAHARASHTRA_LOCATION_CATALOG } from "./catalog";

export interface AreaOption { label: string; city: string; pincode: string }

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

/** States that have at least one authority record, so the directory lookup can resolve. */
export function listStateOptions(): string[] {
  return unique(LOCAL_AUTHORITY_DATA.filter((row) => row.active).map((row) => row.state));
}

/** Districts with authority coverage for the state, so Step 2 always has departments. */
export function listDistrictOptions(state: string): string[] {
  return unique(LOCAL_AUTHORITY_DATA.filter((row) => row.active && row.state === state).map((row) => row.district));
}

/** Cities and localities from the location catalog for the chosen district. */
export function listAreaOptions(state: string, district: string): AreaOption[] {
  const seen = new Map<string, AreaOption>();
  for (const entry of MAHARASHTRA_LOCATION_CATALOG) {
    if (entry.state.value?.name !== state || entry.district.value?.name !== district) continue;
    const city = entry.city.value?.name ?? "";
    const label = entry.locality.value?.name ?? city;
    if (!label || seen.has(label)) continue;
    seen.set(label, { label, city, pincode: entry.pincode.value ?? "" });
  }
  return Array.from(seen.values()).sort((left, right) => left.label.localeCompare(right.label));
}
