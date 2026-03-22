import { FADE_DURATION } from './constants'

export const stopAudio = (audio) => {
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
}

export const fadeOutAudio = (audio, duration = FADE_DURATION) => {
  if (!audio) return Promise.resolve()

  return new Promise(resolve => {
    const startVolume = audio.volume
    const startTime = Date.now()

    const fade = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      audio.volume = startVolume * (1 - progress)

      if (progress < 1) {
        requestAnimationFrame(fade)
      } else {
        audio.pause()
        audio.currentTime = 0
        audio.volume = startVolume
        resolve()
      }
    }

    requestAnimationFrame(fade)
  })
}

export const fadeInAudio = (audio, targetVolume, duration = FADE_DURATION) => {
  if (!audio) return Promise.resolve()

  return new Promise(resolve => {
    audio.volume = 0
    const startTime = Date.now()

    const fade = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      audio.volume = targetVolume * progress

      if (progress < 1) {
        requestAnimationFrame(fade)
      } else {
        audio.volume = targetVolume
        resolve()
      }
    }

    requestAnimationFrame(fade)
  })
}
