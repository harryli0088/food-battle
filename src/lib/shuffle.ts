/**
 * Fisher-Yates shuffle, in-place
 * https://stackoverflow.com/a/12646864
 * @param array array to shuffle
 * @returns     original array, shuffled
 */
export default function shuffle<T>(array:T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}