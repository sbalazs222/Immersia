import { contentService } from '../services/index.js';

/**
 * Handles serving data to frontend
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function for error handling.
 * * @returns {Promise<void>} Returns a 200 JSON response on success.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function ServeData(req, res, next) {
  try {
    const result = await contentService.getSoundsByCategory(
      req.query.c,
      parseInt(req.query.page) || 1,
      parseInt(req.query.limit) || 10
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
/**
 * Handles serving data about a single audio file to frontend
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function for error handling.
 * * @returns {Promise<void>} Returns a 200 JSON response on success, 404 when sound file does not exists.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function GetSoundData(req, res, next) {
  try {
    const result = await contentService.getSoundBySlug(req.params.slug);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
/**
 * Handles providing audio files using nginx
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function for error handling.
 * * @returns {Promise<void>} Returns a 200 JSON response on success, 404 when sound file does not exists.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function PlaySound(req, res, next) {
  try {
    const result = await contentService.getSoundBySlug(req.params.slug);

    res.set('X-Accel-Redirect', '/internal/' + result.sound_file_path);
    res.set('Content-Type', 'audio/mpeg');
    res.end();
  } catch (error) {
    next(error);
  }
}

export async function GetThumbnail(req, res, next) {
  try {
    const result = await contentService.getSoundBySlug(req.params.slug);

    res.set('X-Accel-Redirect', '/internal/' + result.image_file_path);
    res.set('Content-Type', 'image/jpeg');
    res.end();
  } catch (error) {
    next(error);
  }
}
