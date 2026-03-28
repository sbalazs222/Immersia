import '../styles/App.css'
import { useSoundFetch } from './soundboard/hooks/useSoundFetch'
import { AdminSoundList } from '../components/AdminSoundList';
import { Button } from 'react-bootstrap';

function Admin() {

    const {
        activeTab,
        setActiveTab,
        scenes,
        ambiences,
        oneshots,
        contentAreaRef
    } = useSoundFetch()

    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const itemsToDelete = [];
    }

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
                        <Button variant="outline-primary">Edit</Button>
                        <Button variant="outline-danger">Delete</Button>  
                        {
                            activeTab === 'scene' ? (
                                <div>
                                    <h2>Scenes</h2>
                                    <AdminSoundList 
                                        type='scene'
                                        items={scenes}
                                        formSubmitHandler={handleFormSubmit}
                                    />
                                </div>
                            ) : activeTab === 'ambience' ? (
                                <div>
                                    <h2>Ambiences</h2>
                                    <AdminSoundList 
                                        type='ambience'
                                        items={ambiences}
                                        formSubmitHandler={handleFormSubmit}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2>One-Shots</h2>
                                    <AdminSoundList 
                                        type='oneshot'
                                        items={oneshots}
                                        formSubmitHandler={handleFormSubmit}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
export default Admin;