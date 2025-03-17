import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import WebIcon from '@mui/icons-material/Web';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SpaceTree from './SpaceTree';
import ResourceList from './ResourceList';
import FileUpload from './FileUpload';
import { useHierarchy } from '../hooks/useHierarchy';

const drawerWidth = 240;

const Layout = ({ onFileUpload }) => {
  const { hierarchyData, setResourceType } = useHierarchy();
  const [showFileUpload, setShowFileUpload] = useState(!hierarchyData);

  const handleResourceTypeClick = (type) => {
    setResourceType(type);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Spaces Explorer
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => handleResourceTypeClick('environments')}>
              <ListItemIcon>
                <WebIcon />
              </ListItemIcon>
              <ListItemText primary="Environments" />
            </ListItem>
            <ListItem button onClick={() => handleResourceTypeClick('flows')}>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Flows" />
            </ListItem>
            <ListItem button onClick={() => handleResourceTypeClick('env_policies')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Env Policies" />
            </ListItem>
            <ListItem button onClick={() => handleResourceTypeClick('attestation_types')}>
              <ListItemIcon>
                <VerifiedIcon />
              </ListItemIcon>
              <ListItemText primary="Attestation Types" />
            </ListItem>
          </List>
          <Divider />
          <Typography variant="subtitle2" sx={{ p: 2 }}>
            Spaces
          </Typography>
          <SpaceTree />
          <Divider />
          <List>
            <ListItem button onClick={() => setShowFileUpload(true)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Load Hierarchy" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {showFileUpload ? (
          <FileUpload 
            onFileUpload={(data) => {
              onFileUpload(data);
              setShowFileUpload(false);
            }} 
          />
        ) : (
          <ResourceList />
        )}
      </Box>
    </>
  );
};

export default Layout;