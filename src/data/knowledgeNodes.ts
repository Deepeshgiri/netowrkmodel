export type VisualizationType = 'topology' | 'timeline' | 'packet' | 'waveform' | 'tree' | 'handshake' | 'hardware'

export interface Attack {
  id: string
  name: string
  description: string
  layer: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  mitigation: string
}

export interface HeaderField {
  name: string
  bits: number
  value: string
  description: string
  color: string
}

export interface KnowledgeNode {
  id: string
  layer: number
  protocol?: string
  title: string
  subtitle: string
  icon: string
  color: string
  glowColor: string
  description: string
  deepDive: string
  visualizationType: VisualizationType
  attacks: Attack[]
  headers: HeaderField[]
  relatedProtocols: string[]
  children?: string[]
  facts: string[]
}

export const ATTACKS: Record<string, Attack> = {
  cable_tap: { id: 'cable_tap', name: 'Cable Tapping', description: 'Physical interception of copper wire signals using inductive coupling', layer: 1, severity: 'high', mitigation: 'Fiber optic cables, physical security, cable shielding' },
  jamming: { id: 'jamming', name: 'RF Jamming', description: 'Flooding wireless spectrum with noise to disrupt communication', layer: 1, severity: 'high', mitigation: 'Frequency hopping, spread spectrum, directional antennas' },
  arp_spoof: { id: 'arp_spoof', name: 'ARP Spoofing', description: 'Sending fake ARP replies to poison MAC-to-IP mappings, enabling MITM', layer: 2, severity: 'critical', mitigation: 'Dynamic ARP Inspection (DAI), static ARP entries, 802.1X' },
  mac_flood: { id: 'mac_flood', name: 'MAC Flooding', description: 'Overwhelming switch CAM table to force broadcast mode', layer: 2, severity: 'high', mitigation: 'Port security, MAC address limiting, 802.1X authentication' },
  ip_spoof: { id: 'ip_spoof', name: 'IP Spoofing', description: 'Forging source IP addresses to impersonate trusted hosts', layer: 3, severity: 'critical', mitigation: 'BCP38 ingress filtering, uRPF, IPSec authentication' },
  syn_flood: { id: 'syn_flood', name: 'SYN Flood', description: 'Exhausting server connection table with half-open TCP connections', layer: 4, severity: 'critical', mitigation: 'SYN cookies, rate limiting, firewall stateful inspection' },
  session_hijack: { id: 'session_hijack', name: 'Session Hijacking', description: 'Stealing authenticated session tokens to impersonate users', layer: 5, severity: 'critical', mitigation: 'HTTPS, secure/httpOnly cookies, session rotation' },
  tls_strip: { id: 'tls_strip', name: 'TLS Stripping', description: 'Downgrading HTTPS to HTTP by intercepting redirects', layer: 6, severity: 'critical', mitigation: 'HSTS, HSTS preloading, certificate pinning' },
  dns_poison: { id: 'dns_poison', name: 'DNS Poisoning', description: 'Injecting malicious DNS records to redirect traffic', layer: 7, severity: 'critical', mitigation: 'DNSSEC, DNS over HTTPS (DoH), DNS over TLS (DoT)' },
  xss: { id: 'xss', name: 'Cross-Site Scripting', description: 'Injecting malicious scripts into web pages viewed by other users', layer: 7, severity: 'high', mitigation: 'CSP headers, input sanitization, output encoding' },
}

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'layer1_physical',
    layer: 1,
    title: 'Physical Layer',
    subtitle: 'OSI Layer 1 — Bits & Signals',
    icon: '⚡',
    color: '#ff6b35',
    glowColor: 'rgba(255,107,53,0.4)',
    description: 'The Physical Layer transmits raw bit streams over physical media. It defines electrical, optical, and radio specifications for hardware.',
    deepDive: 'At this layer, data exists purely as voltage levels, light pulses, or radio waves. A "1" might be +5V and a "0" might be 0V in TTL logic. Ethernet uses Manchester encoding. Fiber uses photons at 1310nm or 1550nm wavelengths. WiFi modulates radio waves using OFDM (Orthogonal Frequency Division Multiplexing) across 20/40/80/160 MHz channels.',
    visualizationType: 'waveform',
    attacks: [ATTACKS.cable_tap, ATTACKS.jamming],
    headers: [],
    relatedProtocols: ['Ethernet', 'WiFi 802.11', 'Fiber Optic', 'DSL', 'Bluetooth'],
    facts: ['Cat6 cable supports 10Gbps up to 55m', 'Single-mode fiber can transmit 100km without repeaters', 'WiFi 6 uses 1024-QAM modulation', 'Signal travels at ~2/3 speed of light in copper'],
    children: ['ethernet_cable', 'fiber_optic', 'wifi_spectrum', 'rj45_connector']
  },
  {
    id: 'layer2_datalink',
    layer: 2,
    title: 'Data Link Layer',
    subtitle: 'OSI Layer 2 — Frames & MACs',
    icon: '🔗',
    color: '#ffcc00',
    glowColor: 'rgba(255,204,0,0.4)',
    description: 'The Data Link Layer provides node-to-node data transfer, error detection via CRC, and MAC addressing for local network communication.',
    deepDive: 'Ethernet frames wrap IP packets with MAC addresses. Switches maintain CAM (Content Addressable Memory) tables mapping MAC→port. ARP resolves IP→MAC. VLANs use 802.1Q tagging (4-byte tag: TPID 0x8100 + PCP + DEI + VID). CRC-32 detects transmission errors with 99.9999977% accuracy.',
    visualizationType: 'packet',
    attacks: [ATTACKS.arp_spoof, ATTACKS.mac_flood],
    headers: [
      { name: 'Preamble', bits: 56, value: '10101010...', description: 'Synchronization pattern', color: '#374151' },
      { name: 'SFD', bits: 8, value: '10101011', description: 'Start Frame Delimiter', color: '#4b5563' },
      { name: 'Dst MAC', bits: 48, value: 'FF:FF:FF:FF:FF:FF', description: 'Destination MAC address', color: '#1d4ed8' },
      { name: 'Src MAC', bits: 48, value: 'A4:C3:F0:12:34:56', description: 'Source MAC address', color: '#1e40af' },
      { name: 'EtherType', bits: 16, value: '0x0800', description: 'IPv4 payload indicator', color: '#7c3aed' },
      { name: 'Payload', bits: 368, value: 'IP Packet...', description: 'Encapsulated network layer data (46-1500 bytes)', color: '#065f46' },
      { name: 'CRC-32', bits: 32, value: '0xA3F2C1D8', description: 'Cyclic Redundancy Check for error detection', color: '#92400e' },
    ],
    relatedProtocols: ['Ethernet II', 'IEEE 802.3', 'ARP', 'STP', '802.1Q VLAN', 'PPP'],
    facts: ['MAC addresses are 48-bit (6 bytes) globally unique identifiers', 'Switch CAM tables typically hold 8K-128K entries', 'ARP cache timeout is usually 20 minutes', 'Jumbo frames extend MTU to 9000 bytes'],
    children: ['ethernet_frame', 'arp_protocol', 'switch_cam', 'vlan_tagging']
  },
  {
    id: 'layer3_network',
    layer: 3,
    title: 'Network Layer',
    subtitle: 'OSI Layer 3 — Packets & Routing',
    icon: '🌐',
    color: '#00d4ff',
    glowColor: 'rgba(0,212,255,0.4)',
    description: 'The Network Layer handles logical addressing (IP), routing between networks, fragmentation, and end-to-end packet delivery across the internet.',
    deepDive: 'IPv4 uses 32-bit addresses (4.3B total). IPv6 uses 128-bit (340 undecillion). Routers use longest-prefix matching in FIB (Forwarding Information Base). BGP (Border Gateway Protocol) routes between ASes using path vectors. OSPF uses Dijkstra\'s algorithm for intra-AS routing. NAT translates private RFC1918 addresses to public IPs.',
    visualizationType: 'topology',
    attacks: [ATTACKS.ip_spoof],
    headers: [
      { name: 'Version', bits: 4, value: '4', description: 'IP version (4 or 6)', color: '#374151' },
      { name: 'IHL', bits: 4, value: '5', description: 'Internet Header Length (×4 bytes)', color: '#4b5563' },
      { name: 'DSCP/ECN', bits: 8, value: '0x00', description: 'Differentiated Services / Explicit Congestion Notification', color: '#6b7280' },
      { name: 'Total Length', bits: 16, value: '1500', description: 'Total packet size in bytes', color: '#1d4ed8' },
      { name: 'ID', bits: 16, value: '0x1A2B', description: 'Fragment identification', color: '#1e40af' },
      { name: 'Flags/Offset', bits: 16, value: 'DF=1', description: 'Don\'t Fragment flag + fragment offset', color: '#7c3aed' },
      { name: 'TTL', bits: 8, value: '64', description: 'Time To Live — decremented at each hop', color: '#dc2626' },
      { name: 'Protocol', bits: 8, value: '6 (TCP)', description: 'Encapsulated protocol identifier', color: '#059669' },
      { name: 'Checksum', bits: 16, value: '0xF3A1', description: 'Header integrity check', color: '#92400e' },
      { name: 'Src IP', bits: 32, value: '192.168.1.100', description: 'Source IP address', color: '#065f46' },
      { name: 'Dst IP', bits: 32, value: '142.250.80.46', description: 'Destination IP address', color: '#064e3b' },
      { name: 'Payload', bits: 160, value: 'TCP Segment...', description: 'Transport layer data', color: '#1e3a5f' },
    ],
    relatedProtocols: ['IPv4', 'IPv6', 'ICMP', 'BGP', 'OSPF', 'RIP', 'NAT', 'MPLS'],
    facts: ['IPv4 has ~4.3 billion addresses (exhausted in 2011)', 'BGP powers the entire internet routing system', 'TTL prevents infinite routing loops', 'CIDR replaced classful networking in 1993'],
    children: ['ip_packet', 'routing_table', 'bgp_routing', 'nat_translation', 'subnetting']
  },
  {
    id: 'layer4_transport',
    layer: 4,
    title: 'Transport Layer',
    subtitle: 'OSI Layer 4 — TCP/UDP',
    icon: '📦',
    color: '#00ff88',
    glowColor: 'rgba(0,255,136,0.4)',
    description: 'The Transport Layer provides end-to-end communication, reliability (TCP), flow control, congestion control, and port-based multiplexing.',
    deepDive: 'TCP uses a 3-way handshake (SYN→SYN-ACK→ACK), sliding window flow control, and CUBIC/BBR congestion algorithms. Sequence numbers are 32-bit (wraps at 4GB). The receive window advertises buffer space. TCP Fast Retransmit triggers on 3 duplicate ACKs. UDP is connectionless — 8-byte header, no guarantees, used for DNS/gaming/video.',
    visualizationType: 'handshake',
    attacks: [ATTACKS.syn_flood],
    headers: [
      { name: 'Src Port', bits: 16, value: '54321', description: 'Source port (ephemeral: 49152-65535)', color: '#1d4ed8' },
      { name: 'Dst Port', bits: 16, value: '443', description: 'Destination port (HTTPS)', color: '#1e40af' },
      { name: 'Seq Number', bits: 32, value: '0x3F2A1B0C', description: 'Byte stream position', color: '#7c3aed' },
      { name: 'Ack Number', bits: 32, value: '0x00000001', description: 'Next expected byte', color: '#6d28d9' },
      { name: 'Data Offset', bits: 4, value: '5', description: 'Header length in 32-bit words', color: '#374151' },
      { name: 'Flags', bits: 9, value: 'SYN=1', description: 'Control bits: URG ACK PSH RST SYN FIN', color: '#dc2626' },
      { name: 'Window', bits: 16, value: '65535', description: 'Receive buffer size (flow control)', color: '#059669' },
      { name: 'Checksum', bits: 16, value: '0xB2C4', description: 'Error detection over header+data', color: '#92400e' },
      { name: 'Urgent Ptr', bits: 16, value: '0', description: 'Urgent data pointer (if URG set)', color: '#6b7280' },
    ],
    relatedProtocols: ['TCP', 'UDP', 'SCTP', 'QUIC', 'TLS/TCP', 'DTLS/UDP'],
    facts: ['TCP guarantees ordered, reliable delivery', 'UDP header is only 8 bytes vs TCP\'s 20+', 'QUIC (HTTP/3) runs over UDP with built-in TLS', 'TCP window scaling allows windows up to 1GB'],
    children: ['tcp_handshake', 'tcp_flow_control', 'udp_datagram', 'port_scanner']
  },
  {
    id: 'layer5_session',
    layer: 5,
    title: 'Session Layer',
    subtitle: 'OSI Layer 5 — Sessions & Auth',
    icon: '🔐',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.4)',
    description: 'The Session Layer manages communication sessions: establishment, maintenance, synchronization, and termination between applications.',
    deepDive: 'Sessions maintain state across multiple request-response cycles. HTTP/1.1 uses persistent connections. HTTP/2 multiplexes streams. OAuth 2.0 uses access tokens (JWT). Session IDs are typically 128-bit random values stored in cookies. RPC (Remote Procedure Call) uses sessions for distributed computing. NetBIOS and SMB operate at this layer.',
    visualizationType: 'timeline',
    attacks: [ATTACKS.session_hijack],
    headers: [
      { name: 'Session ID', bits: 128, value: 'a3f2...c8d1', description: '128-bit cryptographically random session token', color: '#7c3aed' },
      { name: 'Auth Token', bits: 256, value: 'JWT: eyJ...', description: 'JSON Web Token for authentication', color: '#6d28d9' },
      { name: 'Expiry', bits: 32, value: '1735689600', description: 'Unix timestamp for session expiration', color: '#4c1d95' },
    ],
    relatedProtocols: ['HTTP Sessions', 'OAuth 2.0', 'JWT', 'SAML', 'Kerberos', 'RPC', 'NetBIOS'],
    facts: ['JWT tokens contain base64-encoded JSON claims', 'Kerberos uses tickets with 8-hour default lifetime', 'OAuth 2.0 access tokens typically expire in 1 hour', 'Session fixation attacks pre-set session IDs'],
    children: ['session_lifecycle', 'oauth_flow', 'jwt_token', 'kerberos_auth']
  },
  {
    id: 'layer6_presentation',
    layer: 6,
    title: 'Presentation Layer',
    subtitle: 'OSI Layer 6 — Encryption & Encoding',
    icon: '🔒',
    color: '#ff3366',
    glowColor: 'rgba(255,51,102,0.4)',
    description: 'The Presentation Layer handles data translation, encryption/decryption, compression, and format conversion between application and network formats.',
    deepDive: 'TLS 1.3 uses ECDHE for key exchange (X25519 curve), AES-256-GCM for symmetric encryption, and SHA-384 for HMAC. The TLS handshake takes 1 RTT (vs 2 in TLS 1.2). RSA-2048 provides ~112-bit security. AES operates on 128-bit blocks with 10/12/14 rounds for 128/192/256-bit keys. X.509 certificates chain to trusted root CAs.',
    visualizationType: 'handshake',
    attacks: [ATTACKS.tls_strip],
    headers: [
      { name: 'Content Type', bits: 8, value: '0x17 (App Data)', description: 'TLS record type', color: '#dc2626' },
      { name: 'TLS Version', bits: 16, value: '0x0303 (TLS 1.2)', description: 'Protocol version field', color: '#b91c1c' },
      { name: 'Length', bits: 16, value: '1024', description: 'Encrypted payload length', color: '#991b1b' },
      { name: 'IV/Nonce', bits: 96, value: '0x4A2F...', description: 'Initialization vector for AES-GCM', color: '#7c3aed' },
      { name: 'Ciphertext', bits: 256, value: '★★★★★★★★', description: 'AES-256-GCM encrypted application data', color: '#065f46' },
      { name: 'Auth Tag', bits: 128, value: '0xF3A2...', description: 'GCM authentication tag (integrity)', color: '#92400e' },
    ],
    relatedProtocols: ['TLS 1.3', 'TLS 1.2', 'SSL (deprecated)', 'AES-GCM', 'RSA', 'ECDHE', 'X.509'],
    facts: ['TLS 1.3 removed RSA key exchange (forward secrecy)', 'AES-256 would take longer than universe age to brute force', 'Certificate Transparency logs all issued certs publicly', 'HSTS forces HTTPS for up to 2 years'],
    children: ['tls_handshake', 'aes_encryption', 'rsa_keys', 'x509_cert']
  },
  {
    id: 'layer7_application',
    layer: 7,
    title: 'Application Layer',
    subtitle: 'OSI Layer 7 — HTTP, DNS, SMTP',
    icon: '🌍',
    color: '#00ff88',
    glowColor: 'rgba(0,255,136,0.4)',
    description: 'The Application Layer provides network services directly to end-user applications: HTTP, DNS, SMTP, FTP, WebSockets, and APIs.',
    deepDive: 'HTTP/2 uses binary framing, header compression (HPACK), and stream multiplexing. HTTP/3 runs over QUIC/UDP. DNS uses UDP port 53 (TCP for zone transfers). A DNS query traverses: stub resolver → recursive resolver → root server → TLD server → authoritative server. SMTP uses a store-and-forward model with MX records for routing.',
    visualizationType: 'tree',
    attacks: [ATTACKS.dns_poison, ATTACKS.xss],
    headers: [
      { name: 'Method', bits: 32, value: 'GET', description: 'HTTP method: GET POST PUT DELETE PATCH', color: '#059669' },
      { name: 'Path', bits: 64, value: '/api/data', description: 'Request URI path', color: '#065f46' },
      { name: 'HTTP Ver', bits: 16, value: 'HTTP/2', description: 'Protocol version', color: '#064e3b' },
      { name: 'Host', bits: 64, value: 'google.com', description: 'Target hostname (virtual hosting)', color: '#1d4ed8' },
      { name: 'User-Agent', bits: 128, value: 'Mozilla/5.0...', description: 'Client identification string', color: '#1e40af' },
      { name: 'Accept', bits: 64, value: 'application/json', description: 'Accepted response content types', color: '#1e3a8a' },
      { name: 'Cookie', bits: 256, value: 'session=a3f2...', description: 'Session and tracking cookies', color: '#7c3aed' },
      { name: 'Auth', bits: 128, value: 'Bearer eyJ...', description: 'Authorization header (JWT/OAuth)', color: '#6d28d9' },
    ],
    relatedProtocols: ['HTTP/1.1', 'HTTP/2', 'HTTP/3', 'DNS', 'SMTP', 'FTP', 'WebSocket', 'gRPC'],
    facts: ['HTTP/2 can multiplex 100+ streams over one connection', 'DNS TTL controls how long records are cached', 'SMTP was designed in 1982 with no authentication', 'WebSockets enable full-duplex browser communication'],
    children: ['http_request', 'dns_resolution', 'tls_cert_chain', 'api_gateway']
  },
]

