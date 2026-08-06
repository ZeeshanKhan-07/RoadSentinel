export function fmt(n) {
  if (n === null || n === undefined) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function fmtRupee(n) {
  if (n === null || n === undefined) return "₹0";
  return "₹" + Number(n).toLocaleString("en-IN");
}