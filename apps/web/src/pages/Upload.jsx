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
        <div className='soundboard-dsgn d-flex align-items-center justify-content-center'>
            <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none' }}>
            <h1 className="mb-4 fw-bold">Upload page</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formAudio" className="mb-3">
                    <Form.Label>Choose an audio file to upload</Form.Label>
                    <Form.Control type="file" name="file" accept='audio/*'/>
                </Form.Group>
                <Form.Group controlId='formImage'>
                    <Form.Label>Image for the effect</Form.Label>
                    <Form.Control type="file" name="image" accept='image/*'/>
                </Form.Group>
                <Button variant="dark" type="submit" className="w-100" style={{backgroundColor: "#333333", border: "none", padding: "10px", marginTop: "15px"}}>
                    Upload
                </Button>
            </Form>
            </div>
            </div>
        </>
    );
}