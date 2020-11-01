import React, { useState } from "react";
import auth from "./../auth/auth-helper";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { editcomment, comment, uncomment } from "./api-post.js";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: "96%",
  },
  commentText: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em",
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
  },
  commentEdit: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
  },
}));

export default function Comments(props) {
  const classes = useStyles();
  const [text, setText] = useState("");

  const [ctext, csetText] = useState("");
  const [editinput, seteditinput] = useState(false);

  const jwt = auth.isAuthenticated();
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const handleChangeC = (event) => {
    csetText(event.target.value);
  };
  const addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const editComment = (comment) => (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      editcomment(
        {
          userId: jwt.user._id,
          text: ctext,
        },
        {
          t: jwt.token,
        },
        props.postId,
        comment
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          props.updateComments(data.comments);
          seteditinput(!editinput);
        }
      });
    }
  };

  const showedittext = () => {
    seteditinput(!editinput);
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        {editinput ? (
          <input
            type="text"
            value={ctext}
            onChange={handleChangeC}
            onKeyDown={editComment(item)}
          ></input>
        ) : (
          " "
        )}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <Icon
              onClick={deleteComment(item)}
              className={classes.commentDelete}
            >
              delete
            </Icon>
          )}
          {
            <Icon
              onClick={() => showedittext()}
              className={classes.commentDelete}
            >
              edit
            </Icon>
          }
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={"/api/users/photo/" + auth.isAuthenticated().user._id}
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Write something ..."
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={"/api/users/photo/" + item.postedBy._id}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};
