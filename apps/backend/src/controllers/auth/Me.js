export default function Me(req, res) {
  return res.status(200).json({ message: 'SUCCESS', data: { role: req.user.role } });
}