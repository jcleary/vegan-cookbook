import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import Icon from '../components/Icon.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import FoodImage from '../components/FoodImage.jsx'

function FilterChips({ label, values, active, onToggle }) {
  if (values.length === 0) return null
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span className="eyebrow" style={{ marginRight: 4 }}>{label}</span>
      {values.map(v => (
        <button
          key={v}
          className={'chip' + (active.has(v) ? ' is-active' : '')}
          onClick={() => onToggle(v)}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

export default function Home({ recipes, navigate }) {
  const [query, setQuery] = useState('')
  const [activeFamily, setActiveFamily] = useState(new Set())
  const [activeCuisines, setActiveCuisines] = useState(new Set())
  const [activeTags, setActiveTags] = useState(new Set())

  const fuse = useMemo(() => new Fuse(recipes, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'description', weight: 1 },
      { name: 'tags', weight: 2 },
      { name: 'ingredients.item', weight: 2 },
      { name: 'cuisine', weight: 2 },
    ],
    threshold: 0.35,
    includeScore: true,
  }), [recipes])

  const allFamily = useMemo(() => {
    const s = new Set()
    recipes.forEach(r => r.liked_by?.forEach(n => s.add(n)))
    return [...s].sort()
  }, [recipes])

  const allCuisines = useMemo(() => {
    const s = new Set()
    recipes.forEach(r => s.add(r.cuisine))
    return [...s].sort()
  }, [recipes])

  const allTags = useMemo(() => {
    const s = new Set()
    recipes.forEach(r => r.tags?.forEach(t => s.add(t)))
    return [...s].sort()
  }, [recipes])

  const toggle = (setter) => (value) => {
    setter(prev => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  const hasFilters = query.trim() || activeFamily.size || activeCuisines.size || activeTags.size

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query.trim()).map(r => r.item)
      : recipes

    if (activeFamily.size) list = list.filter(r => [...activeFamily].every(n => r.liked_by?.includes(n)))
    if (activeCuisines.size) list = list.filter(r => activeCuisines.has(r.cuisine))
    if (activeTags.size) list = list.filter(r => r.tags?.some(t => activeTags.has(t)))

    return list
  }, [query, recipes, fuse, activeFamily, activeCuisines, activeTags])

  const clearAll = () => {
    setQuery('')
    setActiveFamily(new Set())
    setActiveCuisines(new Set())
    setActiveTags(new Set())
  }

  const alphabetical = useMemo(() =>
    [...recipes].sort((a, b) => a.name.localeCompare(b.name)),
    [recipes]
  )

  return (
    <div className="screen">
      {/* HERO */}
      <section className="wrap" style={{ paddingTop: 54, paddingBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,.95fr)', gap: 48, alignItems: 'center' }} className="hero-grid">
          <div>
            <span className="script" style={{ fontSize: 30, display: 'block', marginBottom: 6 }}>What shall we cook today?</span>
            <h1 style={{ fontSize: 'clamp(40px, 5.6vw, 70px)', lineHeight: 1.02 }}>
              Our family's<br />plant-based<br /><span style={{ color: 'var(--primary)' }}>recipe table.</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', marginTop: 22, maxWidth: 460 }}>
              Every dish we actually make — vegan, unfussy and tested round the kitchen table.
            </p>

            {/* search bar */}
            <div style={{ marginTop: 26, display: 'flex', gap: 10, maxWidth: 480 }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', border: '1.5px solid var(--line-strong)',
                borderRadius: 999, padding: '4px 6px 4px 18px', boxShadow: 'var(--shadow-sm)',
              }}>
                <Icon name="search" size={19} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search e.g. 'curry', 'pasta'…"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 16, color: 'var(--ink)', fontFamily: 'inherit', minWidth: 0,
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    style={{ background: 'var(--bg-2)', border: 'none', width: 30, height: 30, borderRadius: 999, display: 'grid', placeItems: 'center', color: 'var(--ink-soft)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* hero collage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, aspectRatio: '1 / 1' }} className="hero-collage">
            {recipes.slice(0, 4).map((r, i) => (
              <button
                key={r.id}
                onClick={() => navigate(`#/recipe/${r.id}`)}
                style={{
                  position: 'relative', border: 'none', padding: 0, cursor: 'pointer',
                  overflow: 'hidden', borderRadius: 'var(--card-radius)', boxShadow: 'var(--shadow-md)',
                  transform: i === 0 ? 'translateY(-12px)' : i === 3 ? 'translateY(12px)' : 'none',
                }}
              >
                <FoodImage recipe={r} />
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '26px 14px 12px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,.5))',
                  color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14,
                  fontWeight: 600, textAlign: 'left', lineHeight: 1.1,
                }}>
                  {r.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="wrap" style={{ marginTop: 48 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-l)', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 20 }}>Filter recipes</h2>
            {hasFilters && (
              <button className="btn btn-ghost" onClick={clearAll} style={{ padding: '7px 14px', fontSize: 13.5 }}>
                <Icon name="x" size={14} /> Clear all
              </button>
            )}
          </div>
          <FilterChips label="Family" values={allFamily} active={activeFamily} onToggle={toggle(setActiveFamily)} />
          <FilterChips label="Cuisine" values={allCuisines} active={activeCuisines} onToggle={toggle(setActiveCuisines)} />
          <FilterChips label="Tags" values={allTags} active={activeTags} onToggle={toggle(setActiveTags)} />
        </div>
      </section>

      {/* RECIPE GRID */}
      {hasFilters ? (
        <section className="wrap" style={{ marginTop: 36, paddingBottom: 60 }}>
          <p style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600, marginBottom: 22 }}>
            {results.length} {results.length === 1 ? 'recipe' : 'recipes'} found
          </p>
          {results.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}>
              {results.map(r => <RecipeCard key={r.id} recipe={r} navigate={navigate} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--bg-2)', display: 'grid', placeItems: 'center', margin: '0 auto 18px', color: 'var(--primary)' }}>
                <Icon name="search" size={30} />
              </div>
              <h3 style={{ fontSize: 22, color: 'var(--ink)' }}>No recipes found</h3>
              <p style={{ marginTop: 8, fontSize: 15.5 }}>Try different search terms or remove some filters.</p>
            </div>
          )}
        </section>
      ) : (
          <section className="wrap" style={{ marginTop: 64, paddingBottom: 60 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}>
              {alphabetical.map(r => <RecipeCard key={r.id} recipe={r} navigate={navigate} />)}
            </div>
          </section>
      )}
    </div>
  )
}
