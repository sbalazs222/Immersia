/* eslint-disable no-undef */
const sharp = require('sharp');
const path = require('path');
const fse = require('fs-extra');

module.exports = async ({ item, tempDir, slug }) => {
  const { Title, Type, SoundFile, ImageFile } = item;

  const audioConfigs = Type === 'scene'
    ? [
      { fileName: item.SoundFileExplore, prefix: 'explore' },
      { fileName: item.SoundFileCombat, prefix: 'combat' }
    ]
    : [
      { fileName: item.SoundFile, suffix: '' }
    ];

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
