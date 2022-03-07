import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    //`https://git.heroku.com/groupomania-git504.git/auth/basicinfo/${id}`
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    //`https://git.heroku.com/groupomania-git504.git/posts/byuserId/${id}`
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {" "}
        <h1>ACCOUNT DETAILS</h1>
        <h3>Username :{username}</h3>
        <h3>
          Password :
          {authState.username === username && (
            <button
              onClick={() => {
                history.push("/changepassword");
              }}
            >
              {" "}
              🔑 Change My Password
            </button>
          )}
        </h3>
      </div>
      <h3>DELETE ACCOUNT</h3>
      <div className="listOfPosts">
        <h3>History :</h3>
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
