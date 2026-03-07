import { UploadService } from '../../services/index.js';

export default async function UploadArchive(req, res, next) {
  try {
    await UploadService.UploadArchive(req.file.path);
    return res.status(200).json({ message: 'SUCCESS' });
  } catch (error) {
    next(error);
  }
}
