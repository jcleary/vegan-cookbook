import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 80, background: 'var(--bg-2)' }}>
      <div className="wrap" style={{ padding: '40px 28px', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, color: 'var(--ink-soft)' }}>
          <Icon name="leaf" size={20} style={{ color: 'var(--primary)' }} />
          <span className="script" style={{ fontSize: 24 }}>Cooked with love, the whole family in.</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          A home for our plant-based recipes · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
