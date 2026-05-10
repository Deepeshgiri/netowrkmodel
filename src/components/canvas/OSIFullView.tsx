import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { KNOWLEDGE_NODES } from '../../data/knowledgeNodes'

const LAYER_COLORS = ['', '#ff6b35', '#ffcc00', '#00d4ff', '#00ff88', '#8b5cf6', '#ff3366', '#00ff88']
const LAYER_NAMES = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application']
const LAYER_DEVICES = ['', 'Hub, Repeater, Cable', 'Switch, Bridge, NIC', 'Router, L3 Switch', 'Firewall, Load Balancer', 'Gateway, Proxy', 'SSL Proxy, Gateway', 'Server, Browser, App']

export default function OSIFullView() {
  const { selectNode, activeLayer, setActiveLayer, attackMode } = useStore()

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto p-2" style={{ scrollbarWidth: 'thin' }}>
      <div className="text-center mb-2">
        <div className="text-sm font-bold text-[#00d4ff]">OSI Reference Model</div>
        <div className="text-xs text-[#40607080]">Click any layer to explore • 7 layers of network abstraction</div>
      </div>

      {/* OSI vs TCP/IP comparison header */}
      <div className="grid grid-cols-3 gap-1 mb-1">
        <div className="text-[9px] text-center text-[#00d4ff] font-bold py-1 rounded" style={{ background: '#00d4ff11', border: '1px solid #00d4ff33' }}>OSI MODEL</div>
        <div className="text-[9px] text-center text-[#60a0c0] py-1">←→</div>
        <div className="text-[9px] text-center text-[#00ff88] font-bold py-1 rounded" style={{ background: '#00ff8811', border: '1px solid #00ff8833' }}>TCP/IP MODEL</div>
      </div>

      {[7, 6, 5, 4, 3, 2, 1].map((layer) => {
        const node = KNOWLEDGE_NODES.find(n => n.layer === layer)
        const color = LAYER_COLORS[layer]
        const isActive = activeLayer === layer
        const tcpLabel = layer >= 5 ? 'Application' : layer === 4 ? 'Transport' : layer === 3 ? 'Internet' : 'Link'

        return (
          <motion.div
            key={layer}
            layout
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { setActiveLayer(isActive ? null : layer); if (node) selectNode(node) }}
            className="cursor-pointer rounded overflow-hidden"
            style={{
              border: `1px solid ${isActive ? color : color + '33'}`,
              boxShadow: isActive ? `0 0 16px ${color}33` : 'none',
            }}
          >
            <div className="flex items-stretch">
              {/* Layer number */}
              <div className="flex items-center justify-center w-8 text-xs font-bold flex-shrink-0"
                style={{ background: color + (isActive ? '44' : '22'), color }}>
                {layer}
              </div>

              {/* Main content */}
              <div className="flex-1 p-2" style={{ background: isActive ? color + '11' : '#050d1a' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{node?.icon}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: isActive ? color : '#a0c0e0' }}>
                        {LAYER_NAMES[layer]}
                      </div>
                      <div className="text-[9px] text-[#40607080]">{LAYER_DEVICES[layer]}</div>
                    </div>
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: color + '22', color, border: `1px solid ${color}44` }}>
                    {tcpLabel}
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && node && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: color + '33' }}>
                        <div className="text-[10px] text-[#80a0c0] mb-2">{node.description}</div>

                        {/* Protocols */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {node.relatedProtocols.map(p => (
                            <span key={p} className="text-[8px] px-1.5 py-0.5 rounded font-mono"
                              style={{ background: color + '22', color, border: `1px solid ${color}33` }}>
                              {p}
                            </span>
                          ))}
                        </div>

                        {/* Packet headers preview */}
                        {node.headers.length > 0 && (
                          <div className="flex gap-0.5 flex-wrap">
                            {node.headers.slice(0, 6).map((h, i) => (
                              <div key={i} className="text-[8px] px-1 py-0.5 rounded"
                                style={{ background: h.color + '44', border: `1px solid ${h.color}66`, color: h.color }}>
                                {h.name}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Attacks */}
                        {attackMode && node.attacks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {node.attacks.map(a => (
                              <span key={a.id} className="text-[8px] px-1.5 py-0.5 rounded"
                                style={{ background: '#ff336622', color: '#ff3366', border: '1px solid #ff336644' }}>
                                ⚠ {a.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Encapsulation arrow */}
      <div className="flex items-center justify-center gap-4 mt-2 py-2 rounded"
        style={{ background: '#00d4ff08', border: '1px solid #00d4ff22' }}>
        <div className="text-[9px] text-[#00d4ff80]">↓ Encapsulation (Sender)</div>
        <div className="text-[9px] text-[#00ff8880]">↑ Decapsulation (Receiver)</div>
      </div>
    </div>
  )
}
