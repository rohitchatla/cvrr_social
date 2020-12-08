import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "./api-post.js";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideoCamera from "@material-ui/icons/VideoCall";
import firebase from "./firebase";
import uuid from "react-uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#efefef",
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(65, 150, 136, 0.09)",
    boxShadow: "none",
  },
  cardContent: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: "none",
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: "90%",
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: "super",
  },
}));

export default function NewPost(props) {
  const classes = useStyles();
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
    user: {},
    video: "",
  });
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);
  const clickPost = () => {
    const storage = firebase.storage();
    let videourl = "";
    var storageRef = storage.ref(`/cvrrsocial/${values.video.name + uuid()}`); //uuid()
    //var storageRef = storage.ref( `/cvrrsocial/${jwt.user._id}/${values.video.name + uuid()}`);
    //console.log(values.video);
    storageRef.put(values.video).then(function (snapshot) {
      snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("File available at", downloadURL);
        videourl = downloadURL;
        // var videostring = JSON.stringify({
        //   path: downloadURL,
        //   contentType: values.video.contentType,
        // });
        let postData = new FormData();
        postData.append("text", values.text);
        postData.append("photo", values.photo);
        postData.append("videourl", videourl);
        //postData.append("videostring", videostring);
        create(
          {
            userId: jwt.user._id,
          },
          {
            t: jwt.token,
          },
          postData
        ).then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error });
          } else {
            setValues({ ...values, text: "", photo: "", video: "" });
            props.addUpdate(data);
          }
        });
      });
    });

    // storage
    //   .ref(`/cvrrsocial/${values.video.name}`)
    //   .getDownloadURL()
    //   .then((url) => {
    //     console.log("Got download url: ", url);
    //   });
  };
  const handleChange = (name) => (event) => {
    const value =
      name === "photo" || name === "video"
        ? event.target.files[0]
        : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const photoURL = values.user._id
    ? "/api/users/photo/" + values.user._id
    : "/api/users/defaultphoto";
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder="Share your thoughts ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange("text")}
            className={classes.textField}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange("photo")}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <input
            accept="video/*"
            onChange={handleChange("video")}
            className={classes.input}
            id="icon-button-video"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              className={classes.photoButton}
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>{" "}
          <label htmlFor="icon-button-video">
            <IconButton
              color="secondary"
              className={classes.photoButton}
              component="span"
            >
              <VideoCamera />
            </IconButton>
          </label>{" "}
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}
            {values.video ? values.video.name : ""}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === ""}
            onClick={clickPost}
            className={classes.submit}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

NewPost.propTypes = {
  addUpdate: PropTypes.func.isRequired,
};
