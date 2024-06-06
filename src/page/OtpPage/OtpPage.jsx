
import "./OtpPage.scss"
import buildingImage from "../../assets/signupPage/joel-filipe-RFDP7_80v5A-unsplash.jpg";
import OtpInPuts from "../../components/OtpInPuts/OtpInPuts";
import { useState } from "react";
function OtpPage() {
  const [otp, setOtp] = useState('');

  return (
    <div className="otp-page-container">
      <div className="form-section">
        <p className="top-side-text">teqbae</p>
        <div className="welcome-back-main">
          <div className="welcome-back-form">
            <div className="top-section-of-form">
              {/* <h5>Welcome back</h5> */}
              <p>Please enter verification code send to your mobile number <span>+974 8987 999 02</span></p>
            </div>
            <div className="input-for-otp">
              <OtpInPuts setOtp={setOtp} otp={otp} />
            </div>
         
            <p className="trouble-in-login">
            Didn’t receive the code? <span>Resend code</span>
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

export default OtpPage;
