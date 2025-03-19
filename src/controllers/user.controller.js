import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong! while genrating access and refresh token"
    );
  }
};

/////
//1.)get the data from the browser using req.body which contain all the text data
//2.)checking validation
//3.)check user or email already exits
//4.)check fot images and avatar
//5.)upload them to cloudinary
//6.)add and save in database using collectionName.create()
//7.)remove password and refresh token from respone
//8.)check wheater user is created or not
//9.)return response
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Validate required fields
  if ([username, email, password, fullName].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Ensure files are received
  if (!req.files?.avatar || req.files.avatar.length === 0) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatarLocalPath = path.resolve(req.files.avatar[0].path);
  const coverImageLocalPath = req.files.coverImage?.[0]?.path
    ? path.resolve(req.files.coverImage[0].path)
    : null;

  // Upload avatar to Cloudinary
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  // console.log(avatarUpload);

  if (!avatarUpload || !avatarUpload.url) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  // Upload cover image (optional)
  let coverImageUpload = null;
  if (coverImageLocalPath) {
    // console.log("Uploading Cover Image:", coverImageLocalPath);
    coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatarUpload.url,
    coverImage: coverImageUpload?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

//
//receive input from user i.e email,username,password
// check wheather it`s right or wrong
//find the user
// access and refresh token
//send them a cookie
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new error(401, " Invalid user credentials");
  }
});
export { registerUser };
