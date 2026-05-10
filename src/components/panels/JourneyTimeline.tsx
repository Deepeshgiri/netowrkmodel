import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { INTERNET_JOURNEY_STEPS } from '../../data/knowledgeNodes'

const LAYER_COLORS: Record<number, string> = { 1: '#ff6b35', 2: '#ffcc00', 3: '#00d4ff', 4: '#00ff88', 5: '#8b5cf6', 6: '#ff3366', 7: '#00ff88' }

export default function JourneyTimeline() {
  const { journeyStep, journeyPlaying, setJourneyStep, setJourneyPlaying } = useStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (journeyPlaying) {
      const step = INTERNET_JOURNEY_STEPS[journeyStep]
      timerRef.current = setTimeout(() => {
        if (journeyStep < INTERNET_JOURNEY_STEPS.length - 1) {
          setJourneyStep(journeyStep + 1)
        } else {
          setJourneyPlaying(false)
        }
      }, step.duration * 8 + 600)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [journeyPlaying, journeyStep])

  const current = INTERNET_JOURNEY_STEPS[journeyStep]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Current Step Detail */}
      <motion.div
        key={journeyStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded"
        style={{ background: `${LAYER_COLORS[current.layer]}11`, border: `1px solid ${LAYER_COLORS[current.layer]}44` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{current.icon}</span>
          <div>
            <div className="text-sm font-bold" style={{ color: LAYER_COLORS[current.layer] }}>{current.title}</div>
            <div className="text-[10px] text-[#60a0c0]">Layer {current.layer} • Step {current.step}/12</div>
          </div>
          <div className="ml-auto text-[10px] px-2 py-0.5 rounded font-mono"
            style={{ background: '#00d4ff22', color: '#00d4ff', border: '1px solid #00d4ff44' }}>
            ~{current.duration}ms
          </div>
        </div>
        <div className="text-xs text-[#80a0c0] leading-relaxed">{current.description}</div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setJourneyStep(Math.max(0, journeyStep - 1))}
          disabled={journeyStep === 0}
          className="flex-1 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-30"
          style={{ background: '#0a2040', border: '1px solid #1a4060', color: '#00d4ff' }}
        >◀ Prev</button>
        <button
          onClick={() => setJourneyPlaying(!journeyPlaying)}
          className="flex-1 py-1.5 rounded text-xs font-bold transition-all"
          style={{ background: journeyPlaying ? '#ff336622' : '#00d4ff22', border: `1px solid ${journeyPlaying ? '#ff3366' : '#00d4ff'}`, color: journeyPlaying ? '#ff3366' : '#00d4ff' }}
        >{journeyPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button
          onClick={() => setJourneyStep(Math.min(INTERNET_JOURNEY_STEPS.length - 1, journeyStep + 1))}
          disabled={journeyStep === INTERNET_JOURNEY_STEPS.length - 1}
          className="flex-1 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-30"
          style={{ background: '#0a2040', border: '1px solid #1a4060', color: '#00d4ff' }}
        >Next ▶</button>
      </div>

      {/* Step List */}
      <div className="flex flex-col gap-1 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
        {INTERNET_JOURNEY_STEPS.map((step, i) => {
          const color = LAYER_COLORS[step.layer]
          const isActive = i === journeyStep
          const isDone = i < journeyStep
          return (
            <motion.div
              key={step.id}
              whileHover={{ x: 3 }}
              onClick={() => { setJourneyStep(i); setJourneyPlaying(false) }}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all"
              style={{
                background: isActive ? `${color}22` : isDone ? `${color}08` : 'transparent',
                border: `1px solid ${isActive ? color : isDone ? color + '44' : '#0a2040'}`,
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: isActive ? color : isDone ? color + '44' : '#0a2040', color: isActive ? '#000' : color }}>
                {isDone ? '✓' : step.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: isActive ? color : isDone ? color + 'aa' : '#60a0c0' }}>
                  {step.icon} {step.title}
                </div>
                <div className="text-[9px] text-[#40607080]">L{step.layer} • {step.duration}ms</div>
              </div>
              {isActive && (
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
