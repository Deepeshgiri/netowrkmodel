import { create } from 'zustand'
import type { KnowledgeNode } from '../data/knowledgeNodes'

type View = 'topology' | 'osi' | 'journey' | 'attack' | 'hardware'
type Panel = 'detail' | 'packet' | 'attack' | 'timeline' | null

interface AppState {
  activeView: View
  selectedNode: KnowledgeNode | null
  activePanel: Panel
  attackMode: boolean
  activeLayer: number | null
  journeyStep: number
  journeyPlaying: boolean
  zoomLevel: number
  highlightedLayer: number | null
  packetAnimating: boolean
  selectedAttack: string | null

  setView: (v: View) => void
  selectNode: (n: KnowledgeNode | null) => void
  setPanel: (p: Panel) => void
  toggleAttackMode: () => void
  setActiveLayer: (l: number | null) => void
  setJourneyStep: (s: number) => void
  setJourneyPlaying: (p: boolean) => void
  setZoom: (z: number) => void
  setHighlightedLayer: (l: number | null) => void
  setPacketAnimating: (a: boolean) => void
  setSelectedAttack: (a: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  activeView: 'topology',
  selectedNode: null,
  activePanel: null,
  attackMode: false,
  activeLayer: null,
  journeyStep: 0,
  journeyPlaying: false,
  zoomLevel: 1,
  highlightedLayer: null,
  packetAnimating: false,
  selectedAttack: null,

  setView: (v) => set({ activeView: v, selectedNode: null, activePanel: null }),
  selectNode: (n) => set({ selectedNode: n, activePanel: n ? 'detail' : null }),
  setPanel: (p) => set({ activePanel: p }),
  toggleAttackMode: () => set((s) => ({ attackMode: !s.attackMode })),
  setActiveLayer: (l) => set({ activeLayer: l }),
  setJourneyStep: (s) => set({ journeyStep: s }),
  setJourneyPlaying: (p) => set({ journeyPlaying: p }),
  setZoom: (z) => set({ zoomLevel: z }),
  setHighlightedLayer: (l) => set({ highlightedLayer: l }),
  setPacketAnimating: (a) => set({ packetAnimating: a }),
  setSelectedAttack: (a) => set({ selectedAttack: a }),
}))
