const sharp = require('sharp');
const path = require('path');
const fse = require('fs-extra');

module.exports = async ({ item, tempDir, slug, index }) => {
  const { Title, Type, ImageFile } = item;
  const ErrorList = [];

  if (!slug) ErrorList.push('Error while creating slug, potentially empty title.')

  if (!Title) ErrorList.push('No title');
  if (Title && Title.length > 24) ErrorList.push('Title too long');

  if (!Type) ErrorList.push('No type');
  if (Type && !['scene', 'ambience', 'oneshot'].includes(Type)) ErrorList.push('Invalid type');

  if (!ImageFile) {
    ErrorList.push('Invalid or missing image');
  } else {
    try {
      const sourceImagePath = path.join(tempDir, ImageFile);
      const imageMeta = await sharp(sourceImagePath).metadata();
      if (imageMeta.width > 5000 || imageMeta.height > 5000) ErrorList.push('Image size too large (max 1500x1500)');
    } catch (error) {
      ErrorList.push('Could not read image metadata');
    }
  }

  const audioConfigs = Type === 'scene'
    ? [
      { fileName: item.SoundFileExplore, prefix: 'explore' },
      { fileName: item.SoundFileCombat, prefix: 'combat' }
    ]
    : [
      { fileName: item.SoundFile, suffix: '' }
    ];
  console.log(audioConfigs)
  if (audioConfigs.some(cfg => !cfg.fileName) || audioConfigs.some(cfg => cfg.fileName == undefined)) {
    ErrorList.push('Missing one or more sound files');
  }

  audioConfigs.forEach(element => {
    try {
      const sourceAudioPath = path.join(tempDir, element.fileName);
      if (!fse.pathExistsSync(sourceAudioPath)) {
        ErrorList.push(`Missing file: ${element.fileName}`)
      }
    } catch (error) {
      ErrorList.push('Missing one or more sound files')
    }
  })

  if (ErrorList.length > 0) {
    return {
      errors: { index, title: Title, type: Type, errors: ErrorList }
    };
  }

  const createdFiles = [];
  const dbAudioPaths = [];

  const finalImageName = `${Type}-${slug}.webp`;
  const destImage = `/immersia_data/thumb/${finalImageName}`;
  const sourceImagePath = path.join(tempDir, ImageFile);

  await sharp(sourceImagePath).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(destImage);
  createdFiles.push(destImage);


  for (const cfg of audioConfigs) {
    if (!cfg.fileName) continue;

    const sourceAudioPath = path.join(tempDir, cfg.fileName);
    const ext = path.extname(cfg.fileName).toLowerCase();

    const statePrefix = cfg.prefix ? `${cfg.prefix}-` : '';
    const finalAudioName = `${Type}-${statePrefix}${slug}${ext}`;
    const destAudio = `/immersia_data/sounds/${finalAudioName}`;

    await fse.move(sourceAudioPath, destAudio);

    createdFiles.push(destAudio);
    dbAudioPaths.push(`sounds/${finalAudioName}`);
  }

  return {
    dbRow: {
      slug: slug,
      title: Title,
      type: Type,
      sound_file_path: dbAudioPaths[0],
      sound_file_path_alt: dbAudioPaths[1] || null,
      image_file_path: `thumb/${finalImageName}`,
    },
    files: createdFiles,
  };
};
