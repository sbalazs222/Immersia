/* eslint-disable no-undef */
const sharp = require('sharp');
const path = require('path');
const musicMetadata = require('music-metadata');
const fse = require('fs-extra');

module.exports = async ({ item, tempDir, slug }) => {
  const { Title, Type, SoundFile, ImageFile } = item;

  const soundPath = path.join(tempDir, SoundFile);
  const imagePath = path.join(tempDir, ImageFile);

  const finalSoundName = `${Type}-${slug}${path.extname(SoundFile)}`;
  const finalImageName = `${Type}-${slug}.webp`;

  // Image Processing
  const destImage = `/immersia_data/thumb/${finalImageName}`;
  await sharp(imagePath).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(destImage);

  // Audio Metadata
  const mm = await musicMetadata.parseFile(soundPath);

  // Move Audio
  const destSound = `/immersia_data/sounds/${finalSoundName}`;
  await fse.move(soundPath, destSound);

  const createdFiles = [destSound, destImage];

  return {
    dbRow: [
      slug,
      Title,
      Type,
      Math.round(mm.format.duration || 0),
      path.extname(SoundFile).slice(1),
      `sounds/${finalSoundName}`,
      `thumb/${finalImageName}`,
    ],
    files: createdFiles,
  };
};