export const INTERNET_JOURNEY_STEPS = [
  { id: 'browser_init', step: 1, title: 'Browser Process', description: 'Chrome creates a new renderer process, parses URL, checks HSTS preload list', layer: 7, icon: '🌐', color: '#00ff88', duration: 200 },
  { id: 'dns_cache', step: 2, title: 'DNS Cache Check', description: 'Check browser cache → OS cache → /etc/hosts → local DNS resolver', layer: 7, icon: '📋', color: '#00d4ff', duration: 100 },
  { id: 'dns_query', step: 3, title: 'DNS Resolution', description: 'Recursive query: Root NS → .com TLD → google.com authoritative → returns 142.250.80.46', layer: 7, icon: '🔍', color: '#00d4ff', duration: 50 },
  { id: 'arp_request', step: 4, title: 'ARP Request', description: 'Who has 192.168.1.1? Broadcast FF:FF:FF:FF:FF:FF to find default gateway MAC', layer: 2, icon: '📡', color: '#ffcc00', duration: 5 },
  { id: 'tcp_handshake', step: 5, title: 'TCP Handshake', description: 'SYN → SYN-ACK → ACK establishes reliable connection to port 443', layer: 4, icon: '🤝', color: '#00ff88', duration: 30 },
  { id: 'tls_handshake', step: 6, title: 'TLS 1.3 Handshake', description: 'ClientHello → ServerHello + Certificate → Finished. ECDHE key exchange, AES-256-GCM negotiated', layer: 6, icon: '🔒', color: '#ff3366', duration: 50 },
  { id: 'http_request', step: 7, title: 'HTTP/2 Request', description: 'GET / HTTP/2 with compressed HPACK headers sent over encrypted TLS tunnel', layer: 7, icon: '📤', color: '#00ff88', duration: 10 },
  { id: 'router_hop', step: 8, title: 'Router Traversal', description: 'Packet traverses 12-18 BGP hops across ISP backbone, TTL decremented each hop', layer: 3, icon: '🔀', color: '#00d4ff', duration: 20 },
  { id: 'cdn_edge', step: 9, title: 'CDN Edge Node', description: 'Anycast routing selects nearest Google edge PoP. Cache hit returns content immediately', layer: 3, icon: '⚡', color: '#ff6b35', duration: 5 },
  { id: 'server_process', step: 10, title: 'Server Processing', description: 'Nginx → Node.js/Go backend → Redis cache check → PostgreSQL query → response generation', layer: 7, icon: '⚙️', color: '#8b5cf6', duration: 50 },
  { id: 'response_travel', step: 11, title: 'Response Traversal', description: 'HTTP 200 response fragmented into TCP segments, encrypted, routed back through internet', layer: 4, icon: '📥', color: '#00ff88', duration: 20 },
  { id: 'browser_render', step: 12, title: 'Browser Rendering', description: 'HTML parsed → DOM built → CSSOM built → Render tree → Layout → Paint → Composite', layer: 7, icon: '🎨', color: '#00d4ff', duration: 100 },
]

