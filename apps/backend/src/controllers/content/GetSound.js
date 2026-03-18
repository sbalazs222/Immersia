import { ContentService } from '../../services/index.js';

export default async function GetSound(req, res) {
  const state = req.query.state;
  const result = await ContentService.GetSoundBySlug(req.params.slug);
  res.set('X-Accel-Redirect', '/immersia_data/' + (state != '0' ? result.sound_file_path_alt : result.sound_file_path));
  res.set('Content-Type', 'audio/mpeg');
  res.end();
}
