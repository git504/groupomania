import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  comment: "",
};
const validationSchema = Yup.object().shape({
  comment: Yup.string().min(1).max(150).required("Feel free to chat 💬 "),
});

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ commentText: "", id: null });
  const { authState } = useContext(AuthContext);

  const adminRole = authState.role === "admin";
  // console.log(adminRole);

  let history = useHistory();

  useEffect(() => {
    axios
      .get(`https://git.heroku.com/groupomania-git504.git/posts/byId/${id}`)
      .then((response) => {
        console.log(response.data);
        setPostObject(response.data);
      });
    axios
      .get(`https://git.heroku.com/groupomania-git504.git/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, [id]);

  const addComment = () => {
    const commentToCheck = newComment.commentText;
    //console.log(commentToCheck);
    if (commentToCheck === "") {
      //console.log("nocomment");
    } else {
      axios
        .post(
          "https://git.heroku.com/groupomania-git504.git/comments",
          {
            commentBody: newComment.commentText,
            PostId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            // console.log(response.data);
            const commentToAdd = {
              ...response.data,
            };
            setComments([...comments, commentToAdd]);
            setNewComment({ commentText: "", id: null });
          }
        });
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`https://git.heroku.com/groupomania-git504.git/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`https://git.heroku.com/groupomania-git504.git/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onClick={addComment}
      validationSchema={validationSchema}
    >
      <div className="postPage">
        <div className="leftSide">
          <div className="post postComment" id="individual">
            <div className="title">{postObject.title}</div>

            <div
              className="body"
              onDoubleClick={() => {
                if (
                  authState.username === postObject.username ||
                  adminRole === true
                ) {
                  history.push(`/updatepost/${id}`);
                }
              }}
            >
              {" "}
              <div>
                {postObject.image !== null && (
                  <img
                    className="thumbnail"
                    src={`http://localhost:3001/${postObject.image}`}
                    alt="img from a post"
                  />
                )}
                <p> {postObject.postText}</p>
              </div>
            </div>
            <div className="footer">
              from {postObject.username}
              {authState.username === postObject.username ||
              adminRole === true ? (
                <button
                  className="smallBtn"
                  onClick={() => {
                    deletePost(postObject.id);
                  }}
                >
                  {" "}
                  🗑️
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="rightSide">
          <Form className="addCommentContainer">
            <Field
              as="textarea"
              name="comment"
              type="text"
              placeholder="Say something about this..."
              autoComplete="off"
              cols="30"
              rows="3"
              value={newComment.commentText}
              onChange={(event) => {
                setNewComment({ commentText: event.target.value, id: null });
              }}
            />
            <button type="submit" onClick={addComment}>
              comment
            </button>
          </Form>
          <div className="listOfComments">
            <ErrorMessage
              className="easyComment"
              name="comment"
              component="span"
            />
            {comments.map((comment, key) => {
              return (
                <div key={key} className="comment">
                  <p>{comment.commentBody}</p>

                  <label>
                    ⏩ <strong>{comment.username}</strong> commented on your
                    post
                  </label>
                  {authState.username === comment.username ||
                  adminRole === true ? (
                    <button
                      className="smallBtn"
                      onClick={() => {
                        deleteComment(comment.id);
                      }}
                    >
                      🗑️
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Formik>
  );
}

export default Post;
