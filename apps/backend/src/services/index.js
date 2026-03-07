import Login from './auth/Login.js';
import Register from './auth/Register.js';
import Refresh from './auth/Refresh.js';
import Logout from './auth/Logout.js';

import { contentService } from './contentService.js';
import { uploadService } from './uploadService.js';
import { mailService } from './mailService.js';

export { contentService, uploadService, mailService };
export const AuthService = { Register, Login, Refresh, Logout };
