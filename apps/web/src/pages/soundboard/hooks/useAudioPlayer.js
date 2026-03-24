import { useState, useRef, useEffect, useCallback } from 'react'
import { stopAudio, fadeOutAudio, fadeInAudio } from '../utils/audioUtils'
import { getItemKey, toggleSelection } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'

export function useAudioPlayer() {
  const [selectedScene, setSelectedScene] = useState(null) // Track selected scene for UI purposes
  const [selectedAmbiences, setSelectedAmbiences] = useState([]) // Track selected ambiences for UI purposes
  const [selectedOneShots, setSelectedOneShots] = useState([]) // Track selected one-shots for UI purposes
  const [sceneMode, setSceneMode] = useState('explore') // 'explore' or 'combat'
  const [sceneVolume, setSceneVolume] = useState(50) // Default volume at 50%
  const [ambienceVolumes, setAmbienceVolumes] = useState({}) // Default ambience volume at 50%
  const [isScenePaused, setIsScenePaused] = useState(true) // Track if the current scene is paused

  const sceneAudioRef = useRef(null) // Ref to hold the current scene audio element
  const ambienceAudioMapRef = useRef(new Map()) // Map to track ambience audios by their keys
  const oneshotAudioSetRef = useRef(new Set()) // Using a Set to track one-shot audios for easy cleanup
  const scenePlayingRef = useRef(null) // Track what's currently playing
  const isPlayingSceneRef = useRef(false) // Track if a play operation is in progress

  const togglePauseScene = useCallback(async () => {
    // If no scene is currently loaded, do nothing
    if (!sceneAudioRef.current) return

    // If currently paused, try to resume playback
    if (isScenePaused) {
      try {
        await sceneAudioRef.current.play()
        await fadeInAudio(sceneAudioRef.current, sceneVolume / 100)
        setIsScenePaused(false)
      } catch (err) {
        console.error('Failed to resume scene:', err)
      }
    } else {
      // If currently playing, pause
      sceneAudioRef.current.pause()
      setIsScenePaused(true)
    }
  }, [isScenePaused, sceneVolume])

  const playScene = useCallback(async (scene, isChangingMode) => {
    // Prevent multiple rapid clicks from causing issues
    const slug = scene?.slug
    if (!slug) return

    // Wait for any play operation to complete
    while (isPlayingSceneRef.current) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // For user clicks (not mode changes), prevent rapid plays
    if (!isChangingMode && isPlayingSceneRef.current) {
      return
    }
    
    // Mark that we're starting the play operation
    isPlayingSceneRef.current = true
    
    // If changing mode, we want to keep the same scene but update the audio source
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
        setIsScenePaused(true)
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
      setIsScenePaused(true)

      // Load audio but don't play automatically
      sceneAudio.volume = sceneVolume / 100
    } catch (err) {
      console.error('Failed to play scene:', err)
      // Cleanup on error
      if (sceneAudioRef.current) {
        stopAudio(sceneAudioRef.current)
        sceneAudioRef.current = null
      }
      scenePlayingRef.current = null
      setSelectedScene(null)
      setIsScenePaused(false)
    } finally {
      isPlayingSceneRef.current = false
    }
  }, [sceneMode, sceneVolume])

  const setAmbienceVolume = useCallback((ambienceKey, volume) => {
    // Update the volume state for this ambience
    setAmbienceVolumes(prev => ({ ...prev, [ambienceKey]: volume }))
    
    // Update the audio element's volume in real-time
    const ambienceAudio = ambienceAudioMapRef.current.get(ambienceKey)
    if (ambienceAudio) {
      ambienceAudio.volume = volume / 100
    }
  }, [])

  const toggleAmbiencePlayback = (ambience) => {
    const ambienceKey = getItemKey(ambience)
    const slug = ambience?.slug
    if (!ambienceKey || !slug) return

    // Check if this ambience is already playing
    const ambienceAudioMap = ambienceAudioMapRef.current
    const existingAudio = ambienceAudioMap.get(ambienceKey)

    // If it's already playing, stop it and remove from selected
    if (existingAudio) {
      stopAudio(existingAudio)
      ambienceAudioMap.delete(ambienceKey)
      setSelectedAmbiences(prev => prev.filter(item => getItemKey(item) !== ambienceKey))
      // Clean up volume tracking
      setAmbienceVolumes(prev => {
        const updated = { ...prev }
        delete updated[ambienceKey]
        return updated
      })
      return
    }

    // Otherwise, create new audio and play
    const ambienceAudio = new Audio(`${API_BASE_URL}/content/play/${slug}`)
    ambienceAudio.loop = true
    ambienceAudioMap.set(ambienceKey, ambienceAudio)

    // Initialize volume for this ambience (default: 0)
    const initialVolume = 0
    setAmbienceVolumes(prev => ({ ...prev, [ambienceKey]: initialVolume }))
    ambienceAudio.volume = initialVolume / 100

    // Handle cleanup on end or error
    setSelectedAmbiences(prev => toggleSelection(prev, ambience))
    ambienceAudio.play().catch(err => {
      console.error('Failed to play ambience:', err)
      ambienceAudioMap.delete(ambienceKey)
      setSelectedAmbiences(prev => prev.filter(item => getItemKey(item) !== ambienceKey))
      setAmbienceVolumes(prev => {
        const updated = { ...prev }
        delete updated[ambienceKey]
        return updated
      })
    })
  }

  const toggleOneShotSelection = (oneshot) => {
    // Toggle selection in UI
    setSelectedOneShots(prev => toggleSelection(prev, oneshot))
    oneshotAudioSetRef.current.forEach(audio => {
      // If the audio is for the one-shot being toggled off, stop it
      // Using foreach since we need to check each audio's source against the oneshot key
      if (audio.src.includes(getItemKey(oneshot))) {
        stopAudio(audio)
        oneshotAudioSetRef.current.delete(audio)
      }
    })
  }

  const playOneShot = (oneshot) => {
    const slug = oneshot?.slug
    if (!slug) return

    // Create and play one-shot audio
    const oneshotAudio = new Audio(`${API_BASE_URL}/content/play/${slug}`)
    oneshotAudioSetRef.current.add(oneshotAudio)

    const clearOneShot = () => {
      oneshotAudioSetRef.current.delete(oneshotAudio)
    }
    
    // Handle cleanup on end or error
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

  // Update audio URL when mode changes (if audio is loaded)
  useEffect(() => {
    if (selectedScene && sceneAudioRef.current && !isScenePaused) {
      // Only update if scene is currently playing
      const slug = selectedScene.slug
      const audioUrl = `${API_BASE_URL}/content/play/${slug}${
        sceneMode === 'combat' ? '?state=0' : ''
      }`
      
      // Preserve current time and play state when switching modes
      const currentTime = sceneAudioRef.current.currentTime
      const wasPlaying = !sceneAudioRef.current.paused
      
      stopAudio(sceneAudioRef.current)
      
      const sceneAudio = new Audio(audioUrl)
      sceneAudio.loop = true
      sceneAudio.volume = sceneVolume / 100
      sceneAudio.currentTime = currentTime
      sceneAudioRef.current = sceneAudio
      
      if (wasPlaying) {
        sceneAudio.play().catch(err => {
          console.error('Failed to resume scene with new mode:', err)
        })
      }
    }
  }, [sceneMode])

  // Update ambience volumes when ambienceVolumes state changes
  useEffect(() => {
    ambienceAudioMapRef.current.forEach((audio, ambienceKey) => {
      const volume = ambienceVolumes[ambienceKey] ?? 50
      audio.volume = volume / 100
    })
  }, [ambienceVolumes])

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

      setIsScenePaused(false)
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
    ambienceVolumes,
    setAmbienceVolume,
    isScenePaused,
    playScene,
    togglePauseScene,
    toggleAmbiencePlayback,
    toggleOneShotSelection,
    playOneShot
  }
}
