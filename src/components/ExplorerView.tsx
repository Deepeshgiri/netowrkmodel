import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  fetchNode, fetchCategories, getColor, getIcon, hasChildren,
  type DataNode, type CategoryNode,
} from '../data/dataLoader'

type StackEntry =
  | { kind: 'home' }
  | { kind: 'category'; cat: CategoryNode }
  | { kind: 'node'; node: DataNode }

interface Version { version: string; year?: number; status?: string; feature?: string }
interface StepItem { step: number; name?: string; direction?: string; description: string; action?: string }
interface PortEntry { port: number; protocol: string }
interface HeaderField { name: string; bits: number; description: string; example: string }
interface LayerInfo { number: number; name: string; id: string; pdu: string; color: string; icon: string; devices: string[] }
interface ComparisonRow { aspect: string; tcpip: string; osi: string }
interface EncapsulationStep { layer: string; action: string; pdu: string }
interface WrapperSection { id: string; title: string; icon: string; color: string; description: string; items: WrapperItem[] }
interface WrapperItem { id: string; name: string; description: string }

function Badge({ label, color }: { label: string; color: string }): React.ReactElement {
  return (
    <span className="text-[10px] px-2 py-1 rounded font-mono font-semibold"
      style={{ background: color + '15', color, border: `1.5px solid ${color}` }}>
      {label}
    </span>
  )
}

