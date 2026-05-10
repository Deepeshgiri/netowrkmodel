import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { ATTACKS } from '../../data/knowledgeNodes'

const ATTACK_SCENARIOS = [
  {
    id: 'mitm',
    name: 'Man-in-the-Middle',
    icon: '👤',
    severity: 'critical',
    steps: ['ARP Spoof gateway', 'Intercept traffic', 'TLS Strip HTTPS', 'Capture credentials', 'Relay modified data'],
    layers: [2, 3, 6],
    color: '#ff3366',
  },
  {
    id: 'ddos',
    name: 'DDoS Attack',
    icon: '💥',
    severity: 'critical',
    steps: ['Botnet activation (100K nodes)', 'SYN flood target port 443', 'UDP amplification via DNS', 'Exhaust bandwidth', 'Service unavailable'],
    layers: [3, 4],
    color: '#ff6b35',
  },
  {
    id: 'ransomware',
    name: 'Ransomware Propagation',
    icon: '🦠',
    severity: 'critical',
    steps: ['Phishing email delivery', 'Macro execution', 'Lateral movement via SMB', 'Encrypt file shares', 'C2 beacon over HTTPS'],
    layers: [2, 3, 7],
    color: '#8b5cf6',
  },
  {
    id: 'dns_hijack',
    name: 'DNS Hijacking',
    icon: '🎭',
    severity: 'high',
    steps: ['Compromise DNS resolver', 'Inject malicious A records', 'Redirect victim traffic', 'Serve fake TLS cert', 'Harvest credentials'],
    layers: [3, 6, 7],
    color: '#ffcc00',
  },
  {
    id: 'sql_injection',
    name: 'SQL Injection Chain',
    icon: '💉',
    severity: 'critical',
    steps: ["Probe login form with '", 'Inject: OR 1=1--', 'Dump user table', 'Extract password hashes', 'Crack hashes offline'],
    layers: [7],
    color: '#00d4ff',
  },
]

const LAYER_COLORS: Record<number, string> = { 1: '#ff6b35', 2: '#ffcc00', 3: '#00d4ff', 4: '#00ff88', 5: '#8b5cf6', 6: '#ff3366', 7: '#00ff88' }
const LAYER_NAMES: Record<number, string> = { 1: 'Physical', 2: 'Data Link', 3: 'Network', 4: 'Transport', 5: 'Session', 6: 'Presentation', 7: 'Application' }

export default function AttackPanel() {
  const { selectedAttack, setSelectedAttack } = useStore()
  const scenario = ATTACK_SCENARIOS.find(a => a.id === selectedAttack)

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <div className="text-xs font-bold text-[#ff3366] tracking-widest uppercase flex items-center gap-2">
        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>⚠</motion.span>
        Cyber Attack Simulator
      </div>

      {!scenario ? (
        <div className="flex flex-col gap-2">
          {ATTACK_SCENARIOS.map(a => (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAttack(a.id)}
              className="p-2 rounded cursor-pointer"
              style={{ background: `${a.color}11`, border: `1px solid ${a.color}44` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: a.color }}>{a.name}</div>
                  <div className="flex gap-1 mt-1">
                    {a.layers.map(l => (
                      <span key={l} className="text-[9px] px-1 rounded"
                        style={{ background: LAYER_COLORS[l] + '22', color: LAYER_COLORS[l], border: `1px solid ${LAYER_COLORS[l]}44` }}>
                        L{l}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[9px] px-1 py-0.5 rounded bg-red-900 text-red-300">{a.severity.toUpperCase()}</span>
              </div>
            </motion.div>
          ))}

          <div className="mt-2 pt-2 border-t border-[#0a2040]">
            <div className="text-xs font-bold text-[#00d4ff] mb-2 tracking-widest uppercase">Known Vulnerabilities</div>
            {Object.values(ATTACKS).slice(0, 5).map(a => (
              <div key={a.id} className="flex items-start gap-2 py-1.5 border-b border-[#0a2040]">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.severity === 'critical' ? '#ff3366' : '#ffcc00' }} />
                <div>
                  <div className="text-xs font-bold text-[#e0f0ff]">{a.name}</div>
                  <div className="text-[10px] text-[#60a0c0]">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <button onClick={() => setSelectedAttack(null)} className="text-xs text-[#60a0c0] hover:text-white flex items-center gap-1">
            ← Back to attacks
          </button>
          <div className="p-3 rounded" style={{ background: `${scenario.color}11`, border: `1px solid ${scenario.color}44` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{scenario.icon}</span>
              <div className="font-bold" style={{ color: scenario.color }}>{scenario.name}</div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {scenario.layers.map(l => (
                <span key={l} className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: LAYER_COLORS[l] + '22', color: LAYER_COLORS[l], border: `1px solid ${LAYER_COLORS[l]}44` }}>
                  L{l}: {LAYER_NAMES[l]}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-[#ff3366] mb-2 tracking-widest uppercase">Attack Chain</div>
            {scenario.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 py-2 border-b border-[#0a2040]"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: scenario.color + '33', color: scenario.color, border: `1px solid ${scenario.color}66` }}>
                  {i + 1}
                </div>
                <div className="text-xs text-[#a0c0e0]">{step}</div>
              </motion.div>
            ))}
          </div>

          <div className="p-2 rounded" style={{ background: '#00ff8811', border: '1px solid #00ff8833' }}>
            <div className="text-xs font-bold text-[#00ff88] mb-1">🛡 Mitigations</div>
            <div className="text-xs text-[#60c080]">
              {scenario.id === 'mitm' && 'HSTS, certificate pinning, network segmentation, 802.1X port auth'}
              {scenario.id === 'ddos' && 'Anycast scrubbing, rate limiting, BGP blackholing, CDN absorption'}
              {scenario.id === 'ransomware' && 'Email filtering, EDR, network segmentation, immutable backups'}
              {scenario.id === 'dns_hijack' && 'DNSSEC, DoH/DoT, DNS monitoring, registrar 2FA'}
              {scenario.id === 'sql_injection' && 'Parameterized queries, WAF, input validation, least privilege DB'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
