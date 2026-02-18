import { useState } from 'react'
import "./styles/App.css"

function SoundBoard() {
    const [activeTab, setActiveTab] = useState("scenes")

    return (
        <>
            <div className='soundboard-dsgn'>
                <div className='soundboard-section'>
                    <div className='tabs-dsgn'>
                        <div className='tabs-container'>
                            <button className={activeTab == "scenes" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("scenes")}>Scenes</button>
                            <button className={activeTab == "ambiences" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("ambiences")}>Ambiences</button>
                            <button className={activeTab == "oneshots" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("oneshots")}>One-Shots</button>
                        </div>
                    </div>

                    <div className='content-area'>
                        {activeTab == "scenes" && <div>Scenes</div>}
                        {activeTab == "ambiences" && <div>Ambiences</div>}
                        {activeTab == "oneshots" && <div>One-shots</div>}
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