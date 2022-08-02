export default function getCurrentRoe(score: number): {
  value: number
  frame: string
} {
  if (score < 25) return { value: 1, frame: 'roe_1' }
  if (score < 50) return { value: 2, frame: 'roe_2' }
  if (score < 75) return { value: 3, frame: 'roe_3' }
  if (score < 100) return { value: 4, frame: 'roe_4' }
  if (score >= 100) return { value: 5, frame: 'roe_5' }
  return { value: 1, frame: 'roe_1' }
}
