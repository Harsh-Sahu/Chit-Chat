import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLockOpenAlt } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";




export default function Lock({ currentChat}) {

  const navigate = useNavigate();

  const handleClick = async () => {
    const id =  JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    

    const  {data}  = await axios.post("http://localhost:5000/api/auth/unlock/", {
        from: id,
        to: currentChat._id,
        work : "unlock",
      });
      console.log(data.otp);
    let password = prompt("Enter the OTP sent on your register Email");
    if(+password===data.otp)
    {
      axios.post("http://localhost:5000/api/auth/lock/", {
        from: id,
        to: currentChat._id,
        work : "unlock",
      });
    }
    else{
      alert("wrong otp, Please try again :(");
    }
    
    window.location.reload(true);
  };
  
  return (
    <Button onClick={handleClick}>
      <BiLockOpenAlt />
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
