/* 
  David McDowall - Honours Project
  App.js component that hosts the top level React Router used to display either the login/register screens or the dashboard.
*/

import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

/* App component */
class App extends Component {
  render() {
    /* Render method returns the React Router which will render the appropriate component depending on the URL path */
    return (
      <Router>
        <div>
          <Switch>
            {/* Renders Login component if /login is accessed */}
            <Route exact path="/login" component={() => <Login />} />
            {/* Renders Register component if /register/student is accessed */}
            <Route exact path="/register/student" component={Register} />
            {/* Renders Dashboard component if / if accessed - utilised ProtectedRoute to authorise access */}
            <ProtectedRoute path="/" component={(props) => <Dashboard {...props} />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
