import { useState } from 'react'
import "./styles/App.css"

function SoundBoard() {
    const [activeTab, setActiveTab] = useState("scenes")

    return (
        <>
            <div className='soundboard-dsgn'>
                <div className='soundboard-section top-section'>
                    <div className='tabs-dsgn'>
                        <div className='tabs-container'>
                            <button className={activeTab == "scenes" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("scenes")}>Scenes</button>
                            <button className={activeTab == "ambiences" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("ambiences")}>Ambiences</button>
                            <button className={activeTab == "oneshots" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("oneshots")}>One-Shots</button>
                        </div>
                    </div>

                    <div className='content'>
                        {activeTab == "scenes" && <div className='ideiglenes'>Scenes</div>}
                        {activeTab == "ambiences" && <div className='ideiglenes'>Ambiences</div>}
                        {activeTab == "oneshots" && <div className='ideiglenes'>One-shots</div>}
                    </div>
                </div>

                <div className='soundboard-section bottom-section'>
                    <div className='content-area'>
                        <div className='ideiglenes'>Soundboard</div>
                    </div>
                </div>
            </div>
        </>
    );

}
export default SoundBoard;