import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Refresh from './auth/Refresh.js';
import Logout from './auth/Logout.js';

import GetSoundBySlug from './content/GetSoundBySlug.js';
import GetSoundsByCategory from './content/GetSoundsByCategory.js';

import { uploadService } from './uploadService.js';
import { mailService } from './mailService.js';

export { uploadService, mailService };
export const AuthService = { Register, Login, Refresh, Logout };
export const ContentService = { GetSoundBySlug, GetSoundsByCategory };
