import React from "react";
import Header from "./Header";
import { connect } from "react-redux";
import firebase from "firebase/app";
import UtilityBar from "./UtilityBar";
import UtilityScreen from "./UtilityScreen";
import { withFirestore, isLoaded, useFirestore } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
// import PropTypes from "prop-types";


class SiteControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      screenView: "home",
      chatName: null,
      currentConvo:  []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("update")
    if (prevState.chatName !== this.state.chatName) {
      console.log("triggered");
      firebase.firestore().collection(`${this.state.chatName}`)
        .onSnapshot((snapshot) => {
          console.log(snapshot);
          const newMessages = snapshot.docs.map((doc) => ({
            description: doc.data().description,
            sender: doc.data().sender,
            type: doc.data().type,
            timestamp: doc.data().timestamp
          }))
          this.setState({
            ...this.state,
            currentConvo: newMessages
          })
        })
    }
  }

  handleChangeScreenView = () => {
    this.setState({
      ...this.state,
      screenView: "home"
    })
  }

  handleSwitchUtilityScreen = (screenSwitch, name) => {
    this.setState({
      ...this.state,
      screenView: screenSwitch,
      chatName: name
    })
  }

  render() {
    let currentView = null;
    const auth = this.props.firebase.auth();
    if (!isLoaded(auth)) {
      return (
        <React.Fragment>
          <h1>Loading...</h1>
        </React.Fragment>
      )
    }
    if ((isLoaded(auth)) && (auth.currentUser == null)) {
      return (
        <React.Fragment>
          <h1>You must sign in.</h1>
          <Link to="/"><p>Go to sign in.</p></Link>
        </React.Fragment>
      )
    } 

    if ((isLoaded(auth)) && (auth.currentUser != null)) {

      const displayName = firebase.auth().currentUser.displayName;

      currentView = <React.Fragment>
      <div class="site-control">
        <div class="utility-bar-div"> 
          <UtilityBar onSwitchUtilityScreen={this.handleSwitchUtilityScreen} currentUser={displayName}/>
        </div>

          <div class="header-div">
            <Header name={displayName} onGoToHome={this.handleChangeScreenView}/>
          </div>
          <div class="utility-screen-div">
            <UtilityScreen screenView={this.state.screenView} chat={this.state.currentConvo} chatName={this.state.chatName} currentUser={displayName}/>
          </div>

      </div>
    </React.Fragment>
    }

    return currentView;
  }
}

const mapStateToProps = (state) => {
  return {
    firestore: state.firestore
  }
}


SiteControl = connect(mapStateToProps)(SiteControl);
export default withFirestore(SiteControl);