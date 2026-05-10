import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import type { KnowledgeNode } from '../../data/knowledgeNodes'

function PacketHeader({ fields }: { fields: KnowledgeNode['headers'] }) {
  return (
    <div className="mt-3">
      <div className="text-xs text-[#00d4ff] font-bold mb-2 tracking-widest uppercase">Packet Structure</div>
      <div className="flex flex-wrap gap-0.5">
        {fields.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative group cursor-pointer"
            style={{ flex: `${Math.max(f.bits / 32, 1)} 0 0` }}
          >
            <div
              className="px-1 py-1.5 rounded text-center overflow-hidden"
              style={{ background: f.color + '44', border: `1px solid ${f.color}88`, minWidth: 32 }}
            >
              <div className="text-[9px] font-bold truncate" style={{ color: f.color }}>{f.name}</div>
              <div className="text-[8px] text-[#60a0c0] truncate">{f.bits}b</div>
            </div>
            <div className="absolute bottom-full left-0 mb-1 z-50 hidden group-hover:block w-48 p-2 rounded text-xs"
              style={{ background: '#050d1a', border: `1px solid ${f.color}66` }}>
              <div className="font-bold" style={{ color: f.color }}>{f.name}</div>
              <div className="text-[#a0c0e0] mt-1">{f.description}</div>
              <div className="text-[#60a0c0] mt-1 font-mono text-[10px]">Value: {f.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function DetailPanel() {
  const { selectedNode, setPanel } = useStore()

  if (!selectedNode) return null

  return (
    <AnimatePresence>
      <motion.div
        key={selectedNode.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col gap-3 h-full overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedNode.icon}</span>
              <div>
                <div className="font-bold text-sm" style={{ color: selectedNode.color }}>{selectedNode.title}</div>
                <div className="text-xs text-[#60a0c0]">{selectedNode.subtitle}</div>
              </div>
            </div>
          </div>
          <button onClick={() => setPanel(null)} className="text-[#60a0c0] hover:text-white text-lg leading-none">×</button>
        </div>

        {/* Description */}
        <div className="text-xs text-[#a0c0e0] leading-relaxed p-2 rounded"
          style={{ background: `${selectedNode.color}11`, border: `1px solid ${selectedNode.color}33` }}>
          {selectedNode.description}
        </div>

        {/* Deep Dive */}
        <div>
          <div className="text-xs font-bold text-[#00d4ff] mb-1 tracking-widest uppercase">Technical Deep Dive</div>
          <div className="text-xs text-[#80a0c0] leading-relaxed">{selectedNode.deepDive}</div>
        </div>

        {/* Packet Headers */}
        {selectedNode.headers.length > 0 && <PacketHeader fields={selectedNode.headers} />}

        {/* Key Facts */}
        <div>
          <div className="text-xs font-bold text-[#00d4ff] mb-1 tracking-widest uppercase">Key Facts</div>
          <div className="flex flex-col gap-1">
            {selectedNode.facts.map((f, i) => (
              <div key={i} className="text-xs text-[#80a0c0] flex gap-2">
                <span style={{ color: selectedNode.color }}>▸</span>{f}
              </div>
            ))}
          </div>
        </div>

        {/* Related Protocols */}
        <div>
          <div className="text-xs font-bold text-[#00d4ff] mb-1 tracking-widest uppercase">Protocols</div>
          <div className="flex flex-wrap gap-1">
            {selectedNode.relatedProtocols.map(p => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded font-mono"
                style={{ background: `${selectedNode.color}22`, border: `1px solid ${selectedNode.color}44`, color: selectedNode.color }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Attacks */}
        {selectedNode.attacks.length > 0 && (
          <div>
            <div className="text-xs font-bold text-[#ff3366] mb-1 tracking-widest uppercase flex items-center gap-1">
              <span>⚠</span> Attack Vectors
            </div>
            <div className="flex flex-col gap-2">
              {selectedNode.attacks.map(a => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-2 rounded cursor-pointer"
                  style={{ background: '#ff336611', border: '1px solid #ff336633' }}
                  onClick={() => useStore.getState().setSelectedAttack(a.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#ff3366]">{a.name}</div>
                    <span className={`text-[9px] px-1 rounded ${
                      a.severity === 'critical' ? 'bg-red-900 text-red-300' :
                      a.severity === 'high' ? 'bg-orange-900 text-orange-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>{a.severity.toUpperCase()}</span>
                  </div>
                  <div className="text-[10px] text-[#a06070] mt-1">{a.description}</div>
                  <div className="text-[10px] text-[#00ff8880] mt-1">🛡 {a.mitigation}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
