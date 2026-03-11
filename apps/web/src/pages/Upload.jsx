import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'

export default function Upload() {

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
                method: 'POST',
                credentials: 'include',
                contentType: 'multipart/form-data',
                body: formData
            });
            if (res.ok){
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

    return (
        <>
            <h1>Upload page</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type='text' name='Title' />
                </Form.Group>
                <Form.Group controlId="formAudio" className="mb-3">
                    <Form.Label>Choose an audio file to upload - Supported audio formats: .WAW, .MP3, .OGG</Form.Label>
                    <Form.Control type="file" name="SoundFile" accept='audio/waw'/>
                </Form.Group>
                <Form.Group controlId='formImage'>
                    <Form.Label>Image for the effect</Form.Label>
                    <Form.Control type="file" name="ImageFile" accept='image/*'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Effect type</Form.Label>
                    <Form.Select name="Type">
                        <option value="oneshot">One-shot</option>
                        <option value="ambience">Ambience</option>
                        <option value="scene">Scene</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Upload
                </Button>
            </Form>
        </>
    );
}