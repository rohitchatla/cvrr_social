import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  video: {
    contentType: String,
    path: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
    path: String,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
  shared: {
    //shared_bol-->for deletion of media purpose(not to delete original video in shared post as video is shared not duplicated(can be duplicated too) in shared post(space complexity))
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Post", PostSchema);
