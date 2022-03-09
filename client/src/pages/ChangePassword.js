import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios
      .put(
        //"https://git.heroku.com/groupomania-git504.git/auth/changepassword"
        "http://localhost:3001/auth/changepassword",
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
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div>
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
