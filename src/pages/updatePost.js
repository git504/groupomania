import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

function UpdatePost() {
  const [image, setImage] = useState("");
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});

  let history = useHistory();
 

  useEffect(() => {
    axios
      .get(`https://groupomania-git504.herokuapp.com/posts/byId/${id}`)
      .then((response) => {
        //console.log(response.data);
        setPostObject(response.data);
      });
  }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(1).max(33).required("a title is needed 😉"),
    postText: Yup.string().min(1).max(150).required("a post is needed 🔤"),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("postText", data.postText);

    axios
      .put(
        `https://groupomania-git504.herokuapp.com/posts/${id}`,
        formData,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        console.log(response);
        history.push("/");
      });
  };
  return (
    <div className="createPostPage">
      <Formik
        enableReinitialize={true}
       
        onSubmit={onSubmit}
        method="PUT"
        encType="multipart/form-data"
        validationSchema={validationSchema}
      >
        <Form
          className="formContainer"
          method="PUT"
          action="/postimg"
          encType="multipart/form-data"
        >
          {postObject.image !== null && (
            <img
              className="thumbnail"
              src={`https://groupomania-git504.herokuapp.com/${postObject.image}`}
              alt="img from a post"
            />
          )}

          <label>title</label>
          <ErrorMessage name="title" component="span" />
          <Field
            type="text"
            autoComplete="off"
            className="inputCreatePost "
            name="title"
          />
          <label>post</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            as="textarea"
            autoComplete="off"
            className="inputCreatePost textAreaPost"
            name="postText"
            id=""
            cols="30"
            rows="15"
          ></Field>
          <div>
            <label htmlFor="file">📷 da pic</label>
            <input
              id="file"
              className="btn"
              type="file"
              name="image"
              size="lg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="btn" type="submit">
              UPDATE POST
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default UpdatePost;