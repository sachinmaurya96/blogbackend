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
  const avatar = req.files?.avatar[0]?.path;
  const coverImage = req.files?.coverImage[0]?.path;

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar,
    coverImage,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser) {
    throw new ApiError(500, 'somethig went wrong when registering user');
  }
  return res
    .status(201)
    .json(new ApiResponse(201, 'user registered succesfully', createdUser));
});
const login = AsyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!(email || password)) {
    throw new ApiError(400, 'all fields is required');
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(400, 'user with this email or username dos not exist');
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, 'invalid user credentials');
  }
  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
    const option = {
      httpOnly:true,
      secure:true
    }
  res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(new ApiResponse(200, 'user logged in succesfully', {loggedInUser,accessToken,refreshToken}));
});
const logOut = AsyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      accessToken:'',
      refreshToken:""
    },
    {
      new:true
    }
  )
  const option = {
    httpOnly:true,
    secure:true,
  }
  return res
  .status(200)
  .clearCookie("accessToken",option)
  .clearCookie("refreshToken",option)
  .json(new ApiResponse(200,"user loggedout successfully"))
})

export { register, login , logOut};
