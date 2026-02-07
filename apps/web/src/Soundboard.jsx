import { useState } from 'react'

function SoundBoard(){
const [activeTab, setActiveTab] = useState("scenes")

return(
    <>
    <div className='p-4'>
    <div className='tabs-container'>
        <button className={activeTab == "scenes" ? "tab-btn active" : "tab-btn"} onClick={setActiveTab("scenes")}>Scenes</button>
        <button className={activeTab == "ambiences" ? "tab-btn active" : "tab-btn"} onClick={setActiveTab("ambiences")}>Ambiences</button>
        <button className={activeTab == "oneshots" ? "tab-btn active" : "tab-btn"} onClick={setActiveTab("oneshots")}>One-Shots</button>
    </div> 

    <div className='mt-4'>
        {/* Ha a scenes fül aktív, ezt mutatjuk: */}
        {activeTab === 'scenes' && (
          <div>
            <h2>Itt lesznek a Helyszínek (Képek)</h2>
            <p>Ez a Scenes oldal tartalma.</p>
          </div>
        )}

        {/* Ha az ambiences fül aktív, ezt mutatjuk: */}
        {activeTab === 'ambiences' && (
          <div>
            <h2>Itt lesznek a Háttérzajok (Csíkok)</h2>
            <p>Ez az Ambiences oldal tartalma.</p>
          </div>
        )}

        {/* Ha a oneshots fül aktív, ezt mutatjuk: */}
        {activeTab === 'oneshots' && (
          <div>
            <h2>Itt lesznek az Effektek (Gombok)</h2>
            <p>Ez a One-Shots oldal tartalma.</p>
          </div>
        )}
    </div>

    </div>
    </>
)

}
export default SoundBoard;