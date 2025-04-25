import React, { useState } from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const NavBar = () => {

//Define the different functions related to the login and logout of the
// different account within the NavBar

  const [user, setUser] = useAuthState(auth);

  //useAuthState gets triggered when user signs in or out
  //allowing us access to the user's details
  //The default value is null, but once the user are logged in
  //the user state changes to the data provided by the auth method


  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider) //Redirect them to Google Sign in page
    //Data is saved in auth
    //If successfully, user is sent to the application 
  };

  const signOut = () => {
    auth.signOut();
    //Clear the auth data to null
  };

  return (
    <nav className="nav-bar">
      <h1>React Chat</h1>
      {user ? (
        <button onClick={signOut} className="sign-out" type="button">
          Sign Out
        </button>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google"
            type="button"
          />
        </button>
      )}
    </nav>
  );
};

export default NavBar;