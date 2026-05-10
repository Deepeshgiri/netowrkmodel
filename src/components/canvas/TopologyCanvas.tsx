import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { KNOWLEDGE_NODES, NETWORK_TOPOLOGY_NODES } from '../../data/knowledgeNodes'

const LAYER_COLORS: Record<number, string> = { 1: '#ff6b35', 2: '#ffcc00', 3: '#00d4ff', 4: '#00ff88', 5: '#8b5cf6', 6: '#ff3366', 7: '#00ff88' }

interface Packet {
  id: number
  x: number
  progress: number
  color: string
  label: string
  segIndex: number
}

const SEGMENTS = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
  { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 },
]

export default function TopologyCanvas() {
  const { selectNode, attackMode, activeLayer } = useStore()
  const [packets, setPackets] = useState<Packet[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const packetIdRef = useRef(0)
  const frameRef = useRef(0)

  // Animate packets
  useEffect(() => {
    const interval = setInterval(() => {
      const segIndex = Math.floor(Math.random() * SEGMENTS.length)
      const colors = ['#00d4ff', '#00ff88', '#ff3366', '#ffcc00', '#8b5cf6']
      const labels = ['HTTP', 'DNS', 'TCP', 'TLS', 'UDP', 'ICMP', 'BGP']
      setPackets(prev => [
        ...prev.filter(p => p.progress < 1),
        {
          id: packetIdRef.current++,
          x: 0,
          progress: 0,
          color: attackMode ? '#ff3366' : colors[Math.floor(Math.random() * colors.length)],
          label: attackMode ? ['SYN', 'FLOOD', 'SPOOF', 'MITM'][Math.floor(Math.random() * 4)] : labels[Math.floor(Math.random() * labels.length)],
          segIndex,
        }
      ].slice(-20))
    }, attackMode ? 200 : 600)
    return () => clearInterval(interval)
  }, [attackMode])

  useEffect(() => {
    let last = performance.now()
    const animate = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setPackets(prev => prev.map(p => ({ ...p, progress: Math.min(1, p.progress + dt * 0.8) })).filter(p => p.progress < 1))
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.001)))
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.topology-node')) return
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const nodes = NETWORK_TOPOLOGY_NODES
  const canvasW = 1500, canvasH = 500

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ background: 'radial-gradient(ellipse at center, #020d1a 0%, #020408 100%)' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10" style={{ pointerEvents: 'none' }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main canvas */}
      <div
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          width: canvasW,
          height: canvasH,
          left: '50%',
          top: '50%',
          marginLeft: -canvasW / 2,
          marginTop: -canvasH / 2,
        }}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0" width={canvasW} height={canvasH} style={{ overflow: 'visible' }}>
          {SEGMENTS.map((seg, i) => {
            const from = nodes[seg.from]
            const to = nodes[seg.to]
            const isActive = activeLayer ? (from.layer === activeLayer || to.layer === activeLayer) : true
            return (
              <g key={i}>
                <line
                  x1={from.x + 40} y1={from.y + 30}
                  x2={to.x + 40} y2={to.y + 30}
                  stroke={isActive ? from.color + '44' : '#0a204044'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={attackMode ? '6,3' : 'none'}
                />
                {attackMode && (
                  <line
                    x1={from.x + 40} y1={from.y + 30}
                    x2={to.x + 40} y2={to.y + 30}
                    stroke="#ff336622"
                    strokeWidth={4}
                  />
                )}
              </g>
            )
          })}

          {/* Animated packets on lines */}
          {packets.map(p => {
            const seg = SEGMENTS[p.segIndex]
            if (!seg) return null
            const from = nodes[seg.from]
            const to = nodes[seg.to]
            const x = (from.x + 40) + (to.x - from.x) * p.progress
            const y = (from.y + 30) + (to.y - from.y) * p.progress
            return (
              <g key={p.id}>
                <circle cx={x} cy={y} r={5} fill={p.color} opacity={0.9}>
                  <animate attributeName="r" values="4;6;4" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <text x={x + 8} y={y - 4} fill={p.color} fontSize={8} fontFamily="monospace" opacity={0.8}>{p.label}</text>
                <circle cx={x} cy={y} r={10} fill="none" stroke={p.color} strokeWidth={1} opacity={0.3} />
              </g>
            )
          })}
        </svg>

        {/* Network nodes */}
        {nodes.map((node, i) => {
          const isHovered = hoveredNode === node.id
          const isHighlighted = !activeLayer || node.layer === activeLayer
          return (
            <motion.div
              key={node.id}
              className="topology-node absolute cursor-pointer"
              style={{ left: node.x, top: node.y - 20, width: 80 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => {
                const kNode = KNOWLEDGE_NODES.find(k => k.layer === node.layer)
                if (kNode) selectNode(kNode)
              }}
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{ opacity: isHighlighted ? 1 : 0.25 }}
              >
                {/* Node icon */}
                <motion.div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl relative"
                  style={{
                    background: `${node.color}22`,
                    border: `2px solid ${isHovered ? node.color : node.color + '66'}`,
                    boxShadow: isHovered ? `0 0 20px ${node.color}66, 0 0 40px ${node.color}33` : `0 0 8px ${node.color}22`,
                  }}
                  animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span>{node.icon}</span>
                  {/* Layer badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: LAYER_COLORS[node.layer], color: '#000' }}>
                    {node.layer}
                  </div>
                  {/* Attack indicator */}
                  {attackMode && (
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: '#ff336622', border: '2px solid #ff336666' }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-1 text-center">
                  <div className="text-[10px] font-bold" style={{ color: node.color }}>{node.label}</div>
                  <div className="text-[8px] text-[#40607080]">{node.sublabel}</div>
                </div>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-48 p-2 rounded text-[10px]"
                      style={{ background: '#050d1aee', border: `1px solid ${node.color}66`, backdropFilter: 'blur(8px)' }}
                    >
                      <div className="font-bold mb-1" style={{ color: node.color }}>{node.label}</div>
                      <div className="text-[#80a0c0]">{node.sublabel}</div>
                      <div className="text-[#40607080] mt-1">Layer {node.layer} • Click to explore</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        {[['＋', 0.2], ['－', -0.2], ['⊙', 0]].map(([label, delta]) => (
          <button key={label as string}
            onClick={() => delta === 0 ? (setZoom(1), setPan({ x: 0, y: 0 })) : setZoom(z => Math.max(0.4, Math.min(2.5, z + (delta as number))))}
            className="w-7 h-7 rounded text-xs font-bold transition-all hover:scale-110"
            style={{ background: '#050d1a', border: '1px solid #0a2040', color: '#00d4ff' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 text-[10px] font-mono" style={{ color: '#00d4ff44' }}>
        {Math.round(zoom * 100)}% • Scroll to zoom • Drag to pan
      </div>

      {/* Attack mode overlay */}
      {attackMode && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 60%, #ff336611 100%)', border: '2px solid #ff336622' }}
        />
      )}
    </div>
  )
}
