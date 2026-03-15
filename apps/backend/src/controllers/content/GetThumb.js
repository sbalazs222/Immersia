import { ContentService } from '../../services/index.js';

export default async function GetThumbnail(req, res) {
  const result = await ContentService.GetSoundBySlug(req.params.slug);
  res.set('X-Accel-Redirect', '/internal/' + result.image_file_path);
  res.set('Content-Type', 'image/jpeg');
  res.end();
}
