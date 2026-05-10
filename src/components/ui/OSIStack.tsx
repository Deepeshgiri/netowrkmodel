import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { KNOWLEDGE_NODES } from '../../data/knowledgeNodes'
import type { KnowledgeNode } from '../../data/knowledgeNodes'

const LAYER_COLORS = ['', '#ff6b35', '#ffcc00', '#00d4ff', '#00ff88', '#8b5cf6', '#ff3366', '#00ff88']
const LAYER_NAMES = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application']

export default function OSIStack() {
  const { activeLayer, setActiveLayer, selectNode, attackMode } = useStore()

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="text-xs text-[#00d4ff] font-bold mb-2 tracking-widest uppercase opacity-70">OSI Model</div>
      {[7, 6, 5, 4, 3, 2, 1].map((layer) => {
        const node = KNOWLEDGE_NODES.find((n: KnowledgeNode) => n.layer === layer)
        const color = LAYER_COLORS[layer]
        const isActive = activeLayer === layer
        return (
          <motion.div
            key={layer}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveLayer(isActive ? null : layer)
              if (node) selectNode(node)
            }}
            className="relative cursor-pointer rounded px-3 py-2 flex items-center gap-2 transition-all"
            style={{
              background: isActive ? `${color}22` : 'rgba(5,13,26,0.8)',
              border: `1px solid ${isActive ? color : '#0a2040'}`,
              boxShadow: isActive ? `0 0 12px ${color}44` : 'none',
            }}
          >
            <div className="text-xs font-bold w-4 opacity-50" style={{ color }}>{layer}</div>
            <div className="text-sm font-bold" style={{ color: isActive ? color : '#a0c0e0' }}>
              {node?.icon} {LAYER_NAMES[layer]}
            </div>
            {attackMode && node && node.attacks.length > 0 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-auto text-xs px-1 rounded"
                style={{ background: '#ff336622', color: '#ff3366', border: '1px solid #ff336644' }}
              >
                {node.attacks.length} ⚠
              </motion.div>
            )}
            {isActive && (
              <motion.div
                layoutId="layer-indicator"
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l"
                style={{ background: color }}
              />
            )}
          </motion.div>
        )
      })}
      <div className="mt-2 pt-2 border-t border-[#0a2040]">
        <div className="text-xs text-[#0a2040] text-center">TCP/IP Model</div>
        {[
          { label: 'Application', layers: '5-7', color: '#00ff88' },
          { label: 'Transport', layers: '4', color: '#00ff88' },
          { label: 'Internet', layers: '3', color: '#00d4ff' },
          { label: 'Link', layers: '1-2', color: '#ffcc00' },
        ].map(t => (
          <div key={t.label} className="text-xs px-2 py-1 mt-1 rounded opacity-60"
            style={{ border: `1px solid ${t.color}33`, color: t.color }}>
            {t.label} <span className="opacity-50">(L{t.layers})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
