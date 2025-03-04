import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { toast } from "react-toastify";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { data, useNavigate } from "react-router-dom";

function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginForm, setLoginForm] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    function signupWithEmail() {
        setLoading(true);
        // Authenticate the user
        if(name!="" && email!="" && password!="" && confirmPassword!="") {
            if(password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                // Signin
                const user = userCredential.user;
                console.log("User>>>", user);
                toast.success("User Created!");
                setLoading(false);
                setName("");
                setPassword("");
                setEmail("");
                setConfirmPassword("");
                // Create a document with user ID
                createDoc(user);
                navigate("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
            });
        } else {
            toast.error("Passwords do not match");
            setLoading(false);
        }
    } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        setLoading(true);
        // Make sure that the doc with the uid doesn't exist 
        // Create a doc
        if (!user) return;

        const userRef = doc(db, "users",  user.uid);
        const userData = await getDoc(userRef);
        if (!userData.exists()) {
        try {
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName ? user.displayName : name,
                email: user.email,
                photoURL: user.photoURL ? user.photoURL : "",
                createdAt: new Date(),
             });
             toast.success("Doc created!");
             setLoading(false);
        } catch(e) {
            toast.error(e.message);
            setLoading(false);
        } 
    } else {
        // toast.error("Doc already exists");
        setLoading(false);
    }
}

    function loginUsingEmail() {
        setLoading(true);
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                toast.success("Signed in successfully!");
                setLoading(false);
                console.log("Signed in user:", user);
                navigate("/dashboard");
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
        } else {
            toast.error("Please enter both email and password!");
            setLoading(false);
        }
    }

     // Google Sign-In Function
     function googleAuth() {
        setLoading(true);
     try {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use this to access the Google Api
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                 // The signed-in user info.
                const user = result.user;
                toast.success("Signed in with Google!");
                setLoading(false);
                console.log("Google user:", user);
                createDoc(user);
                navigate("/dashboard");
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
     } catch(e) {
        toast.error(e.message);
        setLoading(false);
     }
    }
    return (
        <>
        {loginForm ? (
            <div className="signup-wrapper">
        <h2 className="title">
            Login on <span style={{color: "var(--theme)"}}>Financely.</span>
        </h2>
        <form>
             <Input 
            label={"Email"}
            type={"email"}
            state={email}
            setState={setEmail}
            placeholder={"Your Email"}
            />
            <Input 
            label={"Password"}
            type={"password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
            />
            <Button 
            disabled={loading}
            text={loading ? "Loading..." : "Login Using Email and Password"}
             onClick={loginUsingEmail}/>
            <p style={{textAlign:"center"}}>Or</p>
            <Button 
            onClick={googleAuth}
            text={loading ? "Loading..." : "Login Using Google"}
             blue={true}/>
             <p className="p-login" 
             style={{ cursor: "pointer" }}
             onClick={() => setLoginForm(!loginForm)}>
                Don't have an account? Click Here</p>
        </form>
        </div> 
            ) : (
    <div className="signup-wrapper">
        <h2 className="title">
            Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span>
        </h2>
        <form>
            <Input 
            label={"Full Name"}
            state={name}
            setState={setName}
            placeholder={"Your Name"}
            />
             <Input 
            label={"Email"}
            type={"email"}
            state={email}
            setState={setEmail}
            placeholder={"Your Email"}
            />
            <Input 
            label={"Password"}
            type={"password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
            />
            <Input 
            label={"Confirm Password"}
            type={"password"}
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder={"Confirm Password"}
            />
            <Button 
            disabled={loading}
            text={loading ? "Loading..." : "Signup Using Email and Password"}
             onClick={signupWithEmail}/>
            <p className="p-login">Or</p>
            <Button 
            onClick={googleAuth}
            text={loading ? "Loading..." : "Signup Using Google"}
             blue={true}/>
             <p className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}>
             Already have an account? Click Here</p>
        </form>
        </div>)}
    
        </>
    );
}
export default SignupSigninComponent;