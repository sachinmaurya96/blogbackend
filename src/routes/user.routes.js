import express from 'express';
import { logOut, login, register } from '../controler/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  register
);
router.route("/login").post(login)
router.route("/logout").post(verifyJwt,logOut)

export default router;
