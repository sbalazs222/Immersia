import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Refresh from './auth/Refresh.js';
import Logout from './auth/Logout.js';

import GetSoundBySlug from './content/GetSoundBySlug.js';
import GetSoundsByCategory from './content/GetSoundsByCategory.js';
import DeleteSound from './content/DeleteSound.js';

import UploadSingle from './upload/UploadSingle.js';
import UploadArchive from './upload/UploadArchive.js';

import ConfirmEmailReceive from './mail/ConfirmEmailReceive.js';
import ConfirmEmailSend from './mail/ConfirmEmailSend.js';
import ConfirmEmailResend from './mail/ConfirmEmailResend.js';
import ResetPasswordReceive from './mail/ResetPasswordReceive.js';
import ResetPasswordSend from './mail/ResetPasswordSend.js';

import AddRemoveFavourite from './favourites/AddRemoveFavourite.js';
import GetFavourites from './favourites/GetFavourites.js';

export const AuthService = { Register, Login, Refresh, Logout };
export const ContentService = { GetSoundBySlug, GetSoundsByCategory, DeleteSound };
export const UploadService = { UploadSingle, UploadArchive };
export const MailService = { ConfirmEmailReceive, ConfirmEmailSend, ConfirmEmailResend, ResetPasswordReceive, ResetPasswordSend };
export const FavouriteService = { AddRemoveFavourite, GetFavourites };
