import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ commentText: "", id: null });
  const { authState } = useContext(AuthContext);
  const [updatePostText, setupdatePostText] = useState("");

  let history = useHistory();

  useEffect(() => {
    //`https://git.heroku.com/groupomania-git504.git/posts/byId/${id}`
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    //`https://git.heroku.com/groupomania-git504.git/comments/${id}`
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        //"https://git.heroku.com/groupomania-git504.git/comments"
        "http://localhost:3001/comments",
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
          console.log(response.data);
          const commentToAdd = {
            ...response.data,
          };
          setComments([...comments, commentToAdd]);
          setNewComment({ commentText: "", id: null });
        }
      });
  };

  const deleteComment = (id) => {
    axios
      //`https://git.heroku.com/groupomania-git504.git/comments/${id}`
      .delete(`http://localhost:3001/comments/${id}`, {
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
      //`https://git.heroku.com/groupomania-git504.git/posts/${id}`
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        //"https://git.heroku.com/groupomania-git504.git/posts/title"
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        //"https://git.heroku.com/groupomania-git504.git/posts/postText"
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            // onClick={() => {
            //   if (authState.username === postObject.username) {
            //     editPost("title");
            //   }
            // }}
          >
            {postObject.title}
          </div>
          <div className="body">{postObject.postText}</div>
          <button
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            ♻️ editPost
          </button>
          <input
            type="text"
            value={updatePostText}
            onChange={(e) => {
              setupdatePostText(e.target.value);
            }}
            placeholder="*** recycle da post ***"
          />

          <div className="footer">
            from {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                {" "}
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Say something..."
            autoComplete="off"
            value={newComment.commentText}
            onChange={(event) => {
              setNewComment({ commentText: event.target.value, id: null });
            }}
          />
          <button onClick={addComment}>comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <h4>{comment.commentBody}</h4>

                <label>
                  ⏩ <strong>{comment.username}</strong> commented on your post
                </label>
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
