import React, { useEffect } from "react";
//useContext,
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
//import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  //const { authState } = useContext(AuthContext);

  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);


  const validationSchema = Yup.object().shape({
    title: Yup.string().min(1).max(15).required("a title is needed 😉"),
    postText: Yup.string().min(1).max(150).required("a post is needed 🔤"),
  });

  const onSubmit = (data) => {
    axios
      //"https://git.heroku.com/groupomania-git504.git/posts"
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        history.push("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>title</label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="Insert your title ..."
          />
          <label>post</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="📝 Type a message ..."
          />

          <button type="submit">SEND</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
