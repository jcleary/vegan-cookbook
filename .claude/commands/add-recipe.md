# Add Recipe

Convert a recipe from a URL or screenshot/photo into the project's JSON format and add it to the cookbook.

## Input

The user will provide one of:
- A URL to a recipe page
- A screenshot or photo of a recipe (from a cookbook, website, etc.)

## Steps

### 1. Extract the recipe

If given a URL, fetch the page and parse the recipe content.

If given a screenshot of a website, read the text from the image.

If given a photo of a recipe book page, read the text — and also look for any photo of the completed dish in the same image or nearby (e.g. a photo on the same page or the facing page). If there's a dish photo, crop it and save to `public/images/recipes/<id>.jpg`.

### 2. Ask about family preferences

Ask: **Which family members like this recipe?**
Options: Jack, Lucas, Fleur, Sally, John (multi-select, or "not sure yet" for an empty array).

### 3. Build the JSON

Save to `recipes/<id>.json` using this schema:

```json
{
  "id": "kebab-case-slug",
  "name": "Full Recipe Name",
  "description": "One-sentence description, mention time and key appeal.",
  "cuisine": "e.g. Italian / Indian / American",
  "servings": 4,
  "prep": 10,
  "cook": 20,
  "tags": ["e.g. Dinner", "Kid friendly", "Quick"],
  "liked_by": ["John", "Sally"],
  "glyph": "🍜",
  "c1": "#hex",
  "c2": "#hex",
  "difficulty": "Easy | Medium | Hard",
  "ingredients": [
    {
      "item": "chickpeas, drained",
      "qty": 400,
      "unit": "g",
      "type": "mass",
      "key": "chickpeas",
      "category": "tinned goods",
      "staple": false,
      "note": null
    }
  ],
  "steps": [
    "Step one as a complete sentence.",
    "Step two."
  ],
  "notes": "Optional tips, substitutions, or serving suggestions. null if none."
}
```

**Field notes:**
- `id`: filename slug, e.g. `chana-saag`
- `type`: `"mass"` (g/kg), `"vol"` (ml/l), `"spoon"` (tsp/tbsp), `"count"` (pieces, pinches)
- `unit`: `"g"`, `"kg"`, `"ml"`, `"l"`, `"tsp"`, `"tbsp"`, `"piece"`, `"pinch"`
- `category`: `"fresh produce"`, `"tinned goods"`, `"pasta & rice"`, `"dairy alternatives"`, `"oils & condiments"`, `"herbs & spices"`, `"baking"`, `"frozen"`
- `staple`: `true` for pantry staples (salt, oil, spices), `false` for shopping items
- `c1`/`c2`: pick two colours inspired by the dish (c1 = lighter, c2 = darker)
- `glyph`: single emoji that best represents the dish

### 4. Handle the dish image

**From a website URL:** If a clear hero/dish photo exists on the page, download it:
```bash
wget -O public/images/recipes/<id>.jpg "<image-url>"
```

**From a cookbook photo:** If the image contains a photo of the finished dish, crop it from the original image and save to `public/images/recipes/<id>.jpg`.

If no image is available, skip this step — a placeholder will be used.

## Output

Confirm the file was written: `recipes/<id>.json` (and `public/images/recipes/<id>.jpg` if an image was saved).
