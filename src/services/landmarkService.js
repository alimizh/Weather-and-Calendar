const API = 'https://en.wikipedia.org/w/api.php'

async function geosearchTitles(lat, lon) {
  const url = new URL(API)
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'geosearch')
  url.searchParams.set('gscoord', `${lat}|${lon}`)
  url.searchParams.set('gsradius', '10000')
  url.searchParams.set('gslimit', '3')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url)
  if (!res.ok) throw new Error('Wikipedia geosearch failed')
  const json = await res.json()
  const items = json.query?.geosearch || []
  return items.map((p) => p.title)
}

async function getPageData(titles) {
  const url = new URL(API)
  url.searchParams.set('action', 'query')
  url.searchParams.set('titles', titles.join('|'))
  url.searchParams.set('prop', 'pageimages|extracts')
  url.searchParams.set('exintro', '1')
  url.searchParams.set('explaintext', '1')
  url.searchParams.set('piprop', 'thumbnail')
  url.searchParams.set('pithumbsize', '1200')
  url.searchParams.set('redirects', '1')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const res = await fetch(url)
  if (!res.ok) throw new Error('Wikipedia page query failed')
  const json = await res.json()
  const pages = Object.values(json.query?.pages || {})

  const page =
    pages.find((p) => !p.missing && p.thumbnail) ||
    pages.find((p) => !p.missing)

  if (!page) throw new Error('No matching Wikipedia page')

  return {
    title: page.title,
    image: page.thumbnail?.source || null,
    extract: page.extract || ''
  }
}

export async function fetchLandmark({ lat, lon }) {
  const titles = await geosearchTitles(lat, lon)
  if (titles.length === 0) throw new Error('No landmarks found near coordinates')
  return getPageData(titles)
}
