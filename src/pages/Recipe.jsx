import { useState, useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import FoodImage from '../components/FoodImage.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import { formatIngredient, UNIT_SYSTEMS } from '../helpers.js'

function Segmented({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-2)', border: '1.5px solid var(--line)', borderRadius: 999, padding: 4, gap: 3 }}>
      {tabs.map(t => {
        const on = value === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              border: 'none',
              background: on ? 'var(--surface)' : 'transparent',
              color: on ? 'var(--primary-ink)' : 'var(--ink-soft)',
              fontWeight: 700, fontSize: 14, padding: '8px 16px', borderRadius: 999,
              cursor: 'pointer', boxShadow: on ? 'var(--shadow-sm)' : 'none',
              transition: 'all .15s ease',
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

function PortionScaler({ mult, setMult }) {
  return (
    <div style={{ display: 'inline-flex', gap: 5, background: 'var(--bg-2)', border: '1.5px solid var(--line)', borderRadius: 999, padding: 5 }}>
      {[1, 2, 3, 4].map(m => {
        const on = mult === m
        return (
          <button
            key={m}
            onClick={() => setMult(m)}
            style={{
              border: 'none',
              background: on ? 'var(--accent)' : 'transparent',
              color: on ? '#fff' : 'var(--ink-soft)',
              fontWeight: 800, fontSize: 15, width: 46, height: 38, borderRadius: 999,
              cursor: 'pointer', boxShadow: on ? 'var(--shadow-sm)' : 'none',
              transition: 'all .15s ease',
            }}
          >
            {m}×
          </button>
        )
      })}
    </div>
  )
}

function IngredientRow({ ing, system, mult }) {
  const [done, setDone] = useState(false)
  const { qty, unit } = formatIngredient(ing, system, mult)
  const measure = [qty, unit].filter(Boolean).join(' ')

  return (
    <li
      onClick={() => setDone(d => !d)}
      style={{
        display: 'flex', gap: 14, alignItems: 'baseline',
        padding: '11px 8px', borderRadius: 10, cursor: 'pointer',
        transition: 'background .12s ease', opacity: done ? 0.45 : 1,
        background: 'transparent',
      }}
      onMouseEnter={e => { if (!done) e.currentTarget.style.background = 'var(--bg-2)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{
        flexShrink: 0, minWidth: 80, fontWeight: 800, fontSize: 15, color: done ? 'var(--muted)' : 'var(--primary-ink)',
        fontVariantNumeric: 'tabular-nums', textDecoration: done ? 'line-through' : 'none',
      }}>
        {measure || '—'}
      </span>
      <span style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.4, textDecoration: done ? 'line-through' : 'none' }}>
        {ing.item}
        {ing.note && (
          <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: 13.5 }}> · {ing.note}</span>
        )}
      </span>
    </li>
  )
}

function Stat({ icon, label, value, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        <Icon name={icon} size={14} /> {label}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: accent ? 'var(--accent)' : 'var(--ink)' }}>
        {value}
      </span>
    </div>
  )
}

function usePlanner() {
  const [planner, setPlanner] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fvc_planner') || '[]') } catch { return [] }
  })

  const addToPlanner = (id, mult) => {
    setPlanner(prev => {
      const filtered = prev.filter(e => e.id !== id)
      const next = [...filtered, { id, mult }]
      localStorage.setItem('fvc_planner', JSON.stringify(next))
      return next
    })
  }

  const removeFromPlanner = (id) => {
    setPlanner(prev => {
      const next = prev.filter(e => e.id !== id)
      localStorage.setItem('fvc_planner', JSON.stringify(next))
      return next
    })
  }

  const isInPlanner = (id) => planner.some(e => e.id === id)

  return { planner, addToPlanner, removeFromPlanner, isInPlanner }
}

