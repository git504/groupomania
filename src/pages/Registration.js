import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
    role: "visitor",
  };

  const [infos, setInfos] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios
      .post("https://git.heroku.com/groupomania-git504.git/auth", data)
      .then((res) => {
        console.log(res);
        setInfos(res.data.msg);
        // ("It's done " + res.data.msg + "👌");
      })
      .catch((err) => {
        //console.log(err.response.data.msg);
        setInfos(err.response.data.msg);
      });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username</label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            // id="inputCreatePost"
            name="username"
            placeholder="👤Mouche Farouche"
          />

          <label>Password</label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            // id="inputCreatePost"
            name="password"
            placeholder="🔐️ 3615 code qui n'en veut"
          />

          <button type="submit">SignIn</button>
        </Form>
      </Formik>
      <div>{infos}</div>
    </>
  );
}

export default Registration;
