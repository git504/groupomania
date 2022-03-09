import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string().min(1).max(15).required("🙅 please try again"),
  password: Yup.string().min(1).max(150).required("🚫 password is invalid"),
});

const initialValues = {
  username: "",
  password: "",
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const login = () => {
    const data = { username: username, password: password };
    //"https://git.heroku.com/groupomania-git504.git//auth/login"
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      //console.log(response.data.error);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        history.push("/");
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onClick={login}
      validationSchema={validationSchema}
    >
      <Form className="loginContainer">
        <label>Username</label>
        <ErrorMessage name="username" component="span" />
        <Field
          name="username"
          type="text"
          placeholder="👤user"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label>Password</label>
        <ErrorMessage name="password" component="span" />
        <Field
          name="password"
          type="password"
          placeholder="🔐️*******"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button type="submit" onClick={login}> Login </button>
      </Form>
    </Formik>
  );
}

export default Login;
