import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iprcenter.gov%2Fimage-repository%2Fblank-profile-picture.png%2Fimage_view_fullscreen&psig=AOvVaw24NYm8Awm5AgSLn6Fj-NW0&ust=1711986509286000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKCp0e_snoUDFQAAAAAdAAAAABAE",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
