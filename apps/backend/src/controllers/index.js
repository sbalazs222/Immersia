import Login from './auth/Login.js';
import Logout from './auth/Logout.js';
import Register from './auth/Register.js';
import Me from './auth/Me.js'

import GetAll from './content/GetAll.js';
import GetSound from './content/GetSound.js';
import GetThumbnail from './content/GetThumb.js';
import GetSoundData from './content/GetSoundData.js';

import UploadSingle from './upload/UploadSingle.js';
import UploadArchive from './upload/UploadArchive.js';
import ConfirmEmailReceive from './mail/ConfirmEmailReceive.js';
import ConfirmEmailResend from './mail/ConfirmEmailResend.js';
import ResetPasswordReceive from './mail/ResetPasswordReceive.js';
import ResetPasswordSend from './mail/ResetPasswordSend.js';

import CheckHealth from './health/CheckHealth.js';

import AddRemoveFavourite from './favourites/AddRemoveFavourite.js';
import GetFavourites from './favourites/GetFavourites.js';

export const AuthControllers = { Login, Logout, Register, Me};
export const ContentControllers = { GetAll, GetSound, GetThumbnail, GetSoundData };
export const UploadControllers = { UploadSingle, UploadArchive };
export const MailControllers = { ConfirmEmailReceive, ConfirmEmailResend, ResetPasswordReceive, ResetPasswordSend };
export const HealthControllers = { CheckHealth };
export const FavouriteControllers = { AddRemoveFavourite, GetFavourites };
