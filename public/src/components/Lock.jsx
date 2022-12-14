import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLock } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";



export default function Lock({ currentChat}) {

  const navigate = useNavigate();

  const handleClick = () => {
    const id =  JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
     axios.post("http://localhost:5000/api/auth/lock/", {
      from: id,
      to: currentChat._id,
      work : "lock",
    });
    window.location.reload(true);
  };
  
  return (
    <Button onClick={handleClick}>
      <BiLock />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
