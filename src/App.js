import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAVXmjFZwKs4oe7EtuVE9Qr5i-zlWsOuio",
  authDomain: "super-chates.firebaseapp.com",
  projectId: "super-chates",
  storageBucket: "super-chates.appspot.com",
  messagingSenderId: "842650336775",
  appId: "1:842650336775:web:9855adbfa3333f5736f4a2",
  measurementId: "G-R2LX3T72F8",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <div className="fixed z-10 top-0 navbar bg-base-100">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <h1 className="btn btn-ghost normal-case text-2xl">Chat App</h1>
        </div>
        <div className="navbar-end">
          <SignOut />
        </div>
      </div>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="mt-20 ml-10">
      <button className="btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button onClick={() => auth.signOut()} className="btn btn-ghost">
        Logout
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log(formValue);

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavoir: "smooth" });
  };

  return (
    <div className="flex flex-col items-end">
      <main className="my-16 w-full">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form
        onSubmit={sendMessage}
        className="flex space-x-2 mx-2 fixed z-10 bottom-5 justify-center w-full"
      >
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs overflow-auto"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return (
    <div className={`message ${messageClass} p-4`}>
      <img src={photoURL} alt="porfile" className="w-10 h-10 rounded-full" />
      <p className="chat-bubble mx-2 max-w-xl overflow-auto">{text}</p>
    </div>
  );
}

console.log();

export default App;
