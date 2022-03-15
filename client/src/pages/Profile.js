import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
// import { role } from "./Login";

function Profile() {
  let { id } = useParams();
  //alert(id);
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);
  const [profileRole, setProfileRole] = useState("visitor");

  const adminRole = authState.role === "admin";
  // console.log(adminRole);

  const deleteUser = () => {
    axios
      //"https://git.heroku.com/groupomania-git504.git/posts"
      .delete(`http://localhost:3001/auth/deleteuser/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response);
        setAuthState({ username: "", id: 0, role: "", status: false });
        //alert(authState.status);
        history.push("/");
      });
  };

  useEffect(() => {
    //`https://git.heroku.com/groupomania-git504.git/auth/basicinfo/${id}`
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
      setProfileRole(response.data.role);
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
        <h1 className="accountInfoTitle">ACCOUNT DETAILS</h1>
        <h5>PROFILE ACCOUNT : {username}</h5>
        <h5>ROLE :{profileRole}</h5>
        <div className="accountInfo">
          <h4>Change my password</h4>
          {authState.username === username || adminRole === true ? (
            <button
              className="smallBtn"
              onClick={() => {
                history.push("/changepassword");
              }}
            >
              {" "}
              🔑
            </button>
          ) : (
            ""
          )}
          <h4>Delete my account</h4>
          {authState.username === username || adminRole === true ? (
            <button className="smallBtn" onClick={deleteUser}>
              🗑
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="listOfPosts">
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
                <p>{value.postText}</p>
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
