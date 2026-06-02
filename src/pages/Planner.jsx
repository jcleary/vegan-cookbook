import { useState, useMemo } from 'react'
import Icon from '../components/Icon.jsx'
import FoodImage from '../components/FoodImage.jsx'
import { formatIngredient, UNIT_SYSTEMS } from '../helpers.js'

const CATEGORY_ORDER = [
  'fresh produce',
  'tins & pulses',
  'pasta & rice',
  'dairy alternatives',
  'nuts & seeds',
  'oils & condiments',
  'herbs & spices',
  'baking',
]

function usePlanner() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fvc_planner') || '[]') } catch { return [] }
  })

  const save = (next) => {
    setEntries(next)
    localStorage.setItem('fvc_planner', JSON.stringify(next))
  }

  const remove = (id) => save(entries.filter(e => e.id !== id))
  const updateMult = (id, mult) => save(entries.map(e => e.id === id ? { ...e, mult } : e))
  const clear = () => save([])

  return { entries, remove, updateMult, clear }
}

function PortionScaler({ mult, onChange }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, background: 'var(--bg-2)', border: '1.5px solid var(--line)', borderRadius: 999, padding: 4 }}>
      {[1, 2, 3, 4].map(m => {
        const on = mult === m
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            style={{
              border: 'none', background: on ? 'var(--accent)' : 'transparent',
              color: on ? '#fff' : 'var(--ink-soft)', fontWeight: 800, fontSize: 13,
              width: 38, height: 32, borderRadius: 999, cursor: 'pointer',
              boxShadow: on ? 'var(--shadow-sm)' : 'none', transition: 'all .15s ease',
            }}
          >
            {m}×
          </button>
        )
      })}
    </div>
  )
}

function PlannerCard({ recipe, entry, onRemove, onUpdateMult, navigate }) {
  return (
    <div className="card" style={{ display: 'flex', gap: 0, overflow: 'hidden' }}>
      <button
        onClick={() => navigate(`#/recipe/${recipe.id}`)}
        style={{ width: 100, flexShrink: 0, border: 'none', padding: 0, cursor: 'pointer', position: 'relative' }}
      >
        <FoodImage recipe={recipe} />
      </button>
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <button
          onClick={() => navigate(`#/recipe/${recipe.id}`)}
          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
        >
          <h3 style={{ fontSize: 17, lineHeight: 1.2, color: 'var(--ink)' }}>{recipe.name}</h3>
          <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{recipe.cuisine}</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <PortionScaler mult={entry.mult} onChange={m => onUpdateMult(recipe.id, m)} />
          <button
            onClick={() => onRemove(recipe.id)}
            className="btn btn-ghost"
            style={{ padding: '6px 12px', fontSize: 13, color: 'var(--accent)', borderColor: 'transparent' }}
          >
            <Icon name="trash" size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  )
}

function buildShoppingList(entries, recipes) {
  const totals = {}

  for (const { id, mult } of entries) {
    const recipe = recipes.find(r => r.id === id)
    if (!recipe) continue

    for (const ing of recipe.ingredients) {
      if (ing.staple) continue

      const keyParts = `${ing.item.toLowerCase()}|${ing.unit}`
      if (totals[keyParts]) {
        totals[keyParts].qty += ing.qty * mult
      } else {
        totals[keyParts] = {
          ...ing,
          qty: ing.qty * mult,
          category: ing.category || 'other',
        }
      }
    }
  }

  const byCategory = {}
  for (const ing of Object.values(totals)) {
    const cat = ing.category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(ing)
  }

  return byCategory
}

