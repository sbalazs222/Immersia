import '../styles/App.css'
import { useSoundFetch } from './soundboard/hooks/useSoundFetch'
import { AdminSoundList } from '../components/AdminSoundList';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Admin() {

    const {
        activeTab,
        setActiveTab,
        scenes,
        ambiences,
        oneshots,
        contentAreaRef
    } = useSoundFetch()

    async function handleDeleteFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const itemsToDelete = [];

        if (formData.entries().next().done) {
            toast.info('No items selected for deletion');
            return;
        }

        for (let [key, value] of formData.entries()) {
            if (key.startsWith('delete-') && value === 'on') {
                const slug = key.replace('delete-', '');
                itemsToDelete.push(slug);
            }
        }

        if (itemsToDelete.length > 0) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/content`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // credentials: 'include',
                    body: JSON.stringify({ slugs: itemsToDelete })
                });
                if (res.ok) {
                    toast.success('Items deleted successfully');
                    // window.location.reload();
                }
                else {
                    const errorData = await res.json();
                    toast.error('Failed to delete items: ' + errorData.message);
                }
            } catch (error) {
                toast.error('Failed to delete items: ' + error.message);
            }

        }
    }

    const activeFormId = `admin-delete-form-${activeTab}`;

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
                        <Button type="submit" form={activeFormId} variant="outline-danger">Delete</Button>
                        {
                            activeTab === 'scene' ? (
                                <div>
                                    <h2>Scenes</h2>
                                    <AdminSoundList 
                                        type='scene'
                                        items={scenes}
                                        formId='admin-delete-form-scene'
                                        deleteFormSubmitHandler={handleDeleteFormSubmit}
                                    />
                                </div>
                            ) : activeTab === 'ambience' ? (
                                <div>
                                    <h2>Ambiences</h2>
                                    <AdminSoundList 
                                        type='ambience'
                                        items={ambiences}
                                        formId='admin-delete-form-ambience'
                                        deleteFormSubmitHandler={handleDeleteFormSubmit}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2>One-Shots</h2>
                                    <AdminSoundList 
                                        type='oneshot'
                                        items={oneshots}
                                        formId='admin-delete-form-oneshot'
                                        deleteFormSubmitHandler={handleDeleteFormSubmit}
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