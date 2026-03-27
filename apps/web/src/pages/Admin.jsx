import '../styles/App.css'
import { useSoundFetch } from './soundboard/hooks/useSoundFetch'

function Admin() {

    const {
        activeTab,
        setActiveTab,
        scenes,
        ambiences,
        oneshots,
        contentAreaRef
    } = useSoundFetch()

    return (
        <>
            <h1>Admin Page</h1>
            <div className='soundboard-dsgn'>
                <div className='soundboard-section'>
                    <div className='tabs-dsgn'>
                        <div className='tabs-container'>
                            <button
                                className={activeTab === 'scene' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setActiveTab('scene')}
                            >
                                Scenes
                            </button>
                            <button
                                className={activeTab === 'ambience' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setActiveTab('ambience')}
                            >
                                Ambiences
                            </button>
                            <button
                                className={activeTab === 'oneshot' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setActiveTab('oneshot')}
                            >
                                One-Shots
                            </button>
                        </div>
                    </div>
                    <div ref={contentAreaRef}>
                        <p>This is the admin page. Here you can manage your soundboard content.</p>
                        <p>{scenes.length} {ambiences.length} {oneshots.length}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Admin;