import { UploadService } from '../../services/index.js';

export default async function UploadArchive(req, res, next) {
  await UploadService.UploadArchive(req.file.path);
  return res.status(200).json({ message: 'SUCCESS' });
}
