import { useState } from 'react'
import Icon from './Icon.jsx'
import FoodImage from './FoodImage.jsx'

const FAMILY_INITIALS = { John: 'J', Sally: 'S', Jack: 'Ja', Lucas: 'L', Fleur: 'F' }
const FAMILY_COLORS = { John: '#5d7043', Sally: '#cb764b', Jack: '#9b7b4f', Lucas: '#4f8a5e', Fleur: '#b14430' }

function FamilyAvatars({ likedBy }) {
  if (!likedBy || likedBy.length === 0) return null
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {likedBy.map(name => (
        <span
          key={name}
          title={name}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: FAMILY_COLORS[name] || 'var(--primary)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            display: 'grid',
            placeItems: 'center',
            border: '2px solid var(--surface)',
          }}
        >
          {(FAMILY_INITIALS[name] || name[0]).slice(0, 2)}
        </span>
      ))}
    </div>
  )
}

function MetaPill({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
      <Icon name={icon} size={15} style={{ color: 'var(--muted)' }} />
      {children}
    </span>
  )
}

export default function RecipeCard({ recipe, navigate }) {
  const [hovered, setHovered] = useState(false)
  const total = recipe.prep + recipe.cook

  return (
    <button
      className="card"
      onClick={() => navigate(`#/recipe/${recipe.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        background: 'var(--surface)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        borderColor: hovered ? 'var(--line-strong)' : 'var(--line)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden' }}>
        <FoodImage recipe={recipe} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
          backdropFilter: 'blur(4px)', color: 'var(--ink)',
          fontSize: 11.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
          padding: '5px 11px', borderRadius: 999,
        }}>
          {recipe.cuisine}
        </span>
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{ fontSize: 20, lineHeight: 1.12 }}>{recipe.name}</h3>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.45, flex: 1 }}>{recipe.description}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
          {recipe.tags && recipe.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: 11.5, fontWeight: 700, color: 'var(--primary-ink)',
              background: 'var(--primary-soft)', padding: '3px 9px', borderRadius: 999,
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, paddingTop: 12, borderTop: '1px solid var(--line)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <MetaPill icon="clock">{total} min</MetaPill>
            <MetaPill icon="users">Serves {recipe.servings}</MetaPill>
          </div>
          <FamilyAvatars likedBy={recipe.liked_by} />
        </div>
      </div>
    </button>
  )
}
