import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import '../styles/App.css'

export default function Upload() {

    const [uploadType, setUploadType] = useState("oneshot");
    const [activeTab, setActiveTab] = useState("single");

    async function handleSubmitSingle(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (formData.get("Title").length > 24) {
            toast.error("Title must be 24 characters or less.");
            return;
        }
        try {
            const res = await fetch(`https://immersia.techtrove.cc/api/upload/sound`, {
                method: 'POST',
                contentType: 'multipart/form-data',
                body: formData
            });
            if (res.ok) {
                toast.success("Upload successful!");
            }
            else {
                toast.error("Upload failed - " + await res.json().message);
            }
        }
        catch (err) {
            toast.error("An error occurred during upload.");
        }
    }

    const handleSubmitArchive = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await fetch(`https://immersia.techtrove.cc/api/upload/archive`, {
                method: 'POST',
                contentType: 'multipart/form-data',
                body: formData
            });
            if (res.ok) {
                toast.success("Archive upload successful!");
            }
            else {
                toast.error("Archive upload failed - " + await res.json().message);
            }
        }
        catch (err) {
            toast.error("An error occurred during archive upload.");
        }
    }

    return (
        <>
            <div className='soundboard-dsgn d-flex align-items-center pt-5 mt-5'>
                <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none', width: '100%', minHeight: '660px' }}>

                    <div className='d-flex justify-content-center mb-4'>
                        <div className='tabs-container'>
                            <button type="button" className={activeTab === 'single' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setActiveTab('single')}
                            >
                                Single
                            </button>
                            <button type="button" className={activeTab === 'bulk' ? 'tab-btn active' : 'tab-btn'}
                                onClick={() => setActiveTab('bulk')}
                            >
                                Bulk (zip)
                            </button>
                        </div>
                    </div>

                    {activeTab === 'single' && (
                        <div>
                            <h2 className="mb-4 fw-bold text-center">Upload page</h2>
                            <Form onSubmit={handleSubmitSingle}>
                                <Form.Group>
                                    <Form.Label className='mediumtext'>Title - max length: 24 characters</Form.Label>
                                    <Form.Control type='text' name='Title' />
                                </Form.Group>
                                {
                                    uploadType !== "scene" ? (
                                        <Form.Group controlId="formAudio" className="mb-3">
                                            <Form.Label className='mediumtext'>Supported audio formats: .WAW, .MP3, .OGG</Form.Label>
                                            <Form.Control type="file" name="SoundFile" accept='.mp3, .ogg, .waw' />
                                        </Form.Group>
                                    ) : (
                                        <Form.Group controlId="formAudio" className="mb-3">
                                            <Form.Label className='mediumtext'>Explore Audio</Form.Label>
                                            <Form.Control type="file" name="SoundFileExplore" accept='.mp3, .ogg, .waw' />
                                            <Form.Label className='mediumtext'>Combat Audio</Form.Label>
                                            <Form.Control type="file" name="SoundFileCombat" accept='.mp3, .ogg, .waw' />
                                        </Form.Group>
                                    )
                                }

                                <Form.Group controlId='formImage'>
                                    <Form.Label className='mediumtext'>Image for the effect</Form.Label>
                                    <Form.Control type="file" name="ImageFile" accept='image/*' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className='mediumtext'>Effect type</Form.Label>
                                    <Form.Select name="Type" onChange={(e) => setUploadType(e.target.value)}>
                                        <option value="oneshot">One-shot</option>
                                        <option value="ambience">Ambience</option>
                                        <option value="scene">Scene</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="dark" type="submit" className="w-100" style={{ backgroundColor: "#333333", border: "none", padding: "10px", marginTop: "15px" }}>
                                    Upload
                                </Button>
                            </Form>
                        </div>
                    )}

                    {activeTab === 'bulk' && (
                        <div>
                            <Form onSubmit={handleSubmitArchive}>
                                <h2 className='mb-4 fw-bold text-center'>Bulk Upload (Zip Archive)</h2>
                                <Form.Group controlId="formArchive" className="mb-3">
                                    <Form.Label className='mediumtext'>Upload a zip file containing multiple sounds. The zip should have a specific structure. Refer to the documentation for details.</Form.Label>
                                    <Form.Control type="file" name="Archive" accept='.zip' />
                                </Form.Group>
                                <Button variant="dark" type='submit' className="w-100" style={{ backgroundColor: "#333333", border: "none", padding: "10px", marginTop: "15px" }}>
                                    Upload Archive
                                </Button>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
