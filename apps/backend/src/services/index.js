import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Refresh from './auth/Refresh.js';
import Logout from './auth/Logout.js';

import GetSoundBySlug from './content/GetSoundBySlug.js';
import GetSoundsByCategory from './content/GetSoundsByCategory.js';

import UploadSingle from './upload/UploadSingle.js';
import UploadArchive from './upload/UploadArchive.js';

import ConfirmEmailReceive from './mail/ConfirmEmailReceive.js';
import ConfirmEmailSend from './mail/ConfirmEmailSend.js';
import ConfirmEmailResend from './mail/ConfirmEmailResend.js';

export const AuthService = { Register, Login, Refresh, Logout };
export const ContentService = { GetSoundBySlug, GetSoundsByCategory };
export const UploadService = { UploadSingle, UploadArchive };
export const MailService = { ConfirmEmailReceive, ConfirmEmailSend, ConfirmEmailResend };
