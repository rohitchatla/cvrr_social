import Post from "../models/post.model";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import util from "util";

const create = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;

    //console.log(fields);

    if (fields.videourl != "") {
      post.video.contentType = "video/*";
      post.video.path = fields.videourl;
    }

    if (fields.videourl != "") {
      post.video.contentType = "video/*";
      post.video.path = fields.videourl;
    }

    if (fields.photostring != "undefined" && fields.photostring != undefined) {
      //sharing can also be done by sending postid then in backend retrieving data but here reusing create_new route, by passing req data
      //1: string undefined,2: doesn't exists undefined
      let photoobj = JSON.parse(fields.photostring);
      if (photoobj.path) {
        post.photo.data = fs.readFileSync(photoobj.path);
        post.photo.contentType = photoobj.contentType;
        post.photo.path = photoobj.path;
      }
    }

    if (fields.shared) {
      post.shared = fields.shared;
    } else {
      post.shared = fields.shared;
    }
    //console.log(photoobj.path);
    // console.log(
    //   util.inspect(fields.photopath, { showHidden: false, depth: null })
    // );
    // console.log(
    //   util.inspect(fields.phototype, { showHidden: false, depth: null })
    // );

    // if (fields.photopath) {
    //   post.photo.data = fs.readFileSync(fields.photopath);
    //   post.photo.contentType = fields.phototype;
    //   post.photo.path = fields.photopath;
    // }
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
      post.photo.path = files.photo.path;
    }
    try {
      let result = await post.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const postByID = async (req, res, next, id) => {
  try {
    let post = await Post.findById(id).populate("postedBy", "_id name").exec();
    if (!post)
      return res.status("400").json({
        error: "Post not found",
      });
    req.post = post;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve use post",
    });
  }
};

const listByUser = async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listNewsFeed = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  let post = req.post;
  try {
    let deletedPost = await post.remove();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const edit = async (req, res) => {
  let post = req.post;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { text: req.body.text },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const editcomment = async (req, res) => {
  let post = req.post;
  //console.log(req.body.comment);
  try {
    // let result = await Post.findByIdAndUpdate(
    //   req.body.postId,
    //   { $push: { comments: { _id: comment._id } } },
    //   { new: true }
    // )

    // let result = Post.find({ _id: req.body.postId }).forEach(function (doc) {
    //   doc.comments.forEach(function (c) {
    //     if (c._id === req.body.comment._id) {
    //       c.text = req.body.text;
    //     }
    //   });
    //   Post.save(result);
    // });

    return Post.findById(req.body.postId, (err, post) => {
      console.log(req.body.text);
      const { comments } = post;
      const theComment = comments.find((comment) =>
        comment._id.equals(req.body.comment._id)
      );

      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return post.save((error) => {
        if (error) return res.status(500).send(error);
        return res.status(200).send(post);
      });
    });

    // .populate("comments.postedBy", "_id name")
    // .populate("postedBy", "_id name")
    // .exec();
    //res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const like = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const unlike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const uncomment = async (req, res) => {
  let comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster,
  edit,
  editcomment,
};
