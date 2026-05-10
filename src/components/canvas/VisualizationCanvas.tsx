import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Animated waveform for Physical Layer
function WaveformViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width, h = canvas.height
      const mid = h / 2

      // Digital signal (square wave = bits)
      ctx.strokeStyle = '#ff6b35'
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = '#ff6b35'
      ctx.beginPath()
      const bits = [1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1]
      const segW = w / bits.length
      bits.forEach((bit, i) => {
        const x = i * segW
        const y = bit ? mid - 20 : mid + 20
        if (i === 0) ctx.moveTo(x, y)
        else {
          ctx.lineTo(x, bits[i-1] ? mid - 20 : mid + 20)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(x + segW, y)
      })
      ctx.stroke()

      // Analog sine wave (carrier)
      ctx.strokeStyle = '#00d4ff44'
      ctx.lineWidth = 1
      ctx.shadowBlur = 4
      ctx.shadowColor = '#00d4ff'
      ctx.beginPath()
      for (let x = 0; x < w; x++) {
        const y = mid + Math.sin((x / w) * Math.PI * 16 + t) * 12
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Moving bit indicator
      const bitPos = ((t * 20) % w)
      ctx.fillStyle = '#00ff88'
      ctx.shadowBlur = 12
      ctx.shadowColor = '#00ff88'
      ctx.beginPath()
      ctx.arc(bitPos, mid, 4, 0, Math.PI * 2)
      ctx.fill()

      t += 0.05
      frameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid #ff6b3544', background: '#0a0500' }}>
      <div className="text-[9px] text-[#ff6b35] px-2 pt-1 font-bold">SIGNAL WAVEFORM — Layer 1 Physical</div>
      <canvas ref={canvasRef} width={340} height={80} className="w-full" />
      <div className="flex justify-between px-2 pb-1">
        <span className="text-[8px] text-[#ff6b3580]">■ Digital (bits)</span>
        <span className="text-[8px] text-[#00d4ff80]">— Carrier wave</span>
        <span className="text-[8px] text-[#00ff8880]">● Bit position</span>
      </div>
    </div>
  )
}

