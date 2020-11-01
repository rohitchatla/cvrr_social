const Router = require("express").Router();
const postSchema = require("../models/post.model");

Router.post("/edit", (req, res, next) => {
  const { postId, text } = req.body;
  console.log(postId);
  postSchema
    .findOne({ _id: postId })
    .then(async (response) => {
      console.log(response);
      res.send(response);
    })
    .catch(next);
});

module.exports = Router;
