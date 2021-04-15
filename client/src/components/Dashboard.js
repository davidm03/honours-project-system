/* 
  David McDowall - Honours Project
  Dashboard.js component which hosts the dashboard skeleton and nested React Router for displaying dynamic content within the dashboard depending on the users navigation. 
*/

import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems, adminListItems, supervisorListItems, studentListItems } from './listItems';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import Users from './Users';
import AdminProjects from './AdminProjects';
import ViewUser from './ViewUser';
import { ViewProject } from './manageProjects';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Projects from './Projects';
import axios from 'axios';
import Supervisors from './Supervisors';
import MyRequests from './MyRequests';
import MyProject from './MyProject';
import SupervisorStudents from './SupervisorStudents';
import SupervisorProjects from './SupervisorProjects';
import { MenuList } from '@material-ui/core';

import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Profile from './Profile';
import Reports from './Reports';
import Home from './Home';

const drawerWidth = 240;

/* Function for defining page styling elements (Dashboard theme) */
const useStyles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

/* Dashboard component */
class Dashboard extends Component {
  constructor(props) {
    super(props);
    // define the initial component state 
    this.state = {
      open: true, // dashboard sidebar open or closed variable
      userMenu: false,  // user name dropdown open or closed variable
      userMenuAnchorEl: false,  // user name dropdown anchor element
      redirect: null, // redirects if set 
      allProjects: [],  // collection of all projects
      myRequests: [], // collection of current user requests
      supervisors: [],  // collection of all supervisors
      supervisorData: {}, // data relevant to a current supervisor
      myProjectData: [] // data of students current project
    };
  }
  /* Function for handling a user logout */
  handleLogout = () => {
    // remove the JWT access token from local storage
    localStorage.removeItem('access-token');
    // redirect the user outside of the application to the login page
    this.setState({ redirect: "/login" });
  }
  /* Function for loading supervisors from the server */
  loadSupervisors = () => {
    // use axios to send GET request to server
    axios.get(process.env.REACT_APP_SERVER_URL + 'users/supervisors')
      .then(res => {
        // if response contains data
        if (res.data.length > 0) {
          // store the data in the state
          this.setState({ supervisors: res.data });
        }
      })
  }
  /* Function for loading all student supervised by the current supervisor from the server */
  loadStudents = () => {
    // use axios to send GET request to server
    axios.get(process.env.REACT_APP_SERVER_URL + 'users/students')
      .then(res => {
        // if response contains data
        if (res.data.length > 0) {
          // define variables
          var myProjects = this.state.supervisorData.projects;
          var myStudents = [], i = 0, len = res.data.length;
          // loop through students
          while (i < len) {
            // get current student
            const student = res.data[i];
            // check if current student is being supervised by current supervisor
            const isMyStudent = myProjects.some(project => project.studentID === student._id);
            // if supervisor student - add to collection of students
            if (isMyStudent) myStudents.push(student);
            i++;
          }
          // store the supervisors student data in the state
          var data = this.state.supervisorData;
          data.students = myStudents;
          this.setState({ supervisorData: data });
        }
      })
  }
  /* Function for loading all projects from the server */
  loadProjects = () => {
    // check if current user is a student
    const isStudent = this.props.user.role.includes("STUDENT");
    // use axios to send GET request to server for projects
    axios.get(process.env.REACT_APP_SERVER_URL + 'project')
      .then(res => {
        // if response contains data and user is student
        if (res.data && isStudent) {
          // find the current students project
          const myProject = res.data.find(project => project.studentID === this.props.user.userId);
          var data = null;

          // if the current student has a project
          if (myProject) {
            // find the current students supervisor
            const mySupervisor = this.state.supervisors.find(supervisor => supervisor._id === myProject.supervisorID);
            // create a JSON object to store all student project-supervisor data
            data = {
              user: this.props.user,
              project: myProject,
              supervisor: mySupervisor
            }
          }
          // store data in state
          this.setState({ allProjects: res.data, myProjectData: data });
        }
        // if response contains data and user is NOT student
        else if (res.data && !isStudent) {
          // loop through projects
          var supervisorProjects = [], i = 0, len = res.data.length;
          while (i < len) {
            // if the project is being supervised by the current supervisor - add to collection
            if (res.data[i].supervisorID === this.props.user.userId) {
              supervisorProjects.push(res.data[i]);
            }
            i++;
          }
          // store the data in the state and load students
          var data = this.state.supervisorData;
          data.user = this.props.user;
          data.projects = supervisorProjects;
          this.setState({ allProjects: res.data, supervisorData: data });
          this.loadStudents();
        }
      });
  }
  /* Function for loading requests from the server */
  loadRequests = () => {
    // get the current user from props
    const user = this.props.user;
    // if the current user is a student
    if (user.role.includes("STUDENT")) {
      // use axios to perform GET request for the students requests
      axios.get(process.env.REACT_APP_SERVER_URL + 'requests/student/' + user.userId)
        .then(res => {
          // if response contains data
          if (res.data) {
            // store the requests in the state
            this.setState({ myRequests: res.data });
          }
        });
    }
    // if user is NOT a student
    else {
      // use axios to perform GET request for the supervisors requests
      axios.get(process.env.REACT_APP_SERVER_URL + 'requests/supervisor/' + user.userId)
        .then(res => {
          // if response contains data
          if (res.data) {
            // store the requests in the state
            this.setState({ myRequests: res.data });
          }
        });
    }
  }
  /* ComponentDidMount Function that runs when the component has successfully mounted   */
  componentDidMount() {
    // call methods to load supervisors, projects and requests
    this.loadSupervisors();
    this.loadProjects();
    this.loadRequests();
  }
  /* Render method for processing the code and returning elements to be displayed on screen */
  render() {
    // check for any redirects
    if (this.state.redirect) {
      // redirect to another page
      return <Redirect to={this.state.redirect} />
    }
    // get UI element styled classes
    const { classes } = this.props;

    // function for handling the sidebar navigation open
    const handleDrawerOpen = () => {
      this.setState({ open: true });
    };
    // function for handling the sidebar navigation close
    const handleDrawerClose = () => {
      this.setState({ open: false });
    };
    /* Returns UI elements for display
      Returns the Dashboard skeleton with top and sidebar navigation, and a nested React Router for displaying page content inside the dashboard skeleton
    */
    return (
      <div className={classes.root}>
        <CssBaseline />
        {/* Top navigation bar */}
        <AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Honours Project System
            </Typography>
            <Button endIcon={<ArrowDropDownIcon />} style={{ color: "white" }} onClick={(e) => this.setState({ userMenu: true, userMenuAnchorEl: e.currentTarget })}>
              {this.props.user.email}
            </Button>
            <Popper open={this.state.userMenu} anchorEl={this.state.userMenuAnchorEl} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper style={{ minWidth: 200 }}>
                    <ClickAwayListener onClickAway={() => this.setState({ userMenu: false })}>
                      <MenuList autoFocusItem={this.state.userMenu}>
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                          <MenuItem onClick={() => this.setState({ userMenu: false })}>
                            <ListItemIcon>
                              <AccountCircleIcon />
                            </ListItemIcon>
                          Profile
                        </MenuItem>
                        </Link>
                        <MenuItem onClick={this.handleLogout}>
                          <ListItemIcon>
                            <ExitToAppIcon />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Toolbar>
        </AppBar>
        {/* Side navigation drawer */}
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems(0)}</List>
          {this.props.user.role.includes("SUPERVISOR") && (
            <>
              <Divider />
              <List>{supervisorListItems}</List>
            </>
          )}
          {this.props.user.role.includes("MODULE_LEADER") && (
            <>
              <Divider />
              <List>{adminListItems}</List>
            </>
          )}
          {this.props.user.role.includes("STUDENT") && (
            <>
              <Divider />
              <List>{studentListItems}</List>
            </>
          )}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {/* Page Content Display */}
          <Container maxWidth="lg" className={classes.container}>
            {/* React Router for displaying relevant content based on the users navigation path */}
            <Switch>
              <ProtectedRoute exact path="/" component={() => <Home data={{ supervisors: this.state.supervisors, projects: this.state.allProjects, user: this.props.user }} />} />
              {/* Module Leader Routes/Components */}
              <ProtectedRoute path="/manage/users" component={() => <Users reloadData={() => { this.loadSupervisors(); this.loadStudents(); }} />} admin={true} />
              <ProtectedRoute path="/view/user/:id" component={(props) => <ViewUser {...props} />} admin={true} />
              <ProtectedRoute path="/manage/projects" component={() => <AdminProjects data={{ projects: this.state.allProjects, supervisors: this.state.supervisors }} loadProjects={this.loadProjects} />} admin={true} />
              <ProtectedRoute path="/view/project/:id" component={(props) => <ViewProject {...props} />} supervisor={true} />
              <ProtectedRoute path="/manage/reports" component={() => <Reports data={{ projects: this.state.allProjects, supervisors: this.state.supervisors }} />} admin={true} />

              {/* Student Routes/Components */}
              <ProtectedRoute path="/projects" component={() => <Projects user={this.props.user} projects={this.state.allProjects} supervisors={this.state.supervisors} reloadProjects={this.loadProjects} />} />
              <ProtectedRoute path="/supervisors" component={(props) => <Supervisors {...props} user={this.props.user} supervisors={this.state.supervisors} projects={this.state.allProjects} reloadRequests={this.loadRequests} />} />
              <ProtectedRoute path="/profile" component={() => <Profile user={this.props.user} />} />
              <ProtectedRoute path="/requests" component={(props) => <MyRequests {...props} requests={this.state.myRequests} user={this.props.user} loadRequests={this.loadRequests} loadProjects={this.loadProjects} />} />
              <ProtectedRoute path="/my-project" component={(props) => <MyProject {...props} data={this.state.myProjectData} reloadProject={this.loadProjects} project={this.state.myProjectData ? true : false} />} />

              {/* Supervisor Routes/Components */}
              <ProtectedRoute path="/supervisor/students" component={() => <SupervisorStudents data={this.state.supervisorData} />} supervisor={true} />
              <ProtectedRoute path="/supervisor/projects" component={() => <SupervisorProjects data={this.state.supervisorData} reloadProjects={this.loadProjects} />} supervisor={true} />
              <ProtectedRoute path="/supervisor/project/:id" component={(props) => <MyProject {...props} reloadProject={this.loadProjects} supervisor={true} />} />
            </Switch>
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);