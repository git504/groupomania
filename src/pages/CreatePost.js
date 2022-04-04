import React, { useEffect, useState } from "react";
//useContext,
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
//import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  //const { authState } = useContext(AuthContext);
  const [image, setImage] = useState("");

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
    title: Yup.string().min(1).max(33).required("a title is needed 😉"),
    postText: Yup.string().min(1).max(150).required("a post is needed 🔤"),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(image);
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("postText", data.postText);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    axios
      .post("https://git.heroku.com/groupomania-git504.git/posts", formData, {
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
        method="POST"
        encType="multipart/form-data"
        validationSchema={validationSchema}
      >
        <Form
          className="formContainer"
          method="POST"
          action="/postimg"
          encType="multipart/form-data"
        >
          <label>title</label>
          <ErrorMessage name="title" component="span" />
          <Field
            type="text"
            autoComplete="off"
            className="inputCreatePost "
            name="title"
            placeholder="Insert your title ..."
          />
          <label>post</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            as="textarea"
            autoComplete="off"
            className="inputCreatePost textAreaPost"
            placeholder="📝 Type a message ..."
            name="postText"
            id=""
            cols="30"
            rows="15"
          ></Field>
          <div>
            <label htmlFor="file">📷</label>
            <input
              id="file"
              className="btn"
              type="file"
              name="image"
              size="lg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="btn" type="submit">
              SEND
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
