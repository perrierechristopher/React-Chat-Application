import React from "react";
import {auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

const SendMessage = ({scroll}) => {

    
    const [message, setMessage] = useState("")

    const sendMessage = async (event) => {
        event.preventDefault();
        if(message.trim() === ""){
            alert("Enter valid message");
            return;
        }
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "messages"), {
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            uid
        });
        setMessage("");
        scroll.current.scrollIntoView({ behavior: "smooth"})
    };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <input
        value = {message}
        onChange={(e)=>setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};



export default SendMessage;