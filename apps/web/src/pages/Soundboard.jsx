import { useState, useEffect } from 'react'
import "../styles/App.css"

function SoundBoard() {
    const [activeTab, setActiveTab] = useState("scene")
    const [scenes, setScenes] = useState([])
    const [ambiences, setAmbiences] = useState([])
    const [oneshots, setOneshots] = useState([])
    const [savedPages, setSavedPages] = useState([])
    
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
                        {activeTab == "scene" && <div>Scenes</div>}
                        {activeTab == "ambience" && <div>Ambiences</div>}
                        {activeTab == "oneshot" && <div>One-shots</div>}
                    </div>
                </div>

                <div className='soundboard-section'>
                    <div className='content-area'>
                        <div>Soundboard</div>
                    </div>
                </div>
            </div>
        </>
    );

}
export default SoundBoard;