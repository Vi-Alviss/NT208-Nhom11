import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const [step, setStep] = useState(1);
  const [ForgotCode, setForgotCode] = useState("");
  const [Email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="forgotPass">
        <form action="">
          <input type="email" placeholder="type your email" value={Email} />
        </form>
      </div>
    </>
  );
};

export default ForgotPass;
