import { motion } from 'framer-motion'

const HARDWARE_COMPONENTS = [
  { id: 'cpu', label: 'CPU', sublabel: 'Intel i9 / AMD Ryzen', icon: '🔲', color: '#00d4ff', x: 45, y: 35, desc: 'Executes network stack code, handles interrupts from NIC, runs encryption algorithms (AES-NI hardware acceleration)' },
  { id: 'ram', label: 'RAM', sublabel: 'DDR5 32GB', icon: '📊', color: '#00ff88', x: 72, y: 35, desc: 'Stores socket buffers, kernel networking structures, packet queues, ARP/routing tables in memory' },
  { id: 'nic', label: 'NIC', sublabel: 'Intel X550 10GbE', icon: '🔌', color: '#ffcc00', x: 20, y: 65, desc: 'Network Interface Card: DMA transfers, hardware offloading (TCP checksum, TSO, RSS), interrupt coalescing' },
  { id: 'pcie', label: 'PCIe Bus', sublabel: 'Gen 4 x16', icon: '⚡', color: '#ff6b35', x: 45, y: 65, desc: 'High-speed interconnect: NIC uses PCIe DMA to write packets directly to RAM without CPU involvement' },
  { id: 'storage', label: 'NVMe SSD', sublabel: 'Samsung 980 Pro', icon: '💾', color: '#8b5cf6', x: 72, y: 65, desc: 'Stores OS, applications, TLS certificates, DNS cache, browser data, packet capture files' },
  { id: 'bios', label: 'UEFI/BIOS', sublabel: 'Firmware', icon: '⚙️', color: '#ff3366', x: 20, y: 35, desc: 'Initializes hardware, configures PXE boot (network boot), stores secure boot keys, manages power states' },
]

const KERNEL_LAYERS = [
  { label: 'User Space', items: ['Browser', 'curl/wget', 'SSH client', 'OpenSSL'], color: '#00ff88' },
  { label: 'System Calls', items: ['socket()', 'connect()', 'send()', 'recv()'], color: '#00d4ff' },
  { label: 'Kernel Network Stack', items: ['TCP/IP Stack', 'Netfilter/iptables', 'Socket Buffer (sk_buff)', 'NAPI polling'], color: '#8b5cf6' },
  { label: 'Driver Layer', items: ['NIC Driver', 'DMA Engine', 'IRQ Handler', 'Ring Buffer'], color: '#ffcc00' },
  { label: 'Hardware', items: ['NIC ASIC', 'PHY Chip', 'RJ45/SFP', 'Wire'], color: '#ff6b35' },
]

export default function HardwareView() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <div className="text-xs font-bold text-[#00d4ff] tracking-widest uppercase">Hardware Architecture</div>

      {/* Motherboard */}
      <div className="relative rounded p-3" style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', minHeight: 180 }}>
        <div className="text-[10px] text-[#40a040] mb-2 font-bold">MOTHERBOARD</div>
        <div className="grid grid-cols-3 gap-2">
          {HARDWARE_COMPONENTS.map(c => (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.05 }}
              className="group relative p-2 rounded cursor-pointer text-center"
              style={{ background: c.color + '11', border: `1px solid ${c.color}44` }}
            >
              <div className="text-lg">{c.icon}</div>
              <div className="text-[10px] font-bold" style={{ color: c.color }}>{c.label}</div>
              <div className="text-[8px] text-[#60a0c0]">{c.sublabel}</div>
              <div className="absolute bottom-full left-0 mb-1 z-50 hidden group-hover:block w-52 p-2 rounded text-left text-[10px]"
                style={{ background: '#050d1a', border: `1px solid ${c.color}66`, color: '#a0c0e0' }}>
                <div className="font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
                {c.desc}
              </div>
            </motion.div>
          ))}
        </div>
        {/* PCIe lanes visualization */}
        <div className="mt-2 flex items-center gap-1">
          <div className="text-[9px] text-[#ff6b35]">PCIe Lanes:</div>
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div key={i} className="w-1 h-3 rounded-sm"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.03 }}
              style={{ background: '#ff6b35' }} />
          ))}
        </div>
      </div>

      {/* Kernel Stack */}
      <div>
        <div className="text-xs font-bold text-[#00d4ff] mb-2 tracking-widest uppercase">Linux Kernel Network Stack</div>
        <div className="flex flex-col gap-1">
          {KERNEL_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-2 rounded"
              style={{ background: layer.color + '11', border: `1px solid ${layer.color}33` }}
            >
              <div className="text-[10px] font-bold mb-1" style={{ color: layer.color }}>{layer.label}</div>
              <div className="flex flex-wrap gap-1">
                {layer.items.map(item => (
                  <span key={item} className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background: layer.color + '22', color: layer.color + 'cc', border: `1px solid ${layer.color}33` }}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DMA Flow */}
      <div className="p-2 rounded" style={{ background: '#ffcc0011', border: '1px solid #ffcc0033' }}>
        <div className="text-[10px] font-bold text-[#ffcc00] mb-1">DMA Packet Flow</div>
        <div className="text-[10px] text-[#a0a060] leading-relaxed">
          Wire → PHY → NIC ASIC → DMA → RAM ring buffer → IRQ → NAPI poll → sk_buff → TCP/IP stack → socket → userspace recv()
        </div>
      </div>
    </div>
  )
}
