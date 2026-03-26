import { UploadService } from '../../services/index.js';

export default async function UploadSingle(req, res) {
  await UploadService.UploadSingle(req.imageFile, req.audioConfigs, req.body);
  return res.status(201).json({ mesage: 'SUCCESS' });
}
