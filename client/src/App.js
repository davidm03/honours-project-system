import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Switch>
        <Route exact path="/login" component={()=><Login/>} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute path="/" component={(props)=><Dashboard {...props} />}/>
        </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
