/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function HandleUpload(req, res, next) {
  try {
    console.log(req.body.FileName);
    console.log(req.files);
  } catch (error) {
    next(error);
  }
}
