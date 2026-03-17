import { UploadService } from '../../services/index.js';

export default async function UploadSingle(req, res) {
  await UploadService.UploadSingle(req.files, req.body);
  return res.status(201).json({ mesage: 'SUCCSESS' });
}
