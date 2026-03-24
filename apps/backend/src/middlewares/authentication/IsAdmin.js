export default function IsAdmin(req, res, next) {
  if (req.user.role == 0) {
    return res.status(403).json({ message: 'FORBIDDEN' });
  }
  return next();
}