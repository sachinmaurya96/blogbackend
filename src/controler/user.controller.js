import { ApiError, ApiResponse, AsyncHandler } from '../utils/index.js';
import { User } from '../model/user.model.js';
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'something went wrong when generating jwt token');
  }
};
const register = AsyncHandler(async (req, res) => {
  //get user detail
  //validation - not empty
  //ceck if userc alredy exist : username , email
  //check for image , check avatar
  //upload them to cloudinary, avtar
  //create usr object - create entry in db
  //remove password and refrest toke field from response
  //check for user creation
  //return response
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some((fields) => fields.trim() === '')
  ) {
    throw new ApiError(400, 'all fields are required');
  }
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new ApiError(
      400,
      'user with this email or username is already exist'
    );
  }
  const user = await User.create({
    username,
    email,
    password,
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser) {
    throw new ApiError(500, 'somethig went wrong when registering user');
  }
  return res
    .status(201)
    .json(new ApiResponse(201, 'user registered succesfully',createdUser));
});
export { register };
