import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Recipe from './pages/Recipe.jsx'
import Planner from './pages/Planner.jsx'

function parseHash(hash) {
  const path = hash.replace(/^#\/?/, '')
  if (!path) return { page: 'home' }
  if (path.startsWith('recipe/')) return { page: 'recipe', id: path.slice(7) }
  if (path === 'planner') return { page: 'planner' }
  return { page: 'home' }
}

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'recipes.json')
      .then(r => r.json())
      .then(data => { setRecipes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (path) => {
    window.location.hash = path
  }

  if (loading) {
    return (
      <div data-theme="a" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center' }}>
        <span className="script" style={{ fontSize: 28 }}>Loading recipes…</span>
      </div>
    )
  }

  return (
    <div data-theme="a" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} navigate={navigate} />
      <main style={{ flex: 1 }}>
        {route.page === 'home' && <Home recipes={recipes} navigate={navigate} />}
        {route.page === 'recipe' && <Recipe id={route.id} recipes={recipes} navigate={navigate} />}
        {route.page === 'planner' && <Planner recipes={recipes} navigate={navigate} />}
      </main>
      <Footer />
    </div>
  )
}
