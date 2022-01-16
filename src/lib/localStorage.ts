const KEY = "entrants"

export function saveEntrants(entrants: string[]) {
  localStorage.setItem(KEY, JSON.stringify(entrants))
}

export function loadEntrants():string[] | undefined {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  }
  catch(err) {
    console.error(err)
  }
}