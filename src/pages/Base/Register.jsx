import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; /* input degisdkce state guncellenir */

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post(
        "https://localhost:7112/api/user/registerDefault",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
      }
      console.log("Kayit basarili:", response.data);
      alert("Registration successful!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Registration failed. Please try again."(
          error.response && error.response.data
            ? `: ${error.response.data}`
            : ""
        )
      );
    }
  };

  return (
    <StyledWrapper>
      <div
        className="container d-flex justify-content-center bg-dark "
        style={{ minHeight: "100vh", alignItems: "center" }}
      >
        <form onSubmit={handleSubmit} className="form">
          <p className="title">Register </p>
          <p className="message">Signup now and get full access to our app. </p>
          <div className="flex">
            <label>
              <input
                required
                placeholder
                type="text"
                name="username"
                className="input"
                value={formData.username}
                onChange={handleChange}
              />
              <span>UserName</span>
            </label>
          </div>
          <label>
            <input
              required
              placeholder
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
            <span>Email</span>
          </label>
          <label>
            <input
              required
              placeholder
              type="password"
              className="input"
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <span>Password</span>
          </label>
          <label>
            <input
              required
              placeholder
              type="password"
              className="input"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
            />
            <span>Confirm password</span>
          </label>
          <button className="submit">Submit</button>
          <p className="signin">
            Hesabin var mi ? <NavLink to="/login">Login</NavLink>{" "}
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    position: relative;
  }

  .title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: royalblue;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: royalblue;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message,
  .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: royalblue;
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .form label .input:valid + span {
    color: green;
  }

  .submit {
    border: none;
    outline: none;
    background-color: royalblue;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: 0.3s ease;
  }

  .submit:hover {
    background-color: rgb(56, 90, 194);
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default Register;