export const NETWORK_TOPOLOGY_NODES = [
  { id: 'pc_a', type: 'device', label: 'Your PC', sublabel: '192.168.1.100', icon: '💻', x: 100, y: 300, layer: 1, color: '#00d4ff' },
  { id: 'switch', type: 'device', label: 'Switch', sublabel: 'CAM Table: 24 ports', icon: '🔀', x: 280, y: 300, layer: 2, color: '#ffcc00' },
  { id: 'router', type: 'device', label: 'Router/Gateway', sublabel: '192.168.1.1', icon: '📡', x: 460, y: 300, layer: 3, color: '#00d4ff' },
  { id: 'firewall', type: 'device', label: 'Firewall', sublabel: 'Stateful Inspection', icon: '🛡️', x: 640, y: 300, layer: 4, color: '#ff3366' },
  { id: 'isp', type: 'cloud', label: 'ISP', sublabel: 'AS7922 Comcast', icon: '🏢', x: 820, y: 300, layer: 3, color: '#8b5cf6' },
  { id: 'internet', type: 'cloud', label: 'Internet Backbone', sublabel: 'BGP AS Path', icon: '🌐', x: 1000, y: 300, layer: 3, color: '#00d4ff' },
  { id: 'cdn', type: 'cloud', label: 'CDN Edge', sublabel: 'Cloudflare PoP', icon: '⚡', x: 1180, y: 300, layer: 3, color: '#ff6b35' },
  { id: 'server', type: 'device', label: 'Web Server', sublabel: '142.250.80.46', icon: '🖥️', x: 1360, y: 300, layer: 7, color: '#00ff88' },
]
