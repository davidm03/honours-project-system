import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Login from './components/Login';
import Register from './components/Register';

class App extends Component {
  constructor(props){
    super(props);
    this.state={ user: null };
  }
  updateLogin = (user) =>{
    console.log("inside update");
    this.setState({user: user});
  }
  render() {
    return (
      <Router>
      <div>
        <Switch>
        <Route exact path="/login" component={()=><Login/>}/>
        <Route exact path="/register" component={Register}/>
        <Route path="/" component={()=><Home user={this.state.user}/>}/>
        </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
