//import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
//import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  //const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        //"https://git.heroku.com/groupomania-git504.git/posts"
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, [history]);

  console.log(listOfPosts);

  const likeAPost = (postId) => {
    axios
      .post(
        //"https://git.heroku.com/groupomania-git504.git/likes"
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        // let date = value.createdAt;
        //console.log(value.image);

        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              <div>
                <img
                  src={`http://localhost:3001/${value.image}`}
                  alt="img from a post"
                />
              </div>
              <p>{value.postText}</p>
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
