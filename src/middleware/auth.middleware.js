import jwt from 'jsonwebtoken';
import { AsyncHandler, ApiError } from '../utils/index.js';
import { User } from '../model/user.model.js';

export const verifyJwt = AsyncHandler(async (req, res, next) => {
  try {
    const accessToken = await req.cookies?.accessToken;
    if (!accessToken) {
      throw new ApiError(401, 'unothorized request');
    }
    const decodedInfo = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedInfo) {
      throw new ApiError(400, 'invalid token');
    }
    const user = await User.findById(decodedInfo._id).select(
      '-password -refreshToken'
    );
    if (!user) {
      throw new ApiError(400, 'invalid accesstoken');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});
