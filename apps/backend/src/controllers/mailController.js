import { mailService } from '../services/index.js';

export async function VerifyEmail(req, res, next) {
  try {
    const token = req.query.token;
    await mailService.confirmAddressReceiveToken(token);
    return res.status(200).json({ message: 'Successful verification.' });
  } catch (error) {
    next(error);
  }
}

export async function ResendEmail(req, res, next) {
  try {
    const token = req.query.token;
    await mailService.resendConfirmAddressToken(token);
    return res.status(200).json({ message: 'Resent successfully.' });
  } catch (error) {
    next(error);
  }
}
