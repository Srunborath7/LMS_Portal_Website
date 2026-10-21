const CC = "855";

/** Convert what the user typed to E.164 for the API. Returns null if empty. */
export function toE164(input: string | null | undefined): string | null {
  if (!input) return null;
  let value = input.trim().replace(/[\s\-().]/g, "");
  if (!value) return null;

  const has00Prefix = value.startsWith("00");
  if (has00Prefix) value = value.slice(2);
  const hasInternationalPrefix = has00Prefix || value.startsWith("+");
  let digits = value.replace(/^\+/, "");
  if (!/^\d+$/.test(digits)) return null;

  if (!hasInternationalPrefix) {
    if (digits.startsWith("0")) digits = `${CC}${digits.slice(1)}`;
    else if (!digits.startsWith(CC)) return null;
  }

  // Some callers provide the Cambodian trunk zero after the country code.
  if (digits.startsWith(`${CC}0`)) digits = `${CC}${digits.slice(CC.length + 1)}`;
  return `+${digits}`;
}

export function isValidPhone(input: string): boolean {
  const v = toE164(input);
  return (
    v !== null &&
    (v.startsWith(`+${CC}`)
      ? /^\+855[1-9]\d{7,8}$/.test(v)
      : /^\+[1-9]\d{7,14}$/.test(v))
  );
}

/** Show +855974242347 as 097 424 2347 in the UI. */
export function toLocalDisplay(e164: string | null | undefined): string {
  if (!e164) return "";
  if (!e164.startsWith(`+${CC}`)) return e164;
  const n = "0" + e164.slice(CC.length + 1); // 0974242347
  return n.replace(/^(\d{3})(\d{3})(\d+)$/, "$1 $2 $3");
}
