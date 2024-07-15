import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Input,
  IconButton,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../../public/css/form/style.css";

export const SignUp = () => {
  const navigate = useNavigate();

  const [signupValues, setSignupValues] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const signupFileField = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupValues({ ...signupValues, [name]: value });

    // Validate input on change
    validateField(name, value);
  };

  const handleSignupFile = (e) => {
    const file = e.target.files[0];
    setSignupValues({ ...signupValues, profilePicture: file });
    setSelectedFileName(file ? file.name : ""); // Set selected file name
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      setLoading(true); // Show spinner

      const formData = new FormData();
      formData.append("name", signupValues.name);
      formData.append("email", signupValues.email);
      formData.append("password", signupValues.password);
      if (signupValues.profilePicture) {
        formData.append("profilePicture", signupValues.profilePicture);
      }

      try {
        await axios.post("http://localhost:8000/api/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Signup Successful");
        navigate("/login");
      } catch (error) {
        console.error(
          "Error",
          error.response ? error.response.data : error.message
        );
        setError("Failed to create account. Please try again.");
      }

      setLoading(false); // Hide spinner

      setSignupValues({
        name: "",
        email: "",
        password: "",
        profilePicture: null,
      });
      signupFileField.current.value = "";
      setSelectedFileName("");
    } else {
      console.log("Form is invalid. Please check the fields.");
    }
  };

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        errorMessage = value.trim().length === 0 ? "Name is required" : "";
        break;
      case "email":
        errorMessage = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "password":
        errorMessage =
          value.length < 6 ? "Password must be at least 6 characters long" : "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));

    return errorMessage === "";
  };

  const validateForm = () => {
    const { name, email, password } = signupValues;

    const nameValid = validateField("name", name);
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);

    return nameValid && emailValid && passwordValid;
  };

  return (
    <div className="h-screen">
      <Backdrop open={loading} style={{ zIndex: 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <form className="form" onSubmit={handleSignupSubmit}>
        <h2>Create Account</h2>
        <FormControl fullWidth margin="normal">
          <TextField
            id="signupName"
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
            value={signupValues.name}
            onChange={handleSignupChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)} // Add onBlur event
            required
            error={errors.name.length > 0}
            helperText={errors.name}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            id="signupEmail"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={signupValues.email}
            onChange={handleSignupChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)} // Add onBlur event
            required
            error={errors.email.length > 0}
            helperText={errors.email}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            id="signupPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            value={signupValues.password}
            onChange={handleSignupChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)} // Add onBlur event
            required
            error={errors.password.length > 0}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Input
            id="signupProfilePicture"
            name="profilePicture"
            type="file"
            inputRef={signupFileField}
            onChange={handleSignupFile}
            style={{ display: "none" }} // Hide the file input
          />
          <label htmlFor="signupProfilePicture">
            <Button variant="outlined" component="span" fullWidth>
              {selectedFileName || "Choose File"}
            </Button>
          </label>
        </FormControl>
        {error && (
          <Typography variant="body1" color="error" className="mt-2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Typography variant="body1" className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </form>
    </div>
  );
};
