import { useState } from 'react'
import "./styles/App.css"

function SoundBoard(){
const [activeTab, setActiveTab] = useState("scenes")

return(
    <>
    <div className='p-4'>
    <div className='tabs-container'>
        <button className={activeTab == "scenes" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("scenes")}>Scenes</button>
        <button className={activeTab == "ambiences" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("ambiences")}>Ambiences</button>
        <button className={activeTab == "oneshots" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("oneshots")}>One-Shots</button>
    </div> 

    <div className='mt-4'>
        {activeTab == "scenes" && (
            <p>scenes</p>
        )}

        {activeTab == "ambiences" && (
          <p>ambiences</p>
        )}

        {activeTab == "oneshots" && (
          <p>Oneshots</p>
        )}
    </div>


    </div>
    </>
)

}
export default SoundBoard;