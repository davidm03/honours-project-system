/* 
  David McDowall - Honours Project
  Register.js component that processes and displays the screen for registering new students
*/

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/* Function for setting page styles */
const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

/* Register component */
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null, emailError: null, studentIDError: null, passwordError: null, confPasswordError: null, checkConsent: false };
  }
  /* Function for handling registering a new student */
  handleRegister = (e) => {
    // prevent the page from reloading
    e.preventDefault();
    // check if the user has checked the GDPR consent checkbox
    if (this.state.checkConsent) {
      // get the user information from the text fields on screen
      var email = document.getElementById('email').value;
      var first_name = document.getElementById('first_name').value;
      var surname = document.getElementById('surname').value;
      var studentID = document.getElementById('studentID').value;
      var password = document.getElementById('password').value;
      var confPassword = document.getElementById('confPassword').value;

      // check if the users password matches the confirm password field
      if (password !== confPassword) {
        // display error message
        this.setState({ confPasswordError: "Passwords do not match." });
      }
      // else check if email address entered is a valid email
      else if (!this.validateEmail(email)) {
        // display error message
        this.setState({ emailError: "Invalid email address." })
      }
      // else register user
      else {
        // use axios to send POST request to register a new user
        axios.post(process.env.REACT_APP_SERVER_URL + 'users/register', {
          email: email,
          first_name: first_name,
          surname: surname,
          studentID: studentID,
          role: ["STUDENT"],
          password: password
        })
          .then(res => {
            // if success response
            if (res.data === true) {
              // redirect user to login
              this.setState({ redirect: "/login" });
            }
            // else failure response
            else {
              // check if error is email
              if (res.data.error === "email") {
                // display email error
                this.setState({ emailError: res.data.message, studentIDError: null, passwordError: null, confPasswordError: null });
              }
              // else if error is student id error
              else if (res.data.error === "studentID") {
                // display student id error
                this.setState({ studentIDError: res.data.message, emailError: null, passwordError: null, confPasswordError: null });
              }
            }
          })
      }
    }
  }
  /* Function for validating a users email address 
    Params: email address
  */
  validateEmail = (email) => {
    // define regex for checking email address
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // test email against regex and return true/false
    return re.test(String(email).toLowerCase());
  }
  /* Render method to process and display user interface */
  render() {
    const { classes } = this.props;

    // check if page is redirecting
    if (this.state.redirect) {
      // redirct the user
      return <Redirect to={this.state.redirect} />
    }
    // return the user interface display
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Student Registration
            </Typography>
          {/* HTML Form for registering user */}
          <form className={classes.form} onSubmit={this.handleRegister}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={this.state.emailError}
              helperText={this.state.emailError}
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="surname"
              label="Surname"
              name="surname"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="studentID"
              label="Student ID"
              name="studentID"
              error={this.state.studentIDError}
              helperText={this.state.studentIDError}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={this.state.passwordError}
              helperText={this.state.passwordError}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={this.state.confPasswordError}
              helperText={this.state.confPasswordError}
              fullWidth
              name="confPassword"
              label="Confirm Password"
              type="password"
              id="confPassword"
              autoComplete="new-password"
            />
            {/* GDPR data consent checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checkConsent}
                  onChange={() => { this.setState({ checkConsent: !this.state.checkConsent }) }}
                  name="checkboxConsent"
                  color="primary"
                />
              }
              label="I consent to my account details being stored and processed."
            />
            {/*  Register button is disabled unless user checks GDPR consent */}
            {this.state.checkConsent ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Register
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled
              >
                Register
              </Button>
            )}

            {/* Link to login */}
            <Grid container justify="center">
              <Link href="/login" variant="body2">
                {"Already registered? Sign in!"}
              </Link>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Register);