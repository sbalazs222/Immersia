import { uploadService } from '../services/uploadService.js';

/**
 * Handles uploads of new audio files
 * @description
 * Takes title, type and files in request body, then processess them
 * * @param {import('express').Request} req Express Request object containing files and data
 * @param {import('express').Response} res Express Response object
 * @param {import('express').NextFunction} next Express next function for error handling.
 * * @returns {Promise<void>} Returns a 201 JSON response on success.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function HandleUpload(req, res, next) {
  try {
    const result = await uploadService.uploadHandler(req.files, req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles mass upload of new audio files
 * @description
 * Takes archived directori with thumbnails, sounds and metadata and uploads all to database and filestore
 * * @param {import('express').Request} req Express Request object containing files and data
 * @param {import('express').Response} res Express Response object
 * @param {import('express').NextFunction} next Express next function for error handling.
 * * @returns {Promise<void>} Returns a 201 JSON response on success.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function HandleMassUpload(req, res, next) {
  try {
    const result = await uploadService.massUploadHandler(req.file.path);
    return res.status(200).json({ message: 'Bulk upload successful', count: result.count });
  } catch (error) {
    next(error);
  }
}
