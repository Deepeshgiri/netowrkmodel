export interface DrillNode {
  id: string
  title: string
  icon: string
  color: string
  summary: string
  explanation: string
  facts?: string[]
  children?: DrillNode[]
}
