import { UploadService } from '../../services/index.js';

export default async function UploadArchive(req, res) {
  const result = await UploadService.UploadArchive(req.file.path);
  if (result.success) {
    return res.status(200).json({ message: 'SUCCESS' });
  } else {
    return res.status(400).json({ message: 'FINISHED_WITH_ERRORS', errors: result.errors });
  }
}
