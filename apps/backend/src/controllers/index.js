import Login from './auth/Login.js';
import Logout from './auth/Logout.js';
import Register from './auth/Register.js';
import Refresh from './auth/Refresh.js';

import GetAll from './content/GetAll.js';
import GetSound from './content/GetSound.js';
import GetThumbnail from './content/GetThumb.js';
import GetSoundData from './content/GetSoundData.js';

import UploadSingle from './upload/UploadSingle.js';
import UploadArchive from './upload/UploadArchive.js';
import ConfirmEmailReceive from './mail/ConfirmEmailReceive.js';
import ConfirmEmailResend from './mail/ConfirmEmailResend.js';

import CheckHealth from './health/CheckHealth.js';

export const AuthControllers = { Login, Logout, Register, Refresh };
export const ContentControllers = { GetAll, GetSound, GetThumbnail, GetSoundData };
export const UploadControllers = { UploadSingle, UploadArchive };
export const MailControllers = { ConfirmEmailReceive, ConfirmEmailResend };
export const HealthControllers = { CheckHealth };
