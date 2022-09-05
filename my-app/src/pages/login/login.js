import React, { useState, useEffect } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

const Login = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const address = localStorage.getItem("wallet");
    console.log(address)
    setName(address);
  }, []);

  const genrateNewWallet = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/register");
    if (response.data.success) {
      const { user } = response.data;
      localStorage.setItem("privatekey", user.privateKey);
      localStorage.setItem("publicKey", user.publicKey);
      localStorage.setItem("wallet", user.wallet);
      localStorage.setItem("walletKey", user.walletKey);
    } else {
      alert("Something went wrong");
    }
    console.log(response);
  };

  return (
    <div className="container w-25 mt-4">
      <div className="logo">
        <p>Logo</p>
      </div>
      <h1 className="login-h1">Enter to account</h1>
      <form method="post">
        <div className="form-group">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="private key"
            required
            className="form-control form-input"
            defaultValue={name}
          />
        </div>
        <div className="form-group">
          <input
            onChange={(e) => setRoom(e.target.value)}
            type="text"
            placeholder="Room"
            required
            className="form-control form-input"
          />
        </div>
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
          style={{ marginRight: "10px" }}
        >
          <input type="submit" className="form-submit" value="Log In" />
        </Link>

        <Link onClick={(e) => genrateNewWallet(e)} to="/">
          <input type="submit" className="form-submit" value="Generate Wallet" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
