import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../store/authcontext";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../../public/css/form/style.css";

export const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });
  };

  const handleInputBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email: loginValues.email,
        password: loginValues.password,
      });
      
      const token = res.data.token;
      localStorage.setItem("token", token);
      dispatch({ type: "LOGIN" });

      navigate("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
    setLoginValues({ email: "", password: "" });
    setTouched({ email: false, password: false });
  };

  const isEmailValid = loginValues.email.length > 0 || !touched.email;
  const isPasswordValid = loginValues.password.length > 0 || !touched.password;

  return (
  <div className="h-screen">
     <form className="form needs-validation" onSubmit={handleLoginSubmit} noValidate>
      <Typography variant="h5">Login Account</Typography>
      <FormControl fullWidth margin="normal">
        <TextField
          id="loginFloatingEmail"
          name="email"
          type="email"
          variant="outlined"
          placeholder="Enter your email"
          value={loginValues.email}
          onChange={handleLoginChange}
          onBlur={handleInputBlur("email")}
          error={!isEmailValid}
          required
          label="Email"
        />
        {!isEmailValid && (
          <FormHelperText error>Please enter a valid email.</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="loginFloatingPassword"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          placeholder="Enter your password"
          value={loginValues.password}
          onChange={handleLoginChange}
          onBlur={handleInputBlur("password")}
          error={!isPasswordValid}
          required
          label="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {!isPasswordValid && (
          <FormHelperText error>Please provide a valid password.</FormHelperText>
        )}
      </FormControl>
      {error && (
        <Typography variant="body1" color="error" className="mt-2">
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
      <Typography variant="body1" className="mt-3">
        Don&#39;t have an account? <Link to="/signup">Create Account</Link>
      </Typography>
    </form>
  </div>
  );
};
