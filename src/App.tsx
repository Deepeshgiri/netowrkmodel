import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import TopologyCanvas from './components/canvas/TopologyCanvas'
import OSIFullView from './components/canvas/OSIFullView'
import VisualizationCanvas from './components/canvas/VisualizationCanvas'
import OSIStack from './components/ui/OSIStack'
import DetailPanel from './components/panels/DetailPanel'
import JourneyTimeline from './components/panels/JourneyTimeline'
import AttackPanel from './components/panels/AttackPanel'
import HardwareView from './components/panels/HardwareView'

type View = 'topology' | 'osi' | 'journey' | 'attack' | 'hardware'

const VIEWS: { id: View; label: string; icon: string; color: string }[] = [
  { id: 'topology', label: 'Network Map', icon: '🌐', color: '#00d4ff' },
  { id: 'osi', label: 'OSI Model', icon: '📚', color: '#8b5cf6' },
  { id: 'journey', label: 'Packet Journey', icon: '🚀', color: '#00ff88' },
  { id: 'attack', label: 'Cyber Attacks', icon: '⚔️', color: '#ff3366' },
  { id: 'hardware', label: 'Hardware', icon: '🔲', color: '#ffcc00' },
]

function Navbar() {
  const { activeView, setView, attackMode, toggleAttackMode, packetAnimating, setPacketAnimating } = useStore()

  return (
    <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
      style={{ background: '#050d1a', borderBottom: '1px solid #0a2040' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="text-lg">🌐</motion.div>
        <div>
          <div className="text-xs font-bold text-[#00d4ff] tracking-widest">NETVIS</div>
          <div className="text-[8px] text-[#40607080] tracking-widest">INTERACTIVE NETWORK EXPLORER</div>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 flex-1">
        {VIEWS.map(v => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setView(v.id as any)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all"
            style={{
              background: activeView === v.id ? `${v.color}22` : 'transparent',
              border: `1px solid ${activeView === v.id ? v.color : '#0a2040'}`,
              color: activeView === v.id ? v.color : '#60a0c0',
              boxShadow: activeView === v.id ? `0 0 10px ${v.color}33` : 'none',
            }}
          >
            <span>{v.icon}</span>
            <span className="hidden sm:inline">{v.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAttackMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all"
          style={{
            background: attackMode ? '#ff336622' : 'transparent',
            border: `1px solid ${attackMode ? '#ff3366' : '#0a2040'}`,
            color: attackMode ? '#ff3366' : '#60a0c0',
            boxShadow: attackMode ? '0 0 10px #ff336633' : 'none',
          }}
        >
          {attackMode ? (
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>⚠ ATTACK MODE</motion.span>
          ) : '🛡 Defense'}
        </motion.button>

        <button
          onClick={() => setPacketAnimating(!packetAnimating)}
          className="px-3 py-1.5 rounded text-xs font-bold transition-all"
          style={{ background: '#00d4ff11', border: '1px solid #00d4ff33', color: '#00d4ff' }}
        >
          {packetAnimating ? '⏸' : '▶'} Packets
        </button>
      </div>
    </div>
  )
}

function StatusBar() {
  const { activeView, attackMode, activeLayer } = useStore()
  const [time, setTime] = useState(new Date())

  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  })

  return (
    <div className="flex items-center gap-4 px-4 py-1 text-[9px] font-mono flex-shrink-0"
      style={{ background: '#020408', borderTop: '1px solid #0a2040', color: '#40607080' }}>
      <span style={{ color: '#00ff8880' }}>● LIVE</span>
      <span>VIEW: {activeView.toUpperCase()}</span>
      {activeLayer && <span style={{ color: '#00d4ff80' }}>LAYER {activeLayer} ACTIVE</span>}
      {attackMode && <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: '#ff336680' }}>⚠ ATTACK SIMULATION ACTIVE</motion.span>}
      <span className="ml-auto">{time.toLocaleTimeString()}</span>
      <span>NETVIS v1.0</span>
    </div>
  )
}

function RightPanel() {
  const { selectedNode, activeView } = useStore()

  const content = () => {
    if (activeView === 'journey') return <JourneyTimeline />
    if (activeView === 'attack') return <AttackPanel />
    if (activeView === 'hardware') return <HardwareView />
    if (selectedNode) return <DetailPanel />
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl">🌐</motion.div>
        <div className="text-xs text-[#40607080]">Click any node to explore</div>
        <div className="text-[10px] text-[#30405060] max-w-32">Every component reveals its internal architecture, protocols, and attack surfaces</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ width: 280, borderLeft: '1px solid #0a2040', background: '#050d1a' }}>
      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #0a2040' }}>
        <div className="text-[9px] text-[#40607080] tracking-widest uppercase">
          {activeView === 'journey' ? '🚀 Packet Journey' :
           activeView === 'attack' ? '⚔️ Attack Simulator' :
           activeView === 'hardware' ? '🔲 Hardware View' :
           selectedNode ? `📋 ${selectedNode.title}` : '📋 Inspector'}
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-3">
        <AnimatePresence mode="wait">
          <motion.div key={activeView + (selectedNode?.id || '')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            {content()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function MainCanvas() {
  const { activeView } = useStore()
  return (
    <div className="flex-1 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
          {activeView === 'topology' && <TopologyCanvas />}
          {activeView === 'osi' && (
            <div className="flex h-full">
              <div className="flex-1 overflow-hidden p-4"><OSIFullView /></div>
              <div className="w-72 border-l border-[#0a2040] p-3 overflow-hidden"><VisualizationCanvas /></div>
            </div>
          )}
          {activeView === 'journey' && <TopologyCanvas />}
          {activeView === 'attack' && <TopologyCanvas />}
          {activeView === 'hardware' && (
            <div className="h-full flex items-center justify-center p-8"
              style={{ background: 'radial-gradient(ellipse at center, #020d1a 0%, #020408 100%)' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🔲</div>
                <div className="text-sm text-[#00d4ff] font-bold mb-2">Hardware Architecture Explorer</div>
                <div className="text-xs text-[#40607080]">Inspect the hardware panel →</div>
                <div className="mt-4 grid grid-cols-3 gap-3 max-w-sm">
                  {['CPU\nPacket Processing', 'NIC\nDMA Transfer', 'RAM\nSocket Buffers', 'PCIe\nHigh-speed Bus', 'UEFI\nFirmware', 'NVMe\nStorage'].map(item => (
                    <motion.div key={item} whileHover={{ scale: 1.05 }}
                      className="p-3 rounded text-center text-xs"
                      style={{ background: '#00d4ff11', border: '1px solid #00d4ff33', color: '#00d4ff' }}>
                      {item.split('\n').map((l, i) => <div key={i} className={i === 0 ? 'font-bold' : 'text-[9px] opacity-60'}>{l}</div>)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#020408' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — OSI stack */}
        <div className="flex-shrink-0 overflow-y-auto p-3"
          style={{ width: 180, borderRight: '1px solid #0a2040', background: '#050d1a', scrollbarWidth: 'thin' }}>
          <OSIStack />
        </div>

        {/* Main content */}
        <MainCanvas />

        {/* Right panel */}
        <RightPanel />
      </div>
      <StatusBar />
    </div>
  )
}