// Animated packet encapsulation
function EncapsulationViz() {
  const layers = [
    { label: 'L7 App Data', content: 'GET /index.html HTTP/2', color: '#00ff88', width: '100%' },
    { label: 'L6 TLS', content: '★ Encrypted ★', color: '#ff3366', width: '100%' },
    { label: 'L4 TCP Seg', content: 'SRC:54321 DST:443 SEQ:1001', color: '#00ff88', width: '100%' },
    { label: 'L3 IP Pkt', content: '192.168.1.100 → 142.250.80.46', color: '#00d4ff', width: '100%' },
    { label: 'L2 Frame', content: 'A4:C3:F0 → FF:FF:FF CRC:OK', color: '#ffcc00', width: '100%' },
    { label: 'L1 Bits', content: '01001000 01010100 01010100 01010000', color: '#ff6b35', width: '100%' },
  ]

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid #0a2040', background: '#020408' }}>
      <div className="text-[9px] text-[#00d4ff] px-2 pt-1.5 pb-1 font-bold tracking-widest">ENCAPSULATION — Data wrapping down the OSI stack</div>
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        {layers.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 px-2 py-1 rounded text-[9px]"
            style={{ background: l.color + '11', border: `1px solid ${l.color}33`, paddingLeft: `${8 + i * 6}px` }}
          >
            <span className="font-bold flex-shrink-0" style={{ color: l.color, minWidth: 60 }}>{l.label}</span>
            <span className="text-[#60a0c0] font-mono truncate">{l.content}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// TCP Handshake visualization
function TCPHandshakeViz() {
  const [step, setStep] = useState(0)
  const steps = [
    { from: 'client', label: 'SYN', detail: 'seq=0', color: '#00ff88' },
    { from: 'server', label: 'SYN-ACK', detail: 'seq=0 ack=1', color: '#00d4ff' },
    { from: 'client', label: 'ACK', detail: 'seq=1 ack=1', color: '#00ff88' },
    { from: 'client', label: 'DATA', detail: 'TLS ClientHello', color: '#8b5cf6' },
    { from: 'server', label: 'DATA', detail: 'TLS ServerHello', color: '#ff3366' },
    { from: 'both', label: 'ESTABLISHED', detail: 'Encrypted tunnel active', color: '#ffcc00' },
  ]

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % (steps.length + 2)), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid #00ff8833', background: '#020408' }}>
      <div className="text-[9px] text-[#00ff88] px-2 pt-1.5 pb-1 font-bold tracking-widest">TCP 3-WAY HANDSHAKE + TLS</div>
      <div className="px-2 pb-2">
        <div className="flex justify-between text-[9px] text-[#60a0c0] mb-1 px-1">
          <span>CLIENT</span><span>SERVER</span>
        </div>
        <div className="relative" style={{ height: steps.length * 28 }}>
          <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: '#00ff8833' }} />
          <div className="absolute right-4 top-0 bottom-0 w-px" style={{ background: '#00d4ff33' }} />
          {steps.map((s, i) => {
            const visible = i < step
            if (!visible) return null
            const isFromClient = s.from === 'client'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="absolute flex items-center"
                style={{ top: i * 28 + 4, left: 16, right: 16, transformOrigin: isFromClient ? 'left' : 'right' }}
              >
                <div className="flex-1 flex items-center gap-1" style={{ flexDirection: isFromClient ? 'row' : 'row-reverse' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <div className="flex-1 h-px" style={{ background: s.color + '66' }} />
                  <div className="text-[9px] font-bold px-1" style={{ color: s.color }}>{s.label}</div>
                  <div className="flex-1 h-px" style={{ background: s.color + '66' }} />
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// TLS Handshake visualization
function TLSViz() {
  const steps = [
    { label: 'ClientHello', detail: 'TLS 1.3, cipher suites, random', color: '#ff3366' },
    { label: 'ServerHello', detail: 'Chosen cipher: TLS_AES_256_GCM_SHA384', color: '#ff3366' },
    { label: 'Certificate', detail: 'X.509 cert chain → Root CA', color: '#8b5cf6' },
    { label: 'Key Exchange', detail: 'ECDHE X25519 — forward secrecy', color: '#00d4ff' },
    { label: 'Finished', detail: 'Symmetric keys derived via HKDF', color: '#00ff88' },
    { label: '🔒 Encrypted', detail: 'AES-256-GCM active', color: '#ffcc00' },
  ]
  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid #ff336633', background: '#020408' }}>
      <div className="text-[9px] text-[#ff3366] px-2 pt-1.5 pb-1 font-bold tracking-widest">TLS 1.3 HANDSHAKE</div>
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}
            className="flex items-center gap-2 px-2 py-1 rounded text-[9px]"
            style={{ background: s.color + '11', border: `1px solid ${s.color}33` }}>
            <span className="font-bold" style={{ color: s.color, minWidth: 80 }}>{s.label}</span>
            <span className="text-[#60a0c0]">{s.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// DNS Resolution tree
function DNSViz() {
  const nodes = [
    { label: 'Browser', sub: 'Cache miss', color: '#00ff88', x: 50, y: 10 },
    { label: 'OS Resolver', sub: '/etc/resolv.conf', color: '#00d4ff', x: 50, y: 30 },
    { label: 'Root NS', sub: '. (13 servers)', color: '#ffcc00', x: 20, y: 55 },
    { label: '.com TLD', sub: 'Verisign', color: '#ff6b35', x: 50, y: 55 },
    { label: 'Auth NS', sub: 'ns1.google.com', color: '#8b5cf6', x: 80, y: 55 },
    { label: '142.250.80.46', sub: 'A record TTL:300', color: '#00ff88', x: 50, y: 80 },
  ]
  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid #00d4ff33', background: '#020408' }}>
      <div className="text-[9px] text-[#00d4ff] px-2 pt-1.5 pb-1 font-bold tracking-widest">DNS RESOLUTION — google.com</div>
      <div className="relative px-2 pb-2" style={{ height: 120 }}>
        {nodes.map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="absolute text-center"
            style={{ left: `${n.x - 10}%`, top: `${n.y}%`, transform: 'translateX(-50%)' }}>
            <div className="text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap"
              style={{ background: n.color + '22', border: `1px solid ${n.color}66`, color: n.color }}>
              {n.label}
            </div>
            <div className="text-[7px] text-[#40607080]">{n.sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function VisualizationCanvas() {
  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto p-1" style={{ scrollbarWidth: 'thin' }}>
      <WaveformViz />
      <EncapsulationViz />
      <TCPHandshakeViz />
      <TLSViz />
      <DNSViz />
    </div>
  )
}