function Section({ title, color, children, icon }: { title: string; color: string; children: React.ReactNode; icon?: string }) {
  return (
    <div className="rounded-lg border-2 overflow-hidden" style={{ borderColor: color + '40', background: '#0a1628' }}>
      <div className="px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2" 
        style={{ background: color + '10', borderColor: color + '40', color }}>
        {icon && <span className="text-lg">{icon}</span>}
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function CategoryCard({ cat, onClick }: { cat: CategoryNode; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg"
      style={{ 
        background: '#0a1628',
        borderColor: cat.color + '60',
        boxShadow: `0 0 20px ${cat.color}15`
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl p-2 rounded" style={{ background: cat.color + '15' }}>{cat.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-base mb-1" style={{ color: cat.color }}>{cat.title}</div>
          <div className="text-xs" style={{ color: cat.color + '99' }}>{cat.children.length} topics</div>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3">{cat.description}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-wrap gap-1">
          {cat.children.slice(0, 3).map(c => (
            <span key={c} className="px-2 py-0.5 rounded text-[10px]" 
              style={{ background: cat.color + '20', color: cat.color }}>
              {c}
            </span>
          ))}
          {cat.children.length > 3 && (
            <span className="text-gray-600">+{cat.children.length - 3}</span>
          )}
        </div>
        <span className="font-semibold" style={{ color: cat.color }}>→</span>
      </div>
    </motion.div>
  )
}

function NodeCard({ id, onClick, index }: { id: string; onClick: (n: DataNode) => void; index: number }) {
  const [node, setNode] = useState<DataNode | null>(null)

  useEffect(() => { fetchNode(id).then(n => { if (n) setNode(n) }) }, [id])

  if (!node) {
    return (
      <div className="rounded-lg border-2 p-3 animate-pulse"
        style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-gray-700" />
          <div className="h-3 rounded w-2/3 bg-gray-700" />
        </div>
        <div className="h-2 rounded w-full bg-gray-700 mb-1" />
        <div className="h-2 rounded w-3/4 bg-gray-700" />
      </div>
    )
  }

  const color = getColor(node)
  const icon = getIcon(node)
  const childCount = Array.isArray(node.children) ? (node.children as string[]).length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(node)}
      className="cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-lg"
      style={{ 
        background: '#0a1628',
        borderColor: color + '60',
        boxShadow: `0 0 15px ${color}10`
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="text-2xl p-1.5 rounded flex-shrink-0" style={{ background: color + '15' }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm mb-1" style={{ color }}>{node.title}</div>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {node.osiLayer && <Badge label={`Layer ${node.osiLayer}`} color={color} />}
            {node.port && <Badge label={`Port ${node.port}`} color={color} />}
            {node.type && <Badge label={node.type} color={color} />}
          </div>
        </div>
        {childCount > 0 && (
          <div className="text-xs font-bold px-2 py-1 rounded flex-shrink-0"
            style={{ background: color + '20', color }}>
            {childCount}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">{node.description}</p>
      {node.cybersecurity && Array.isArray((node.cybersecurity as Record<string, unknown>).attacks) &&
        ((node.cybersecurity as Record<string, string[]>).attacks).length > 0 && (
        <div className="text-[10px] px-2 py-1 rounded inline-block" style={{ background: '#ff336620', color: '#ff6688' }}>
          ⚠ {((node.cybersecurity as Record<string, string[]>).attacks).length} attack vectors
        </div>
      )}
    </motion.div>
  )
}

function NodeDetail({ node, pushNode }: { node: DataNode; pushNode: (n: DataNode) => void }) {
  const color = getColor(node)
  const icon = getIcon(node)
  const [expandedAttack, setExpandedAttack] = useState<string | null>(null)
  const [expandedDefense, setExpandedDefense] = useState<string | null>(null)
  const [attackData, setAttackData] = useState<Record<string, DataNode>>({})
  const [defenseData, setDefenseData] = useState<Record<string, DataNode>>({})

  const header = node.header as { size: string; fields: HeaderField[] } | undefined
  const steps = node.steps as StepItem[] | undefined
  const versions = node.versions as Version[] | undefined
  const ports = node.ports as { usedBy: PortEntry[] } | undefined
  const cyber = node.cybersecurity as { attacks?: string[]; defenses?: string[] } | undefined
  const layers = node.layers as LayerInfo[] | undefined
  const comparison = node.comparison as { title: string; differences: ComparisonRow[] } | undefined
  const encapsulation = node.encapsulation as EncapsulationStep[] | undefined
  const sections = node.sections as WrapperSection[] | undefined

  const toggleAttack = async (id: string) => {
    if (expandedAttack === id) {
      setExpandedAttack(null)
    } else {
      setExpandedAttack(id)
      if (!attackData[id]) {
        const data = await fetchNode(id)
        if (data) setAttackData(prev => ({ ...prev, [id]: data }))
      }
    }
  }

  const toggleDefense = async (id: string) => {
    if (expandedDefense === id) {
      setExpandedDefense(null)
    } else {
      setExpandedDefense(id)
      if (!defenseData[id]) {
        const data = await fetchNode(id)
        if (data) setDefenseData(prev => ({ ...prev, [id]: data }))
      }
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">

      {/* Header Card */}
      <div className="rounded-lg border-2 p-5" style={{ background: '#0a1628', borderColor: color + '60' }}>
        <div className="flex items-start gap-4">
          <div className="text-5xl p-3 rounded" style={{ background: color + '15' }}>{icon}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2" style={{ color }}>{node.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {node.osiLayer && <Badge label={`OSI Layer ${node.osiLayer}`} color={color} />}
              {node.port != null && <Badge label={`Port ${node.port}`} color={color} />}
              {node.transport && (
                <Badge
                  label={Array.isArray(node.transport) ? String(node.transport[0]) : String(node.transport)}
                  color={color}
                />
              )}
              {node.type && <Badge label={node.type} color={color} />}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {String(node.fullExplanation || node.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Internet Wrapper - OSINT-like Sections */}
      {sections && sections.length > 0 && (
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <Section key={idx} title={section.title} color={section.color} icon={section.icon}>
              <div className="text-xs text-gray-400 mb-4">{section.description}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={async () => {
                      const data = await fetchNode(item.id)
                      if (data) pushNode(data)
                    }}
                    className="text-left p-3 rounded-lg border-2 hover:bg-gray-900/30 transition-all"
                    style={{ background: '#0f1f35', borderColor: section.color + '40' }}>
                    <div className="font-bold text-sm mb-1" style={{ color: section.color }}>{item.name}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </button>
                ))}
              </div>
            </Section>
          ))}
        </div>
      )}

      {/* OSI Layers Table */}
      {layers && layers.length > 0 && (
        <Section title="OSI Model - 7 Layers" color={color} icon="📚">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2" style={{ borderColor: color + '40' }}>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Layer</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Name</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>PDU</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Devices</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((layer, i) => (
                  <tr key={i} className="border-b hover:bg-gray-900/30" style={{ borderColor: '#1e3a5f' }}>
                    <td className="py-3 px-3">
                      <span className="font-bold text-lg" style={{ color: layer.color }}>
                        {layer.icon} {layer.number}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold" style={{ color: layer.color }}>{layer.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 rounded text-xs font-mono font-bold" 
                        style={{ background: layer.color + '20', color: layer.color }}>
                        {layer.pdu}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-400">{layer.devices.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* TCP/IP vs OSI Comparison */}
      {comparison && (
        <Section title={comparison.title} color={color} icon="⚖️">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2" style={{ borderColor: color + '40' }}>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Aspect</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>TCP/IP Model</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>OSI Model</th>
                </tr>
              </thead>
              <tbody>
                {comparison.differences.map((diff, i) => (
                  <tr key={i} className="border-b hover:bg-gray-900/30" style={{ borderColor: '#1e3a5f' }}>
                    <td className="py-3 px-3 font-semibold" style={{ color }}>{diff.aspect}</td>
                    <td className="py-3 px-3 text-gray-300">{diff.tcpip}</td>
                    <td className="py-3 px-3 text-gray-300">{diff.osi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Encapsulation Process */}
      {encapsulation && encapsulation.length > 0 && (
        <Section title="Encapsulation Process" color={color} icon="📦">
          <div className="space-y-3">
            {encapsulation.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 p-3 rounded-lg border-2"
                style={{ background: '#0f1f35', borderColor: color + '40' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: color + '30', color: '#fff' }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold mb-1" style={{ color }}>{step.layer}</div>
                  <div className="text-xs text-gray-300 mb-1">{step.action}</div>
                  <div className="text-xs">
                    <span className="px-2 py-1 rounded font-mono font-bold" 
                      style={{ background: color + '20', color }}>
                      PDU: {step.pdu}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Packet/Frame Structure */}
      {header && (
        <Section title="Packet / Frame Structure" color={color} icon="📦">
          <div className="mb-3 text-xs font-semibold px-2 py-1 rounded inline-block" 
            style={{ background: color + '15', color }}>
            Header Size: {header.size}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2" style={{ borderColor: color + '40' }}>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Field Name</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Bits</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Description</th>
                  <th className="text-left py-2 px-3 font-bold" style={{ color }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {header.fields.map((f, i) => (
                  <tr key={i} className="border-b hover:bg-gray-900/30" style={{ borderColor: '#1e3a5f' }}>
                    <td className="py-2 px-3 font-semibold" style={{ color }}>{String(f.name)}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-1 rounded font-mono font-bold" style={{ background: color + '15', color }}>
                        {String(f.bits)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{String(f.description)}</td>
                    <td className="py-2 px-3 font-mono text-gray-300">{String(f.example)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Process Steps */}
      {steps && steps.length > 0 && (
        <Section title="Process Steps" color={color} icon="⚙️">
          <div className="space-y-3">
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 p-3 rounded-lg border-2"
                style={{ background: '#0f1f35', borderColor: color + '40' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: color + '30', color: '#fff' }}>{s.step}</div>
                <div className="flex-1">
                  {s.name && <div className="text-sm font-bold mb-1" style={{ color }}>{s.name}</div>}
                  {s.direction && <div className="text-xs text-gray-500 mb-1">{s.direction}</div>}
                  <div className="text-xs text-gray-300">{s.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Versions */}
      {versions && versions.length > 0 && (
        <Section title="Versions & Evolution" color={color} icon="📋">
          <div className="space-y-2">
            {versions.map((v, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border"
                style={{ background: '#0f1f35', borderColor: color + '30' }}>
                <div className="font-bold text-sm w-32 flex-shrink-0" style={{ color }}>{v.version}</div>
                {v.year && <div className="text-xs text-gray-500 w-16 flex-shrink-0">{v.year}</div>}
                <div className="text-xs text-gray-300 flex-1">{v.feature || v.status}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Key Facts */}
      {node.keyFacts && (node.keyFacts as string[]).length > 0 && (
        <Section title="Key Facts" color={color} icon="⚡">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(node.keyFacts as string[]).map((f, i) => (
              <div key={i} className="flex gap-2 items-start text-sm p-3 rounded-lg border"
                style={{ background: '#0f1f35', borderColor: color + '30' }}>
                <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color }}>▸</span>
                <span className="text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Port Numbers */}
      {ports?.usedBy && ports.usedBy.length > 0 && (
        <Section title="Port Numbers" color={color} icon="🚪">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {ports.usedBy.map((p, i) => (
              <div key={i} className="p-3 rounded-lg border-2 text-center"
                style={{ background: '#0f1f35', borderColor: color + '50' }}>
                <div className="font-bold text-lg mb-1" style={{ color }}>{p.port}</div>
                <div className="text-xs text-gray-400">{p.protocol}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Security - Expandable */}
      {(cyber?.attacks?.length || cyber?.defenses?.length) ? (
        <Section title="Security" color="#ff3366" icon="🔐">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cyber?.attacks && cyber.attacks.length > 0 && (
              <div>
                <div className="text-xs font-bold text-[#ff3366] mb-3 tracking-widest uppercase px-2 py-1 rounded inline-block"
                  style={{ background: '#ff336620', border: '1.5px solid #ff3366' }}>
                  ⚠ Attack Vectors ({cyber.attacks.length})
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {cyber.attacks.map(a => (
                    <div key={a}>
                      <button 
                        onClick={() => toggleAttack(a)}
                        className="w-full text-xs px-3 py-2 rounded border-2 text-left hover:bg-[#ff336620] transition-all flex items-center justify-between"
                        style={{ background: expandedAttack === a ? '#ff336630' : '#ff336611', borderColor: '#ff336640', color: '#ff8899' }}>
                        <span className="font-semibold">{a}</span>
                        <span className="text-[10px]">{expandedAttack === a ? '▼' : '▶'}</span>
                      </button>
                      {expandedAttack === a && attackData[a] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 rounded border-2 text-xs"
                          style={{ background: '#0f1f35', borderColor: '#ff336640' }}>
                          <div className="font-bold mb-2 text-[#ff6688]">{attackData[a].title}</div>
                          <div className="text-gray-400 mb-2">{attackData[a].description}</div>
                          {attackData[a].keyFacts && (
                            <div className="space-y-1">
                              {(attackData[a].keyFacts as string[]).slice(0, 3).map((f, i) => (
                                <div key={i} className="flex gap-2 text-gray-300">
                                  <span className="text-[#ff6688]">•</span>{f}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cyber?.defenses && cyber.defenses.length > 0 && (
              <div>
                <div className="text-xs font-bold text-[#00ff88] mb-3 tracking-widest uppercase px-2 py-1 rounded inline-block"
                  style={{ background: '#00ff8820', border: '1.5px solid #00ff88' }}>
                  🛡 Defenses ({cyber.defenses.length})
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {cyber.defenses.map(d => (
                    <div key={d}>
                      <button 
                        onClick={() => toggleDefense(d)}
                        className="w-full text-xs px-3 py-2 rounded border-2 text-left hover:bg-[#00ff8820] transition-all flex items-center justify-between"
                        style={{ background: expandedDefense === d ? '#00ff8830' : '#00ff8811', borderColor: '#00ff8840', color: '#80ffcc' }}>
                        <span className="font-semibold">{d}</span>
                        <span className="text-[10px]">{expandedDefense === d ? '▼' : '▶'}</span>
                      </button>
                      {expandedDefense === d && defenseData[d] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 rounded border-2 text-xs"
                          style={{ background: '#0f1f35', borderColor: '#00ff8840' }}>
                          <div className="font-bold mb-2 text-[#80ffcc]">{defenseData[d].title}</div>
                          <div className="text-gray-400 mb-2">{defenseData[d].description}</div>
                          {defenseData[d].keyFacts && (
                            <div className="space-y-1">
                              {(defenseData[d].keyFacts as string[]).slice(0, 3).map((f, i) => (
                                <div key={i} className="flex gap-2 text-gray-300">
                                  <span className="text-[#80ffcc]">•</span>{f}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      ) : null}

      {/* Related Concepts */}
      {node.relatedConcepts && (node.relatedConcepts as string[]).length > 0 && (
        <Section title="Related Concepts" color={color} icon="🔗">
          <div className="flex flex-wrap gap-2">
            {(node.relatedConcepts as string[]).map(r => <Badge key={r} label={r} color={color} />)}
          </div>
        </Section>
      )}

      {/* Dependencies */}
      {((node.dependsOn as string[] | undefined)?.length || (node.usedBy as string[] | undefined)?.length) ? (
        <Section title="Dependencies" color={color} icon="📎">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(node.dependsOn as string[] | undefined) && (
              <div>
                <div className="text-xs text-gray-500 mb-2 font-semibold">Depends on</div>
                <div className="flex flex-wrap gap-2">
                  {(node.dependsOn as string[]).map(d => <Badge key={d} label={d} color={color} />)}
                </div>
              </div>
            )}
            {(node.usedBy as string[] | undefined) && (
              <div>
                <div className="text-xs text-gray-500 mb-2 font-semibold">Used by</div>
                <div className="flex flex-wrap gap-2">
                  {(node.usedBy as string[]).map(u => <Badge key={u} label={u} color={color} />)}
                </div>
              </div>
            )}
          </div>
        </Section>
      ) : null}
    </div>
  )
}

function Breadcrumb({ stack, onJump }: { stack: StackEntry[]; onJump: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6 px-4 py-3 rounded-lg border-2" 
      style={{ background: '#0a1628', borderColor: '#1e3a5f' }}>
      <button onClick={() => onJump(-1)} 
        className="text-sm font-semibold px-3 py-1.5 rounded transition-all hover:bg-cyan-500/20"
        style={{ color: '#00d4ff' }}>
        🏠 Home
      </button>
      {stack.slice(1).map((entry, i) => {
        const label = entry.kind === 'category' ? entry.cat.title
          : entry.kind === 'node' ? entry.node.title : ''
        const color = entry.kind === 'category' ? entry.cat.color
          : entry.kind === 'node' ? getColor(entry.node) : '#00d4ff'
        const isLast = i === stack.length - 2
        return (
          <span key={i} className="flex items-center gap-2">
            <span className="text-gray-600">›</span>
            <button onClick={() => onJump(i + 1)}
              className="text-sm font-semibold px-3 py-1.5 rounded transition-all hover:bg-gray-700/50"
              style={{ color: isLast ? color : '#6b7280' }}>
              {label}
            </button>
          </span>
        )
      })}
    </div>
  )
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
      {children}
    </div>
  )
}

export default function ExplorerView() {
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [stack, setStack] = useState<StackEntry[]>([{ kind: 'home' }])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchCategories().then(setCategories) }, [])

  const current = stack[stack.length - 1]

  const pushCategory = useCallback((cat: CategoryNode) => {
    setStack(s => [...s, { kind: 'category', cat }])
  }, [])

  const pushNode = useCallback(async (node: DataNode) => {
    if (hasChildren(node)) {
      setStack(s => [...s, { kind: 'node', node }])
    } else {
      setLoading(true)
      const full = await fetchNode(node.id)
      setLoading(false)
      setStack(s => [...s, { kind: 'node', node: full || node }])
    }
  }, [])

  const jumpTo = useCallback((i: number) => {
    if (i === -1) setStack([{ kind: 'home' }])
    else setStack(s => s.slice(0, i + 1))
  }, [])

  return (
    <div className="h-full w-full overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at 20% 10%, #020d1a 0%, #020408 100%)', scrollbarWidth: 'thin' }}>
      <div className="max-w-7xl mx-auto px-6 py-6">

        {stack.length > 1 && <Breadcrumb stack={stack} onJump={jumpTo} />}

        <AnimatePresence mode="wait">

          {current.kind === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10 px-4 py-8 rounded-lg border-2" 
                style={{ background: '#0a1628', borderColor: '#00d4ff60' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-[#00d4ff] mb-3 tracking-tight">
                  🌐 Network & CyberSec Explorer
                </motion.div>
                <div className="text-sm text-gray-400 max-w-2xl mx-auto">
                  Comprehensive drill-down explorer for networking and cybersecurity. Click any category to explore topics, protocols, attacks, and defenses with full technical details.
                </div>
              </div>
              {categories.length === 0
                ? <div className="flex justify-center py-20 text-gray-500">Loading categories...</div>
                : <CardGrid>
                    {categories.map((cat, i) => (
                      <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <CategoryCard cat={cat} onClick={() => pushCategory(cat)} />
                      </motion.div>
                    ))}
                  </CardGrid>
              }
            </motion.div>
          )}

          {current.kind === 'category' && (
            <motion.div key={current.cat.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-6 px-4 py-4 rounded-lg border-2" 
                style={{ background: '#0a1628', borderColor: current.cat.color + '60' }}>
                <div className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: current.cat.color }}>
                  <span className="text-3xl">{current.cat.icon}</span>
                  {current.cat.title}
                </div>
                <p className="text-sm text-gray-400 mb-2">{current.cat.description}</p>
                <div className="text-xs text-gray-500">{current.cat.children.length} topics available — click any to explore deeper</div>
              </div>
              {loading
                ? <div className="flex justify-center py-20 text-gray-500">Loading...</div>
                : <CardGrid>
                    {current.cat.children.map((id, i) => (
                      <NodeCard key={id} id={id} index={i} onClick={pushNode} />
                    ))}
                  </CardGrid>
              }
            </motion.div>
          )}

          {current.kind === 'node' && (
            <motion.div key={current.node.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {hasChildren(current.node) ? (
                <>
                  <div className="mb-6 px-4 py-4 rounded-lg border-2" 
                    style={{ background: '#0a1628', borderColor: getColor(current.node) + '60' }}>
                    <div className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: getColor(current.node) }}>
                      <span className="text-3xl">{getIcon(current.node)}</span>
                      {current.node.title}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{current.node.description}</p>
                    <div className="text-xs text-gray-500">
                      {(current.node.children as string[]).length} sub-topics available — click any to explore deeper
                    </div>
                  </div>
                  {loading
                    ? <div className="flex justify-center py-20 text-gray-500">Loading...</div>
                    : <CardGrid>
                        {(current.node.children as string[]).map((id, i) => (
                          <NodeCard key={id} id={id} index={i} onClick={pushNode} />
                        ))}
                      </CardGrid>
                  }
                </>
              ) : (
                <NodeDetail node={current.node} pushNode={pushNode} />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
