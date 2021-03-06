// props have name and user id = turn into buttons that create a user chat
import React from 'react';
import firebase from "firebase/app";
import { useFirestore } from 'react-redux-firebase';

function Contact(props) {
  const firestore = useFirestore()

  const doCreateChat = (id) => {
    const user = firebase.auth().currentUser
    const userVar = [`${user.displayName}`, `${props.name}`]
    const newDataTable = userVar.sort()
    firestore.collection(`${newDataTable}`).add({
      type: "initial",
      description: `${user.displayName} started the chat with ${props.name}`
    });
    props.onSwitchUtilityScreen("chat", newDataTable.toString());
  }

  return (
    <React.Fragment>
      <div class="contact-block" onClick={() => doCreateChat(props.userId)}>
      <img src="https://img.icons8.com/carbon-copy/100/000000/phone-not-being-used.png"/>
        <p>{props.name}</p>
      </div>
    </React.Fragment>
  )
}

export default Contact