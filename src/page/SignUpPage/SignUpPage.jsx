import "./SignUpPage.scss";
import signupPageLogo from "../../assets/signupPage/signupPageLogo.png";
import buildingImage from "../../assets/signupPage/joel-filipe-RFDP7_80v5A-unsplash.jpg";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { addToken } from "../../store/features/loginReducer";
import { useDispatch } from "react-redux";

function SignUpPage() {
  const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  }));

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSignIn = () => {
    alert(`Phone number: ${phoneNumber}\nPassword: ${password}`);
    setPhoneNumber("");
    setPassword("");
  };
const dispatch=useDispatch()
  useEffect(() => {
    dispatch(addToken('your-token-value'));
  }, [])
  
  return (
    <div className="signup-page-container">
      <div className="form-section">
        <p className="top-side-text">teqbae</p>
        <div className="welcome-back-main">
          <div className="welcome-back-form">
            <div className="top-section-of-form">
              <h5>Welcome back</h5>
              <p>Sign into your account</p>
            </div>
            <div className="input-for-signup">
              <FormControl variant="standard" fullWidth>
                <CustomInputLabel shrink htmlFor="phone-number">
                  Phone number
                </CustomInputLabel>
                <Input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  sx={{
                    color: "white",
                    background: "#222222",
                    border: "1px solid #3F3F3F",
                    padding: "3px",
                    borderRadius: "10px",
                    "&:before": { borderBottom: "none" },
                    "&:after": { borderBottom: "none" },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottom: "none",
                    },
                  }}
                  disableUnderline
                  startAdornment={
                    <InputAdornment position="start" sx={{"& .css-18m8r0v":{
                      color:"white"
                    } }}>
                      +91
                    </InputAdornment>
                  }
                />
              </FormControl>

              <div className="forgot-password-with-input">
                <p>Forgot password?</p>
                <FormControl variant="standard" fullWidth>
                  <CustomInputLabel shrink htmlFor="password">
                    Password
                  </CustomInputLabel>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      color: "white",
                      background: "#222222",
                      border: "1px solid #3F3F3F",
                      padding: "3px",
                      borderRadius: "10px",
                      "&:before": { borderBottom: "none" },
                      "&:after": { borderBottom: "none" },
                      "&:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },
                    }}
                    disableUnderline
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{
                            p: 0.5, // Decreased padding
                            m: 1, // Decreased margin
                            width: "30px", // Set fixed width
                            height: "30px", // Set fixed height
                            background: "#423E3D",
                            borderRadius: "5px", // Making it square
                            "&:hover": {
                              background: "#575757", // Background color on hover
                            },
                            "&:active": {
                              background: "#6b6b6b", // Background color on click
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: "18px", // Decrease icon size if needed
                            },
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ color:"#868686"}} />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ color:"#868686"}} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </div>
            <Button
              variant="contained"
              className="sign-in-button"
              onClick={handleSignIn}
            >
              Sign in
            </Button>
            <p className="trouble-in-login">
              Have trouble logging in? <span>Contact support</span>
            </p>
          </div>
        </div>

        <p className="footer-text">
          ©Teqbae Innovations & Solutions (India) Pvt Ltd
        </p>
      </div>
      <div className="image-section">
        <img src={buildingImage} alt="image" width={"100%"} height={"100%"} />
      </div>
    </div>
  );
}

export default SignUpPage;
