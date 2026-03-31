import '../styles/App.css'
import { useSoundFetch } from './soundboard/hooks/useSoundFetch'
import { useSearch } from './soundboard/hooks/useSearch';
import { API_BASE_URL } from './soundboard/utils/constants'
import { AdminSoundList } from '../components/AdminSoundList';
import { Button, Form } from 'react-bootstrap';
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

    const {
        searchTerm,
        searchResults,
        searchType,
        setSearchType,
        isSearching,
        handleInputChange
    } = useSearch()

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
                const res = await fetch(`${API_BASE_URL}/content`, {
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
            <div className='soundboard-dsgn'>
                <div className='soundboard-section d-flex flex-column' style={{ height: '100%' }}>
                    <h2 className='mb-4 fw-bold'>Admin Page</h2>
                    <div className='tabs-dsgn pb-0 mb-4'>
                        <div className='tabs-container'>
                            <button
                                className={activeTab === 'scene' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => { !isSearching && setActiveTab('scene'); !isSearching && setSearchType('scene') }}
                            >
                                Scenes
                            </button>
                            <button
                                className={activeTab === 'ambience' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => { !isSearching && setActiveTab('ambience'); !isSearching && setSearchType('ambience') }}
                            >
                                Ambiences
                            </button>
                            <button
                                className={activeTab === 'oneshot' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => { !isSearching && setActiveTab('oneshot'); !isSearching && setSearchType('oneshot') }}
                            >
                                One-Shots
                            </button>
                        </div>
                        <div className='search-bar-container'>
                            <Form.Control
                                type='text'
                                className='form-control rounded-pill bg-light border-0'
                                placeholder='Search sounds...'
                                value={searchTerm}
                                onChange={(e) => handleInputChange(e)}
                            />
                            <i className='bi bi-search fs-5'></i>
                        </div>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mb-3' style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '12px' }}>
                        <span className='mediumtext m-0 px-3'>This is the admin page. Here you can manage your soundboard content.</span>
                        <Button type="submit" form={activeFormId} variant="outline-danger" className='fw-bold d-flex align-items-center' style={{ borderRadius: '8px', padding: '8px 20px' }}>
                            <i className='bi bi-trash3-fill me-2'></i>Delete
                        </Button>
                    </div>
                    <div className='content-area' ref={contentAreaRef}>
                        {
                            activeTab === 'scene' ? (
                                <div>
                                    <h2>Scenes</h2>
                                    <AdminSoundList
                                        type='scene'
                                        items={scenes}
                                        formId='admin-delete-form-scene'
                                        deleteFormSubmitHandler={handleDeleteFormSubmit}
                                        searchResults={searchType === 'scene' ? searchResults : null}
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
                                        searchResults={searchType === 'ambience' ? searchResults : null}

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
                                        searchResults={searchType === 'oneshot' ? searchResults : null}
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