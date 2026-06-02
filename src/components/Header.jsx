import Icon from './Icon.jsx'

function Logo({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center',
        background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-sm)',
      }}>
        <Icon name="leaf" size={22} stroke={2} />
      </span>
      <span style={{ textAlign: 'left', lineHeight: 1 }}>
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 'var(--display-weight)',
          fontSize: 19, letterSpacing: 'var(--display-spacing)', whiteSpace: 'nowrap', color: 'var(--ink)',
        }}>
          The Family Table
        </span>
        <span style={{
          display: 'block', fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--muted)', fontWeight: 700, marginTop: 2,
        }}>
          Vegan Cookbook
        </span>
      </span>
    </button>
  )
}

export default function Header({ route, navigate }) {
  const navItems = [
    { hash: '#/', label: 'Home', icon: 'leaf', page: 'home' },
    { hash: '#/planner', label: 'Planner', icon: 'calendar', page: 'planner' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'color-mix(in srgb, var(--bg) 86%, transparent)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 74 }}>
        <Logo onClick={() => navigate('#/')} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {navItems.map(item => {
            const active = route.page === item.page
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.hash)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: active ? 'var(--surface)' : 'transparent',
                  border: active ? '1.5px solid var(--line-strong)' : '1.5px solid transparent',
                  color: active ? 'var(--primary-ink)' : 'var(--ink-soft)',
                  padding: '9px 15px', borderRadius: 999, fontSize: 14.5, fontWeight: 700,
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  transition: 'all .15s ease', cursor: 'pointer',
                }}
              >
                <Icon name={item.icon} size={17} />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
