import { useState, useEffect, useRef } from 'react'
import "../styles/App.css"

function SoundBoard() {
    const [activeTab, setActiveTab] = useState("scene")
    const [scenes, setScenes] = useState([])
    const [ambiences, setAmbiences] = useState([])
    const [oneshots, setOneshots] = useState([])
    const [selectedScene, setSelectedScene] = useState(null)
    const [selectedAmbiences, setSelectedAmbiences] = useState([])
    const [selectedOneShots, setSelectedOneShots] = useState([])
    const [savedPages, setSavedPages] = useState([])
    const sceneAudioRef = useRef(null)
    const ambienceAudioMapRef = useRef(new Map())
    const oneshotAudioSetRef = useRef(new Set())

    const getItemKey = item => item?.slug ?? item?._id ?? item?.id ?? item?.title

    const isItemSelected = (selectedItems, item) => {
        const itemKey = getItemKey(item)
        if (!itemKey) return false
        return selectedItems.some(selected => getItemKey(selected) === itemKey)
    }

    const toggleSelection = (prev, item) => {
        const itemKey = getItemKey(item)
        if (!itemKey) return prev

        const exists = prev.some(selected => getItemKey(selected) === itemKey)
        if (exists) return prev.filter(selected => getItemKey(selected) !== itemKey)
        return [...prev, item]
    }

    const stopAudio = audio => {
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
    }

    const playScene = scene => {
        const slug = scene?.slug
        if (!slug) return

        if (selectedScene && getItemKey(selectedScene) === getItemKey(scene)) {
            stopAudio(sceneAudioRef.current)
            sceneAudioRef.current = null
            setSelectedScene(null)
            return
        }

        const currentSceneKey = getItemKey(selectedScene)
        const nextSceneKey = getItemKey(scene)

        if (sceneAudioRef.current && currentSceneKey !== nextSceneKey) {
            stopAudio(sceneAudioRef.current)
            sceneAudioRef.current = null
        }

        if (!sceneAudioRef.current) {
            const sceneAudio = new Audio(`https://immersia.techtrove.cc/api/content/play/${slug}`)
            sceneAudio.loop = true
            sceneAudioRef.current = sceneAudio
        }

        setSelectedScene(scene)
        sceneAudioRef.current.play().catch(err => {
            console.error("Failed to play scene:", err)
        })
    }

    const toggleAmbiencePlayback = ambience => {
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

        const ambienceAudio = new Audio(`https://immersia.techtrove.cc/api/content/play/${slug}`)
        ambienceAudio.loop = true
        ambienceAudioMap.set(ambienceKey, ambienceAudio)

        setSelectedAmbiences(prev => toggleSelection(prev, ambience))
        ambienceAudio.play().catch(err => {
            console.error("Failed to play ambience:", err)
            ambienceAudioMap.delete(ambienceKey)
            setSelectedAmbiences(prev => prev.filter(item => getItemKey(item) !== ambienceKey))
        })
    }

    const toggleOneShotSelection = oneshot => {
        setSelectedOneShots(prev => toggleSelection(prev, oneshot))
    }

    const playOneShot = oneshot => {
        const slug = oneshot?.slug
        if (!slug) return

        const oneshotAudio = new Audio(`https://immersia.techtrove.cc/api/content/play/${slug}`)
        oneshotAudioSetRef.current.add(oneshotAudio)

        const clearOneShot = () => {
            oneshotAudioSetRef.current.delete(oneshotAudio)
        }

        oneshotAudio.addEventListener("ended", clearOneShot, { once: true })
        oneshotAudio.addEventListener("error", clearOneShot, { once: true })

        oneshotAudio.play().catch(err => {
            console.error("Failed to play one-shot:", err)
            clearOneShot()
        })
    }
    
    async function fetchSounds() {
        const res = await fetch(`https://immersia.techtrove.cc/api/content/all/${activeTab}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (activeTab == "scene") setScenes(data.data)
        else if (activeTab == "ambience") setAmbiences(data.data)
        else if (activeTab == "oneshot") setOneshots(data.data)
    }

    useEffect(() => {
        fetchSounds()
    }, [activeTab])

    useEffect(() => {
        return () => {
            stopAudio(sceneAudioRef.current)

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

    return (
        <>
            <div className='soundboard-dsgn'>
                <div className='soundboard-section'>
                    <div className='tabs-dsgn'>
                        <div className='tabs-container'>
                            <button className={activeTab == "scene" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("scene")}>Scenes</button>
                            <button className={activeTab == "ambience" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("ambience")}>Ambiences</button>
                            <button className={activeTab == "oneshot" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("oneshot")}>One-Shots</button>
                        </div>
                    </div>

                    <div className='content-area'>
                        {activeTab == "scene" && 
                            <div className='scenes-list'>
                                {scenes.map(scene => (
                                    <div
                                        key={scene.slug ?? scene._id}
                                        className={`scene-item ${selectedScene && getItemKey(selectedScene) === getItemKey(scene) ? "selected" : ""}`}
                                    >
                                        <div className='scene-name' onClick={() => playScene(scene)}>{scene.title}</div>
                                    </div>
                                ))}
                            </div>
                        }
                        {activeTab == "ambience" && 
                            <div className='ambiences-list'>
                                {ambiences.map(ambience => (
                                    <div
                                        key={ambience.slug ?? ambience._id}
                                        className={`ambience-item ${isItemSelected(selectedAmbiences, ambience) ? "selected" : ""}`}
                                    >
                                        <div className='ambience-name' onClick={() => toggleAmbiencePlayback(ambience)}>{ambience.title}</div>
                                    </div>
                                ))}
                            </div>
                        }
                        {activeTab == "oneshot" && 
                            <div className='oneshots-list'>
                                {oneshots.map(oneshot => (
                                    <div
                                        key={oneshot.slug ?? oneshot._id}
                                        className={`oneshot-item ${isItemSelected(selectedOneShots, oneshot) ? "selected" : ""}`}
                                    >
                                        <div className='oneshot-name' onClick={() => toggleOneShotSelection(oneshot)}>{oneshot.title}</div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>

                <div className='soundboard-section'>
                    <div className='content-area'>
                        <div>Soundboard</div>
                        {activeTab == "scene" &&
                            <div className='selected-scene'>
                                {selectedScene ? (
                                    <div className='scene-item selected'>
                                        <div className='scene-name' onClick={() => playScene(selectedScene)}>{selectedScene.title}</div>
                                    </div>
                                ) : (
                                    <div>No scene selected</div>
                                )}
                            </div>
                        }
                        {activeTab == "ambience" &&
                            <div className='selected-ambiences'>
                                {selectedAmbiences.length > 0 ? (
                                    selectedAmbiences.map(ambience => (
                                        <div key={getItemKey(ambience)} className='ambience-item selected'>
                                            <div className='ambience-name' onClick={() => toggleAmbiencePlayback(ambience)}>{ambience.title}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No ambience selected</div>
                                )}
                            </div>
                        }
                        {activeTab == "oneshot" && 
                            <div className='selected-oneshots'>
                                {selectedOneShots.length > 0 ? (
                                    selectedOneShots.map(oneshot => (
                                        <div key={getItemKey(oneshot)} className='oneshot-item selected'>
                                            <div className='oneshot-name' onClick={() => playOneShot(oneshot)}>{oneshot.title}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No oneshot selected</div>
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );

}
export default SoundBoard;