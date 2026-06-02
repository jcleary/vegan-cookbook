import { useState } from 'react'

function cuisineImagePath(cuisine) {
  return `./images/cuisine/${cuisine.toLowerCase().replace(/ /g, '-')}.jpg`
}

export default function FoodImage({ recipe }) {
  const recipeImgSrc = `./images/recipes/${recipe.id}.jpg`
  const cuisineImgSrc = cuisineImagePath(recipe.cuisine)
  const [src, setSrc] = useState(recipeImgSrc)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (src === recipeImgSrc) {
      setSrc(cuisineImgSrc)
    } else {
      setFailed(true)
    }
  }

  return (
    <div
      className="foodimg"
      style={{ background: `linear-gradient(145deg, ${recipe.c1 || '#8a9e5a'}, ${recipe.c2 || '#4a5e2a'})` }}
    >
      <span className="glyph" aria-hidden="true">{recipe.glyph || '🍽️'}</span>
      {!failed && (
        <img
          src={src}
          alt={recipe.name}
          onError={handleError}
          style={{ display: failed ? 'none' : 'block' }}
        />
      )}
    </div>
  )
}
