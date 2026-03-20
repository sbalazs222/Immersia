import { useState, useEffect, useRef, useCallback } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import "../styles/App.css"

function SoundBoard() {
    const [activeTab, setActiveTab] = useState("scene")
    const [scenes, setScenes] = useState([])
    const [ambiences, setAmbiences] = useState([])
    const [oneshots, setOneshots] = useState([])
    const [selectedScene, setSelectedScene] = useState(null)
    const [selectedAmbiences, setSelectedAmbiences] = useState([])
    const [selectedOneShots, setSelectedOneShots] = useState([])
    const [sceneMode, setSceneMode] = useState("explore")
    const [sceneVolume, setSceneVolume] = useState(50)
    const [isLoading, setIsLoading] = useState(false)
    const sceneAudioRef = useRef(null)
    const ambienceAudioMapRef = useRef(new Map())
    const oneshotAudioSetRef = useRef(new Set())
    const contentAreaRef = useRef(null)
    const pageStateRef = useRef({ scene: 1, ambience: 1, oneshot: 1 })
    const totalPagesRef = useRef({ scene: 1, ambience: 1, oneshot: 1 })

    const getItemKey = item => item?.slug ?? item?.title

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

    const fadeOutAudio = (audio, duration = 500) => {
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

    const fadeInAudio = (audio, targetVolume, duration = 500) => {
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

    const playScene = async (scene, isChangingMode) => {
        const slug = scene?.slug
        if (!slug) return
        
        if (selectedScene && getItemKey(selectedScene) === getItemKey(scene) && !isChangingMode) {
            await fadeOutAudio(sceneAudioRef.current)
            sceneAudioRef.current = null
            setSelectedScene(null)
            return
        }

        const currentSceneKey = getItemKey(selectedScene)
        const nextSceneKey = getItemKey(scene)

        // Fade out current audio if switching scenes or mode
        if (sceneAudioRef.current && (currentSceneKey !== nextSceneKey || isChangingMode)) {
            await fadeOutAudio(sceneAudioRef.current)
            sceneAudioRef.current = null
        }

        // Create new audio if needed
        if (!sceneAudioRef.current || currentSceneKey !== nextSceneKey || isChangingMode) {
            const sceneAudio = new Audio(`https://immersia.techtrove.cc/api/content/play/${slug}${sceneMode == "combat"? "?state=0" : ""}`)
            sceneAudio.loop = true
            sceneAudioRef.current = sceneAudio
        }

        setSelectedScene(scene)

        // Play and fade in
        try {
            await sceneAudioRef.current.play()
            await fadeInAudio(sceneAudioRef.current, sceneVolume / 100)
        } catch (err) {
            console.error("Failed to play scene:", err)
        }
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

    async function fetchSounds(page = 1, append = false) {
        setIsLoading(true)

        try {
            const limit = append ? 10 : 30
            const res = await fetch(`https://immersia.techtrove.cc/api/content/all/${activeTab}?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            const items = data.data || []
            const paginationData = data.pagination || {}

            // Update the appropriate state based on activeTab
            if (activeTab === "scene") {
                setScenes(prev => append ? [...prev, ...items] : items)
            } else if (activeTab === "ambience") {
                setAmbiences(prev => append ? [...prev, ...items] : items)
            } else if (activeTab === "oneshot") {
                setOneshots(prev => append ? [...prev, ...items] : items)
            }

            // Update pagination state
            pageStateRef.current[activeTab] = paginationData.page || page
            totalPagesRef.current[activeTab] = paginationData.totalPages || 1
        } catch (error) {
            console.error("Failed to fetch sounds:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const currentData = activeTab === "scene" ? scenes : activeTab === "ambience" ? ambiences : oneshots
        if (currentData.length === 0) {
            fetchSounds(1, false)
        }
    }, [activeTab, scenes, ambiences, oneshots])

    useEffect(() => {
        const contentArea = contentAreaRef.current
        if (!contentArea) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = contentArea
            const currentPageNum = pageStateRef.current[activeTab]
            const totalPages = totalPagesRef.current[activeTab]

            if (scrollHeight - scrollTop - clientHeight < 100 && !isLoading && currentPageNum < totalPages) {
                const nextPage = currentPageNum + 1
                pageStateRef.current[activeTab] = nextPage
                fetchSounds(nextPage, true)
            }
        }

        contentArea.addEventListener('scroll', handleScroll)
        return () => contentArea.removeEventListener('scroll', handleScroll)
    }, [activeTab, isLoading])
    useEffect(() => {
        if (selectedScene) {
            playScene(selectedScene, true)
        }
    }, [sceneMode])

    useEffect(() => {
        if (sceneAudioRef.current) {
            sceneAudioRef.current.volume = sceneVolume / 100
        }
    }, [sceneVolume])

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

                    <div className='content-area' ref={contentAreaRef}>
                        {activeTab == "scene" &&
                            <div className='scenes-list'>
                                {scenes.map(scene => (
                                    <div
                                        key={scene.slug ?? scene._id}
                                        className={`scene-item ${selectedScene && getItemKey(selectedScene) === getItemKey(scene) ? "selected" : ""}`}
                                    >
                                        <div className='scene-name' onClick={() => playScene(scene)}>{scene.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${scene.slug}`} alt={scene.title} width={"50px"} height={"50px"}/></div>
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
                                        <div className='ambience-name' onClick={() => toggleAmbiencePlayback(ambience)}>{ambience.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${ambience.slug}`} alt={ambience.title} width={"50px"} height={"50px"}/></div>
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
                                        <div className='oneshot-name' onClick={() => toggleOneShotSelection(oneshot)}>{oneshot.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${oneshot.slug}`} alt={oneshot.title} width={"50px"} height={"50px"}/></div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>

                <div className='soundboard-section'>
                    <Row>
                        <Col>
                            <div className='scenePlayer mb-4'>
                                <div className='scenePlayer-content'>
                                    <h2>Scene Player</h2>
                                    <Form.Range min={0} max={100} value={sceneVolume} onChange={(e) => setSceneVolume(parseFloat(e.target.value))} />
                                    {selectedScene ? (
                                        <div className='scene-item selected'>
                                            <div className='scene-name' onClick={() => playScene(selectedScene, false)}>{selectedScene.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${selectedScene.slug}`} alt={selectedScene.title} width={"50px"} height={"50px"}/></div>
                                            <Button onClick={() => setSceneMode("explore")}>Explore</Button>
                                            <Button onClick={() => setSceneMode("combat")}>Combat</Button>
                                        </div>
                                    ) : (
                                        <div>No scene selected</div>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className='ambiencePlayer mb-4'>
                                <div className='ambiencePlayer-content'>
                                    <h2>Ambience Player</h2>
                                    {selectedAmbiences.length > 0 ? (
                                        selectedAmbiences.map(ambience => (
                                            <div key={getItemKey(ambience)} className='ambience-item selected'>
                                                <div className='ambience-name' onClick={() => toggleAmbiencePlayback(ambience)}>{ambience.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${ambience.slug}`} alt={ambience.title} width={"50px"} height={"50px"}/></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No ambience selected</div>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className='oneshotPlayer mb-4'>
                                <div className='oneshotPlayer-content'>
                                    <h2>One-Shot Player</h2>
                                    {selectedOneShots.length > 0 ? (
                                        selectedOneShots.map(oneshot => (
                                            <div key={getItemKey(oneshot)} className='oneshot-item selected'>
                                                <div className='oneshot-name' onClick={() => playOneShot(oneshot)}>{oneshot.title} <img src={`https://immersia.techtrove.cc/api/content/thumb/${oneshot.slug}`} alt={oneshot.title} width={"50px"} height={"50px"}/></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No oneshot selected</div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>
            </div>
        </>
    );

}
export default SoundBoard;