export default function Recipe({ id, recipes, navigate }) {
  const recipe = recipes.find(r => r.id === id)
  const [system, setSystem] = useState(() => localStorage.getItem('fvc_units') || 'metric')
  const [mult, setMult] = useState(1)
  const { addToPlanner, removeFromPlanner, isInPlanner } = usePlanner()
  const inPlanner = isInPlanner(id)

  useEffect(() => { localStorage.setItem('fvc_units', system) }, [system])

  if (!recipe) {
    return (
      <div className="wrap" style={{ padding: 60 }}>
        <h2>Recipe not found</h2>
        <button className="btn btn-ghost" onClick={() => navigate('#/')} style={{ marginTop: 16 }}>
          <Icon name="back" size={16} /> Back home
        </button>
      </div>
    )
  }

  const total = recipe.prep + recipe.cook
  const scaledServes = recipe.servings * mult
  const more = recipes.filter(r => r.cuisine === recipe.cuisine && r.id !== recipe.id).slice(0, 3)
  const moreToShow = more.length ? more : recipes.filter(r => r.id !== recipe.id).slice(0, 3)

  const handlePlannerToggle = () => {
    if (inPlanner) {
      removeFromPlanner(id)
    } else {
      addToPlanner(id, mult)
    }
  }

  return (
    <div className="screen">
      <div className="wrap" style={{ paddingTop: 22, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={() => navigate('#/')} style={{ padding: '9px 16px' }}>
          <Icon name="back" size={16} /> Back
        </button>
      </div>

      {/* HERO */}
      <section className="wrap" style={{ paddingTop: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.02fr)', gap: 40, alignItems: 'center' }} className="recipe-hero">
          <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 'var(--radius-l)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <FoodImage recipe={recipe} />
            <span style={{
              position: 'absolute', top: 16, left: 16,
              background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
              color: 'var(--ink)', fontSize: 12, fontWeight: 800,
              letterSpacing: '.06em', textTransform: 'uppercase', padding: '6px 13px', borderRadius: 999,
            }}>
              {recipe.cuisine}
            </span>
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.04 }}>{recipe.name}</h1>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', marginTop: 16, maxWidth: 520 }}>{recipe.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
              {recipe.tags?.map(t => (
                <span key={t} className="chip" style={{ cursor: 'default', background: 'var(--primary-soft)', borderColor: 'transparent', color: 'var(--primary-ink)' }}>
                  {t}
                </span>
              ))}
            </div>
            {recipe.liked_by?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600 }}>
                <Icon name="heart" size={15} style={{ color: 'var(--accent)' }} />
                <span>Loved by {recipe.liked_by.join(', ')}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <Stat icon="clock" label="Prep" value={`${recipe.prep} min`} />
              <Stat icon="flame" label="Cook" value={`${recipe.cook} min`} />
              <Stat icon="spark" label="Total" value={`${total} min`} />
              <Stat icon="users" label="Serves" value={scaledServes} accent={mult > 1} />
              {recipe.difficulty && <Stat icon="bowl" label="Skill" value={recipe.difficulty} />}
            </div>
            <div style={{ marginTop: 24 }}>
              <button
                className={inPlanner ? 'btn btn-ghost' : 'btn btn-accent'}
                onClick={handlePlannerToggle}
              >
                {inPlanner ? <><Icon name="check" size={16} /> In planner</> : <><Icon name="calendar" size={16} /> Add to planner</>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL BAR */}
      <section className="wrap no-print" style={{ marginTop: 40 }}>
        <div className="card recipe-controls" style={{ padding: '18px 22px', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>
              <Icon name="sliders" size={18} style={{ color: 'var(--accent)' }} /> Units
            </span>
            <Segmented tabs={UNIT_SYSTEMS} value={system} onChange={setSystem} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>
              <Icon name="users" size={18} style={{ color: 'var(--accent)' }} /> Portions
            </span>
            <PortionScaler mult={mult} setMult={setMult} />
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>= serves {scaledServes}</span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="wrap" style={{ marginTop: 36 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 48, alignItems: 'start' }} className="recipe-body">

          {/* INGREDIENTS */}
          <div style={{ position: 'sticky', top: 92 }} className="ingredients-col">
            <div className="card" style={{ padding: '24px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontSize: 24 }}>Ingredients</h2>
                {mult > 1 && (
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', background: 'var(--accent)', padding: '3px 9px', borderRadius: 999 }}>
                    scaled {mult}×
                  </span>
                )}
              </div>
              <p className="no-print" style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 8 }}>Tap an item to check it off as you go.</p>
              <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
                {recipe.ingredients.map((ing, i) => (
                  <IngredientRow key={i} ing={ing} system={system} mult={mult} />
                ))}
              </ul>
            </div>
          </div>

          {/* METHOD + NOTES */}
          <div>
            <h2 style={{ fontSize: 28, marginBottom: 8 }}>Method</h2>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 20, padding: '18px 0', borderBottom: i < recipe.steps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <span style={{
                    flexShrink: 0, width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center',
                    background: 'var(--primary-soft)', color: 'var(--primary-ink)',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'var(--ink)', paddingTop: 6 }}>{step}</p>
                </li>
              ))}
            </ol>

            {recipe.notes && (
              <div style={{
                marginTop: 30, background: 'var(--accent-soft)', borderRadius: 'var(--radius-l)',
                padding: '26px 28px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon name="note" size={22} style={{ color: 'var(--accent)' }} />
                  <span className="script" style={{ fontSize: 26 }}>Notes from the family</span>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink)', maxWidth: 620 }}>{recipe.notes}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MORE */}
      {moreToShow.length > 0 && (
        <section className="wrap no-print" style={{ marginTop: 74, paddingBottom: 20 }}>
          <h2 style={{ fontSize: 28, marginBottom: 20 }}>More to try</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}>
            {moreToShow.map(r => <RecipeCard key={r.id} recipe={r} navigate={navigate} />)}
          </div>
        </section>
      )}
    </div>
  )
}
