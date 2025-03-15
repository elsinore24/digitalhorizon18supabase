import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameState from '../../hooks/useGameState'
import useAudio from '../../hooks/useAudio'
import useDialogue from '../../hooks/useDialogue'
import TemporalEcho from '../../components/TemporalEcho'
import Scene3D from '../../components/Scene3D'
import DataPerceptionOverlay from '../../components/DataPerceptionOverlay'
import ObjectiveTracker from '../../components/ObjectiveTracker'
import DialogueSystem from '../../components/DialogueSystem'
import styles from './LunarArrival.module.scss'

const INTRO_DIALOGUE = [
  {
    id: 'lunar_arrival_intro',
    speaker: 'ALARA',
    text: "Professor Thorne? Can you hear me? Your neural connection is stabilizing... There you are. The transfer was rougher than anticipated. Your consciousness has been projected into this data construct while your physical form remains in stasis back at the institute. I'm ALARA - Advanced Linguistic Analysis and Retrieval Algorithm. I've been tasked with guiding you through these forgotten data fragments.",
    duration: 8000
  },
  // ... other dialogue entries remain the same ...
]

const LunarArrival = ({ dataPerceptionMode }) => {
  const { gameState, visitScene } = useGameState()
  const { playNarration } = useAudio()
  const { setDialogue } = useDialogue()
  const [introStep, setIntroStep] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const isFirstVisit = !gameState.scenesVisited.includes('lunar_arrival')
    if (isFirstVisit) {
      playIntroSequence()
      visitScene('lunar_arrival')
    }
  }, [gameState.scenesVisited, visitScene])

  const playIntroSequence = async () => {
    setIsPlaying(true)
    for (let i = 0; i < INTRO_DIALOGUE.length; i++) {
      const dialogue = INTRO_DIALOGUE[i]
      setDialogue(dialogue)
      await new Promise(resolve => {
        playNarration(dialogue.id)
        setTimeout(resolve, dialogue.duration)
      })
      setIntroStep(i + 1)
    }
    setIntroComplete(true)
    setIsPlaying(false)
  }

  return (
    <div className={styles.sceneContainer}>
      <div className={styles.lunarSurface}>
        <div className={styles.stars} />
        <div className={styles.horizon} />
        <div className={styles.lunarGround} />
      </div>

      <Scene3D dataPerceptionMode={dataPerceptionMode} />
      <DataPerceptionOverlay active={dataPerceptionMode} />
      
      <ObjectiveTracker 
        objective="DR. KAI'S RESEARCH FRGM"
        progress={{
          RESEARCH_LOG: gameState.discoveredEchoes.filter(id => id.startsWith('research_')).length,
          PERSONAL_MEMORY: gameState.discoveredEchoes.filter(id => id.startsWith('memory_')).length,
          ANOMALY: gameState.discoveredEchoes.filter(id => id.startsWith('anomaly_')).length
        }}
      />
      
      <div className={styles.environment}>
        {dataPerceptionMode && (
          <div className={styles.dataElements}>
            <TemporalEcho 
              id="research_001"
              type="RESEARCH_LOG"
              position={{ x: 25, y: 40 }}
            />
            <TemporalEcho 
              id="memory_001"
              type="PERSONAL_MEMORY"
              position={{ x: 75, y: 60 }}
            />
            <TemporalEcho 
              id="anomaly_001"
              type="ANOMALY"
              position={{ x: 50, y: 30 }}
            />
          </div>
        )}
      </div>

      <DialogueSystem />
    </div>
  )
}

export default LunarArrival
