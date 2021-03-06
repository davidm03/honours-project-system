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
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, adminListItems, supervisorListItems } from './listItems';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import Users from './Users';
import AdminProjects from './AdminProjects';
import ViewUser from './ViewUser';
import { ViewProject } from './manageProjects';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Projects from './Projects';
import axios from 'axios';
import ExpandProject from './ExpandProject';
import Supervisors from './Supervisors';
import MyRequests from './MyRequests';
import MyProject from './MyProject';
import SupervisorStudents from './SupervisorStudents';
import SupervisorProjects from './SupervisorProjects';

const drawerWidth = 240;

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

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = { open: true, redirect: null, allProjects: [], myRequests: [], supervisors: [], supervisorData: {}, myProjectData: [] };
  }
  handleLogout = () => {
    localStorage.removeItem('access-token');
    this.setState({ redirect: "/login" });
  }
  loadSupervisors = () => {
    axios.get(process.env.REACT_APP_SERVER_URL + 'users/supervisors')
    .then(res => {
      if (res.data.length > 0) {
        this.setState({ supervisors: res.data });
      }
    })
  }
  loadStudents = () => {
    axios.get(process.env.REACT_APP_SERVER_URL + 'users/students')
    .then(res => {
      if (res.data.length > 0) {
        var myProjects = this.state.supervisorData.projects;
        var myStudents = [], i = 0, len = res.data.length; 
        while (i<len) {
          const student = res.data[i];
          const isMyStudent = myProjects.some(project => project.studentID === student._id);
          if (isMyStudent) myStudents.push(student); 
          i++;
        }
        var data = this.state.supervisorData;
        data.students = myStudents; 
        this.setState({ supervisorData: data });
      }
    })
  }
  loadProjects = () => {
    const isStudent = this.props.user.role.includes("STUDENT");
    axios.get(process.env.REACT_APP_SERVER_URL + 'project')
    .then(res => {
        if (res.data && isStudent) {
            const myProject = res.data.find(project => project.studentID === this.props.user.userId);
            var data = null;

            if (myProject) {
              const mySupervisor = this.state.supervisors.find(supervisor => supervisor._id === myProject.supervisorID);
              data = {
              user: this.props.user,
              project: myProject,
              supervisor: mySupervisor
              }
            }
            this.setState({ allProjects: res.data, myProjectData: data });
        }
        else if (res.data && !isStudent) {
          var supervisorProjects = [], i = 0, len = res.data.length; 
          while (i < len) {
            if (res.data[i].supervisorID === this.props.user.userId) {
              supervisorProjects.push(res.data[i]);
            }
            i++;
          }
          var data = this.state.supervisorData;
          data.user = this.props.user;
          data.projects = supervisorProjects;
          this.setState({ allProjects: res.data, supervisorData: data });
          this.loadStudents();
        }
    });
  }
  loadRequests = () => {
    const user = this.props.user;
    var requests = [];
    if (user.role.includes("STUDENT")) {
      axios.get(process.env.REACT_APP_SERVER_URL + 'requests/student/' + user.userId)
      .then(res => {
        if (res.data) {
          this.setState({ myRequests: res.data });
        }
      });
    }
    else {
      axios.get(process.env.REACT_APP_SERVER_URL + 'requests/supervisor/' + user.userId)
      .then(res => {
        if (res.data) {
          for (let index = 0; index < res.data.length; index++) {
            const request = res.data[index];
            if (request.status === 'Pending') {
              requests.push(request);
            }
          }
          this.setState({ myRequests: requests });
        }
      });
    }
  }
  componentDidMount() {
    this.loadSupervisors();
    this.loadProjects();
    this.loadRequests();
  }
  render() {
  if (this.state.redirect) {
   return <Redirect to={this.state.redirect} /> 
  }
  const { classes } = this.props;

  const handleDrawerOpen = () => {
    this.setState({open: true});
  };
  const handleDrawerClose = () => {
    this.setState({open: false});
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
      <div className={classes.root}>
        <CssBaseline />
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
            <Button endIcon={<ArrowDropDownIcon />} style={{color: "white"}}>
              { this.props.user.email }
            </Button>
            <Link to="/requests" style={{ color: "white" }}>
            <IconButton color="inherit">
                <Badge badgeContent={this.state.myRequests.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            </Link>
            <IconButton color="inherit" onClick={this.handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
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
          <List>{mainListItems}</List>
          {this.props.user.role.includes("MODULE_LEADER") && (
            <>
             <Divider />
            <List>{adminListItems}</List>
            </>
          )}
          {this.props.user.role.includes("SUPERVISOR") && (
            <>
              <Divider />
              <List>{supervisorListItems}</List>
            </>
          )}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <ProtectedRoute path="/manage/users" component={()=><Users />} admin={true} />
              <ProtectedRoute path="/view/user/:id" component={(props)=><ViewUser {...props} />} admin={true} />
              <ProtectedRoute path="/manage/projects" component={()=><AdminProjects data={{projects: this.state.allProjects, supervisors: this.state.supervisors}} loadProjects={this.loadProjects}/>} admin={true} />
              <ProtectedRoute path="/view/project/:id" component={(props)=><ViewProject {...props} />} supervisor={true} />
              
              <ProtectedRoute path="/projects" component={()=><Projects projects={this.state.allProjects} supervisors={this.state.supervisors}/>} />
              <ProtectedRoute path="/project/:id" component={(props)=><ExpandProject {...props} user={this.props.user} data={{projects: this.state.allProjects, supervisors: this.state.supervisors}} reloadProjects={this.loadProjects}/>} />
              <ProtectedRoute path="/supervisors" component={(props)=><Supervisors {...props} user={this.props.user} supervisors={this.state.supervisors}/>} />
              
              <ProtectedRoute path="/requests" component={(props)=><MyRequests {...props} requests={this.state.myRequests} user={this.props.user} loadRequests={this.loadRequests}/>} />
              <ProtectedRoute path="/my-project" component={(props)=><MyProject {...props} data={this.state.myProjectData} reloadProject={this.loadProjects}/>} />

              <ProtectedRoute path="/supervisor/students" component={()=><SupervisorStudents data={this.state.supervisorData}/>} supervisor={true}/>
              <ProtectedRoute path="/supervisor/projects" component={()=><SupervisorProjects data={this.state.supervisorData} reloadProjects={this.loadProjects}/>} supervisor={true}/>
              <ProtectedRoute path="/supervisor/project/:id" component={(props)=><MyProject {...props} reloadProject={this.loadProjects} supervisor={true}/>} />
            </Switch>
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);