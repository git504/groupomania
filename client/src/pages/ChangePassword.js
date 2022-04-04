import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let { id } = useParams();

  const changePassword = () => {
    axios
      .put(
        `https://git.heroku.com/groupomania-git504.git/changepassword/${id}`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("it's done !");
        }
      });
  };

  return (
    <div className="changePW">
      <h1>Edit password</h1>
      <div>
        <input
          className="password"
          type="text"
          placeholder="Actual"
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
        />
        <input
          className="password"
          type="text"
          placeholder="new password"
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
      </div>
      <button onClick={changePassword}>🔑 Save Changes</button>
    </div>
  );
}

export default ChangePassword;
