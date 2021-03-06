import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import RateReviewIcon from '@material-ui/icons/RateReview';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSpecial from '@material-ui/icons/FolderSpecial';
import { Link } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';

export function mainListItems(numRequests) {
  return (
  <div>
    <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
    <ListItem button>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    </Link>
    <Link to="/projects" style={{textDecoration: 'none', color: 'black'}}>
    <ListItem button>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary="Honours Projects" />
    </ListItem>
    </Link>
    <Link to="/supervisors" style={{textDecoration: 'none', color: 'black'}}>
    <ListItem button>
      <ListItemIcon>
        <SupervisorAccountIcon />
      </ListItemIcon>
      <ListItemText primary="Project Supervisors" />
    </ListItem>
    </Link>
    <Link to="/requests" style={{textDecoration: 'none', color: 'black'}}>
    <ListItem button>
      <ListItemIcon>
      <Badge badgeContent={numRequests} color="primary">
        <RateReviewIcon />
      </Badge>  
      </ListItemIcon>
      <ListItemText primary="My Requests" />
    </ListItem>
    </Link>
  </div>);
};

export const adminListItems = (
  <div>
    <ListSubheader inset>Manage Module</ListSubheader>
    <Link to="/manage/users" style={{ textDecoration: 'none', color: 'black' }}>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
    </Link>
    <Link to="/manage/projects" style={{ textDecoration: 'none', color: 'black' }}>
    <ListItem button>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary="Projects" />
    </ListItem>
    </Link>
  </div>
);

export const supervisorListItems = (
  <div>
    <ListSubheader inset>Project Supervision</ListSubheader>
    <Link to="/supervisor/students" style={{ textDecoration: 'none', color: 'black' }}>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="My Students" />
    </ListItem>
    </Link>
    <Link to="/supervisor/projects" style={{ textDecoration: 'none', color: 'black' }}>
    <ListItem button>
      <ListItemIcon>
        <FolderSpecial />
      </ListItemIcon>
      <ListItemText primary="My Projects" />
    </ListItem>
    </Link>
  </div>
);

export const studentListItems = (
  <div>
    <ListSubheader inset>Manage Project</ListSubheader>
    <Link to="/my-project" style={{textDecoration: 'none', color: 'black'}}>
    <ListItem button>
      <ListItemIcon>
        <FolderSpecial />
      </ListItemIcon>
      <ListItemText primary="My Project" />
    </ListItem>
    </Link>
  </div>
);
