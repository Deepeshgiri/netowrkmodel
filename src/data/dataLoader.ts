export interface DataNode {
  id: string
  title: string
  shortName?: string
  type: string
  osiLayer?: number
  category: string
  description: string
  fullExplanation?: string
  icon?: string
  color?: string
  port?: number | null
  transport?: string | string[]
  keyFacts?: string[]
  children?: string[]        // IDs of child nodes
  parent?: string
  relatedConcepts?: string[]
  cybersecurity?: {
    attacks?: string[]
    defenses?: string[]
  }
  usedBy?: string[]
  dependsOn?: string[]
  visualization?: {
    color: string
    icon: string
    nodeType: 'expandable' | 'leaf'
  }
  // protocol-specific
  header?: { size: string; fields: HeaderField[] }
  versions?: { version: string; year?: number; status?: string; feature?: string }[]
  steps?: Step[]
  types?: Record<string, unknown>[]
  // raw data passthrough
  [key: string]: unknown
}

export interface HeaderField {
  name: string
  bits: number
  description: string
  example: string
}

export interface Step {
  step: number
  name?: string
  action?: string
  description: string
  direction?: string
}

export interface CategoryNode {
  id: string
  title: string
  icon: string
  color: string
  description: string
  children: string[]
  subcategories?: string[]
}

// ── File registry: id → public path ─────────────────────────────────────────
const FILE_MAP: Record<string, string> = {
  // core
  'osi-model':          '/data/core/osi-model.json',
  'tcp-ip-model':       '/data/core/tcp-ip-model.json',
  'internet':           '/data/core/internet.json',
  // layer indices
  'layer1-physical':    '/data/osi/layer1-physical/physical-layer.json',
  'layer2-datalink':    '/data/osi/layer2-datalink/layer2-datalink.json',
  'layer3-network':     '/data/osi/layer3-network/layer3-network.json',
  'layer4-transport':   '/data/osi/layer4-transport/layer4-transport.json',
  'layer5-session':     '/data/osi/layer5-session/layer5-session.json',
  'layer6-presentation':'/data/osi/layer6-presentation/layer6-presentation.json',
  'layer7-application': '/data/osi/layer7-application/layer7-application.json',
  // layer 1
  'cables':             '/data/osi/layer1-physical/cables.json',
  'wireless':           '/data/osi/layer1-physical/wireless.json',
  // layer 2
  'ethernet':           '/data/osi/layer2-datalink/ethernet.json',
  'arp':                '/data/osi/layer2-datalink/arp.json',
  // layer 3
  'ipv4':               '/data/osi/layer3-network/ipv4.json',
  'bgp':                '/data/osi/layer3-network/bgp.json',
  'ospf':               '/data/osi/layer3-network/ospf.json',
  'subnetting':         '/data/osi/layer3-network/subnetting.json',
  'icmp':               '/data/osi/layer3-network/icmp.json',
  // layer 4
  'tcp':                '/data/osi/layer4-transport/tcp.json',
  'tcp-handshake':      '/data/osi/layer4-transport/tcp-handshake.json',
  'udp':                '/data/osi/layer4-transport/udp.json',
  // layer 6
  'tls':                '/data/osi/layer6-presentation/tls.json',
  // layer 7
  'http':               '/data/osi/layer7-application/http.json',
  'https':              '/data/osi/layer7-application/https.json',
  'dns':                '/data/osi/layer7-application/dns.json',
  'ssh':                '/data/osi/layer7-application/ssh.json',
  'dhcp':               '/data/osi/layer7-application/dhcp.json',
  // hardware
  'nic':                '/data/hardware/nic.json',
  // cybersecurity categories
  'attacks':            '/data/cybersecurity/attacks.json',
  'defenses':           '/data/cybersecurity/defenses.json',
  'tools':              '/data/cybersecurity/tools.json',
  // attacks
  'arp-spoofing':       '/data/cybersecurity/attacks/arp-spoofing.json',
  'syn-flood':          '/data/cybersecurity/attacks/syn-flood.json',
  'dns-poisoning':      '/data/cybersecurity/attacks/dns-poisoning.json',
  'xss':                '/data/cybersecurity/attacks/xss.json',
  'csrf':               '/data/cybersecurity/attacks/csrf.json',
  'mitm':               '/data/cybersecurity/attacks/mitm.json',
  'ssl-stripping':      '/data/cybersecurity/attacks/ssl-stripping.json',
  // defenses
  'firewall':           '/data/cybersecurity/defenses/firewall.json',
  'zero-trust':         '/data/cybersecurity/defenses/zero-trust.json',
  'ids-ips':            '/data/cybersecurity/defenses/ids-ips.json',
  'vpn':                '/data/cybersecurity/defenses/vpn.json',
  'hsts':               '/data/cybersecurity/defenses/hsts.json',
  // tools
  'wireshark':          '/data/cybersecurity/tools/wireshark.json',
  'nmap':               '/data/cybersecurity/tools/nmap.json',
}

const cache = new Map<string, DataNode>()

export async function fetchNode(id: string): Promise<DataNode | null> {
  if (cache.has(id)) return cache.get(id)!
  const path = FILE_MAP[id]
  if (!path) return null
  try {
    const res = await fetch(path)
    if (!res.ok) return null
    const data: DataNode = await res.json()
    cache.set(id, data)
    return data
  } catch {
    return null
  }
}

export async function fetchCategories(): Promise<CategoryNode[]> {
  try {
    const res = await fetch('/data/metadata/categories.json')
    const data = await res.json()
    return data.categories as CategoryNode[]
  } catch {
    return []
  }
}

export function getColor(node: DataNode): string {
  if (node.visualization?.color) return node.visualization.color
  const layerColors: Record<number, string> = {
    1: '#ff6b35', 2: '#ffcc00', 3: '#00d4ff',
    4: '#00ff88', 5: '#8b5cf6', 6: '#ff3366', 7: '#00ff88',
  }
  if (node.osiLayer) return layerColors[node.osiLayer] || '#00d4ff'
  const typeColors: Record<string, string> = {
    attack: '#ff3366', defense: '#00ff88', tool: '#ffcc00',
    hardware: '#ff6b35', protocol: '#00d4ff', model: '#8b5cf6',
  }
  return typeColors[node.type] || '#00d4ff'
}

export function getIcon(node: DataNode): string {
  if (node.visualization?.icon) return node.visualization.icon
  const icons: Record<string, string> = {
    attack: '⚔️', defense: '🛡️', tool: '🛠️', hardware: '🔲',
    protocol: '📡', model: '📚', concept: '💡', process: '⚙️',
  }
  return icons[node.type] || '📄'
}

export function hasChildren(node: DataNode): boolean {
  return Array.isArray(node.children) && node.children.length > 0
}
