/* Unit conversion + portion scaling
   format(ingredient, system, multiplier) → { qty, unit }
   systems: "metric" | "us" | "uk"
*/

const G_PER_OZ = 28.3495
const ML_US_CUP = 236.588
const ML_TBSP = 14.787
const ML_TSP = 4.929
const ML_FLOZ_UK = 28.413
const ML_PINT_UK = 568.261

const VULGAR = { 0.25: '¼', 0.5: '½', 0.75: '¾', 0.333: '⅓', 0.667: '⅔' }

function frac(value, denom = 4) {
  if (value === 0) return '0'
  let whole = Math.floor(value)
  let rem = Math.round((value - whole) * denom) / denom
  if (rem >= 1) { whole += 1; rem = 0 }
  const glyph = VULGAR[rem] || ''
  if (!glyph && rem > 0) {
    return (whole + rem).toFixed(1).replace(/\.0$/, '')
  }
  if (whole === 0) return glyph || '0'
  return glyph ? whole + glyph : String(whole)
}

function num(v) {
  if (Math.abs(v - Math.round(v)) < 0.001) return String(Math.round(v))
  const r = Math.round(v * 4) / 4
  return frac(r, 4)
}

function plural(n, word) {
  return Math.abs(n - 1) < 0.001 ? word : word + 's'
}

function formatMass(grams, system) {
  if (system === 'metric') {
    if (grams >= 1000) return { qty: num(grams / 1000), unit: 'kg' }
    return { qty: String(Math.round(grams)), unit: 'g' }
  }
  const oz = grams / G_PER_OZ
  if (oz >= 16) {
    const lb = oz / 16
    return { qty: frac(lb, 4), unit: plural(lb, 'lb') }
  }
  return { qty: frac(oz, 4), unit: 'oz' }
}

function formatVol(ml, system) {
  if (system === 'metric') {
    if (ml >= 1000) return { qty: num(ml / 1000), unit: 'l' }
    return { qty: String(Math.round(ml)), unit: 'ml' }
  }
  if (system === 'us') {
    if (ml >= 120) {
      const cups = ml / ML_US_CUP
      return { qty: frac(cups, 4), unit: plural(cups, 'cup') }
    }
    if (ml >= 15) {
      const t = ml / ML_TBSP
      return { qty: frac(t, 2), unit: 'tbsp' }
    }
    const t = ml / ML_TSP
    return { qty: frac(t, 4), unit: 'tsp' }
  }
  // uk
  if (ml >= ML_PINT_UK * 0.5) {
    const pt = ml / ML_PINT_UK
    return { qty: frac(pt, 4), unit: plural(pt, 'pint') }
  }
  if (ml >= 15) {
    const fl = ml / ML_FLOZ_UK
    return { qty: frac(fl, 2), unit: 'fl oz' }
  }
  const t = ml / ML_TSP
  return { qty: frac(t, 4), unit: 'tsp' }
}

export function formatIngredient(ing, system, mult) {
  const q = ing.qty * mult

  if (ing.type === 'mass') return formatMass(q, system)
  if (ing.type === 'vol') return formatVol(q, system)

  if (ing.type === 'spoon') {
    return { qty: frac(q, 4), unit: ing.unit }
  }

  // count
  if (ing.unit === 'to taste') return { qty: '', unit: 'to taste' }
  if (ing.unit === 'piece') return { qty: num(q), unit: '' }
  if (ing.unit === 'pinch') return { qty: num(q), unit: plural(q, 'pinch').replace('pinchs', 'pinches') }
  return { qty: num(q), unit: plural(q, ing.unit) }
}

export const UNIT_SYSTEMS = [
  { id: 'metric', label: 'Metric' },
  { id: 'us', label: 'US cups' },
  { id: 'uk', label: 'UK imperial' },
]
