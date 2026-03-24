import { ApiError } from "../../utils/apiError.js";
import sharp from 'sharp';

export default async function ValidateSingleUpload(req, res, next) {
  const { Title, Type } = req.body;
  const files = req.files;

  if (!files?.ImageFile?.[0]) throw new ApiError(400, 'MISSING_FILES');
  if (!Title || !Type) throw new ApiError(400, 'MISSING_FIELDS');
  if (!['oneshot', 'ambience', 'scene'].includes(Type)) throw new ApiError(400, 'INVALID_TYPE');

  const audioConfigs = Type === 'scene'
    ? [{ file: files?.SoundFileExplore?.[0], prefix: 'explore' }, { file: files?.SoundFileCombat?.[0], prefix: 'combat' }]
    : [{ file: files?.SoundFile?.[0], prefix: '' }];


  if (audioConfigs.some(cfg => !cfg.file)) throw new ApiError(400, 'MISSING_AUDIO_FILES');

  if (Title.length > 24) throw new ApiError(400, 'TITLE_TOO_LONG');

  const imageMeta = await sharp(files.ImageFile[0].path).metadata();
  if (imageMeta.width > 5000 || imageMeta.height > 5000) throw new ApiError(400, 'IMAGE_TOO_LARGE');

  req.imageFile = files.ImageFile[0];
  req.audioConfigs = audioConfigs;
  next();
}