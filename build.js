import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const recipesDir = './recipes'
const outputPath = './public/recipes.json'

async function build() {
  const files = await readdir(recipesDir)
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort()

  const recipes = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await readFile(join(recipesDir, file), 'utf-8')
      return JSON.parse(content)
    })
  )

  await mkdir('./public', { recursive: true })
  await writeFile(outputPath, JSON.stringify(recipes, null, 2))
  console.log(`✓ Built recipes.json with ${recipes.length} recipes`)
}

build().catch(console.error)
