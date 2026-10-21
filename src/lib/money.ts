/** Format paise to INR display string e.g. 49900 → "₹499.00" */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(paise) / 100);
}

/** Convert rupees (display) to paise (storage) */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/** Convert paise to rupees */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/** Add two paise amounts safely */
export function addPaise(a: number, b: number): number {
  return Math.round(a) + Math.round(b);
}

/** Calculate percentage discount in paise */
export function percentageDiscount(paise: number, percentage: number): number {
  return Math.round((paise * percentage) / 10000); // percentage is in basis points (5000 = 50%)
}
