import { useState, useRef, useEffect, useCallback } from 'react'
import { stopAudio, fadeOutAudio, fadeInAudio } from '../utils/audioUtils'
import { getItemKey, toggleSelection } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'

export function useAudioPlayer() {
  const [selectedScene, setSelectedScene] = useState(null)
  const [selectedAmbiences, setSelectedAmbiences] = useState([])
  const [selectedOneShots, setSelectedOneShots] = useState([])
  const [sceneMode, setSceneMode] = useState('explore')
  const [sceneVolume, setSceneVolume] = useState(50)

  const sceneAudioRef = useRef(null)
  const ambienceAudioMapRef = useRef(new Map())
  const oneshotAudioSetRef = useRef(new Set())
  const scenePlayingRef = useRef(null) // Track what's currently playing
  const isPlayingSceneRef = useRef(false) // Track if a play operation is in progress

  const playScene = useCallback(async (scene, isChangingMode) => {
    const slug = scene?.slug
    if (!slug) return

    // Wait for any in-flight play operation to complete
    while (isPlayingSceneRef.current) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // For user clicks (not mode changes), prevent rapid successive plays
    if (!isChangingMode && isPlayingSceneRef.current) {
      return
    }

    isPlayingSceneRef.current = true
    
    try {
      const currentPlayingKey = scenePlayingRef.current
      const nextSceneKey = getItemKey(scene)

      // If clicking the same scene (not changing mode), toggle it off
      if (currentPlayingKey === nextSceneKey && !isChangingMode) {
        if (sceneAudioRef.current) {
          await fadeOutAudio(sceneAudioRef.current)
          stopAudio(sceneAudioRef.current)
        }
        sceneAudioRef.current = null
        scenePlayingRef.current = null
        setSelectedScene(null)
        setSceneMode('explore')
        return
      }

      // Stop current audio before creating new one
      if (sceneAudioRef.current) {
        if (!isChangingMode) {
          // For normal scene switches, fade out gracefully
          await fadeOutAudio(sceneAudioRef.current)
        }
        stopAudio(sceneAudioRef.current)
        sceneAudioRef.current = null
      }

      // Create and play new audio
      const audioUrl = `${API_BASE_URL}/content/play/${slug}${
        sceneMode === 'combat' ? '?state=0' : ''
      }`
      
      const sceneAudio = new Audio(audioUrl)
      sceneAudio.loop = true
      sceneAudioRef.current = sceneAudio

      scenePlayingRef.current = nextSceneKey
      setSelectedScene(scene)

      // Play and fade in
      await sceneAudio.play()
      await fadeInAudio(sceneAudio, sceneVolume / 100)
    } catch (err) {
      console.error('Failed to play scene:', err)
      // Cleanup on error
      if (sceneAudioRef.current) {
        stopAudio(sceneAudioRef.current)
        sceneAudioRef.current = null
      }
      scenePlayingRef.current = null
      setSelectedScene(null)
    } finally {
      isPlayingSceneRef.current = false
    }
  }, [sceneMode, sceneVolume])

  const toggleAmbiencePlayback = (ambience) => {
    const ambienceKey = getItemKey(ambience)
    const slug = ambience?.slug
    if (!ambienceKey || !slug) return

    const ambienceAudioMap = ambienceAudioMapRef.current
    const existingAudio = ambienceAudioMap.get(ambienceKey)

    if (existingAudio) {
      stopAudio(existingAudio)
      ambienceAudioMap.delete(ambienceKey)
      setSelectedAmbiences(prev => prev.filter(item => getItemKey(item) !== ambienceKey))
      return
    }

    const ambienceAudio = new Audio(`${API_BASE_URL}/content/play/${slug}`)
    ambienceAudio.loop = true
    ambienceAudioMap.set(ambienceKey, ambienceAudio)

    setSelectedAmbiences(prev => toggleSelection(prev, ambience))
    ambienceAudio.play().catch(err => {
      console.error('Failed to play ambience:', err)
      ambienceAudioMap.delete(ambienceKey)
      setSelectedAmbiences(prev => prev.filter(item => getItemKey(item) !== ambienceKey))
    })
  }

  const toggleOneShotSelection = (oneshot) => {
    setSelectedOneShots(prev => toggleSelection(prev, oneshot))
  }

  const playOneShot = (oneshot) => {
    const slug = oneshot?.slug
    if (!slug) return

    const oneshotAudio = new Audio(`${API_BASE_URL}/content/play/${slug}`)
    oneshotAudioSetRef.current.add(oneshotAudio)

    const clearOneShot = () => {
      oneshotAudioSetRef.current.delete(oneshotAudio)
    }

    oneshotAudio.addEventListener('ended', clearOneShot, { once: true })
    oneshotAudio.addEventListener('error', clearOneShot, { once: true })

    oneshotAudio.play().catch(err => {
      console.error('Failed to play one-shot:', err)
      clearOneShot()
    })
  }

  // Update scene volume
  useEffect(() => {
    if (sceneAudioRef.current) {
      sceneAudioRef.current.volume = sceneVolume / 100
    }
  }, [sceneVolume])

  // Re-play scene when mode changes
  useEffect(() => {
    if (selectedScene) {
      playScene(selectedScene, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio(sceneAudioRef.current)
      sceneAudioRef.current = null
      scenePlayingRef.current = null

      ambienceAudioMapRef.current.forEach(audio => {
        stopAudio(audio)
      })
      ambienceAudioMapRef.current.clear()

      oneshotAudioSetRef.current.forEach(audio => {
        stopAudio(audio)
      })
      oneshotAudioSetRef.current.clear()
    }
  }, [])

  return {
    selectedScene,
    selectedAmbiences,
    selectedOneShots,
    sceneMode,
    setSceneMode,
    sceneVolume,
    setSceneVolume,
    playScene,
    toggleAmbiencePlayback,
    toggleOneShotSelection,
    playOneShot
  }
}