function ShoppingList({ entries, recipes, system }) {
  const byCategory = useMemo(() => buildShoppingList(entries, recipes), [entries, recipes])

  const categories = CATEGORY_ORDER.filter(c => byCategory[c])
  const extra = Object.keys(byCategory).filter(c => !CATEGORY_ORDER.includes(c))

  if (entries.length === 0) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 28 }}>Shopping list</h2>
        <button className="btn btn-ghost no-print" onClick={() => window.print()} style={{ padding: '9px 18px' }}>
          <Icon name="printer" size={16} /> Print list
        </button>
      </div>

      <div className="shopping-list-print">
        {[...categories, ...extra].map(cat => {
          const items = byCategory[cat]
          if (!items) return null
          return (
            <div key={cat} className="print-category" style={{ marginBottom: 28 }}>
              <h3 style={{
                fontSize: 13, textTransform: 'uppercase', letterSpacing: '.12em',
                fontWeight: 800, color: 'var(--muted)', marginBottom: 10,
                paddingBottom: 6, borderBottom: '1px solid var(--line)',
              }}>
                {cat}
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {items.map((ing, i) => {
                  const { qty, unit } = formatIngredient(ing, system, 1)
                  const measure = [qty, unit].filter(Boolean).join(' ')
                  return (
                    <li key={i} className="print-item" style={{
                      display: 'flex', gap: 14, alignItems: 'baseline',
                      padding: '9px 8px', borderBottom: '1px solid var(--line)', fontSize: 15.5,
                    }}>
                      <span className="print-qty" style={{ minWidth: 80, fontWeight: 800, color: 'var(--primary-ink)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {measure || '—'}
                      </span>
                      <span style={{ color: 'var(--ink)' }}>{ing.item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Planner({ recipes, navigate }) {
  const { entries, remove, updateMult, clear } = usePlanner()
  const [system, setSystem] = useState(() => localStorage.getItem('fvc_units') || 'metric')

  const plannerRecipes = entries
    .map(e => ({ entry: e, recipe: recipes.find(r => r.id === e.id) }))
    .filter(({ recipe }) => !!recipe)

  return (
    <div className="screen">
      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <span className="eyebrow">This week</span>
            <h1 style={{ fontSize: 44, marginTop: 8 }}>Meal planner</h1>
          </div>
          {entries.length > 0 && (
            <button className="btn btn-ghost no-print" onClick={clear} style={{ color: 'var(--accent)' }}>
              <Icon name="trash" size={16} /> Clear planner
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--bg-2)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
              <Icon name="calendar" size={34} />
            </div>
            <h2 style={{ fontSize: 26, color: 'var(--ink)' }}>Your planner is empty</h2>
            <p style={{ marginTop: 10, fontSize: 16, maxWidth: 380, marginInline: 'auto' }}>
              Browse recipes and tap "Add to planner" to start building your week.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('#/')} style={{ marginTop: 24 }}>
              <Icon name="search" size={16} /> Browse recipes
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.6fr)', gap: 40, alignItems: 'start' }}>

            {/* PLANNED RECIPES */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>
                Planned meals <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 18 }}>({plannerRecipes.length})</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plannerRecipes.map(({ recipe, entry }) => (
                  <PlannerCard
                    key={recipe.id}
                    recipe={recipe}
                    entry={entry}
                    onRemove={remove}
                    onUpdateMult={updateMult}
                    navigate={navigate}
                  />
                ))}
              </div>
              <button className="btn btn-ghost no-print" onClick={() => navigate('#/')} style={{ marginTop: 20 }}>
                <Icon name="plus" size={16} /> Add more recipes
              </button>
            </div>

            {/* SHOPPING LIST */}
            <div>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="sliders" size={18} style={{ color: 'var(--accent)' }} /> Units
                </span>
                <div style={{ display: 'inline-flex', background: 'var(--bg-2)', border: '1.5px solid var(--line)', borderRadius: 999, padding: 4, gap: 3 }}>
                  {UNIT_SYSTEMS.map(t => {
                    const on = system === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSystem(t.id)}
                        style={{
                          border: 'none', background: on ? 'var(--surface)' : 'transparent',
                          color: on ? 'var(--primary-ink)' : 'var(--ink-soft)',
                          fontWeight: 700, fontSize: 13.5, padding: '7px 14px', borderRadius: 999,
                          cursor: 'pointer', boxShadow: on ? 'var(--shadow-sm)' : 'none',
                          transition: 'all .15s ease',
                        }}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <ShoppingList entries={entries} recipes={recipes} system={system} />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
