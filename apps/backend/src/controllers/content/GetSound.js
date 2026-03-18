import { ContentService } from '../../services/index.js';

export default async function GetSound(req, res) {
  const result = await ContentService.GetSoundBySlug(req.params.slug);
<<<<<<< Updated upstream
  res.set('X-Accel-Redirect', '/immersia_data/' + result.sound_file_path);
=======
  res.set('X-Accel-Redirect', '/immersia_data/' + state !== '0' ? result.sound_file_path_alt : result.sound_file_path );
>>>>>>> Stashed changes
  res.set('Content-Type', 'audio/mpeg');
  res.end();
}
