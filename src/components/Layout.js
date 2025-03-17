import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Tabs,
  Tab
} from '@mui/material';
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
  const { hierarchyData, resourceType, setResourceType } = useHierarchy();
  const [showFileUpload, setShowFileUpload] = useState(!hierarchyData);

  const handleTabChange = (event, newValue) => {
    const resourceTypes = ['environments', 'flows', 'env_policies', 'attestation_types'];
    setResourceType(resourceTypes[newValue]);
  };
  
  // Get the current tab index based on the selected resource type
  const getTabIndex = () => {
    switch(resourceType) {
      case 'environments': return 0;
      case 'flows': return 1;
      case 'env_policies': return 2;
      case 'attestation_types': return 3;
      default: return 0;
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Spaces Explorer
          </Typography>
        </Toolbar>
        {hierarchyData && !showFileUpload && (
          <Box sx={{ bgcolor: 'primary.dark' }}>
            <Tabs 
              value={getTabIndex()} 
              onChange={handleTabChange}
              centered
              textColor="inherit"
              indicatorColor="secondary"
              aria-label="resource type tabs"
            >
              <Tab icon={<WebIcon />} label="Environments" />
              <Tab icon={<AddCircleIcon />} label="Flows" />
              <Tab icon={<SettingsIcon />} label="Environment Policies" />
              <Tab icon={<VerifiedIcon />} label="Attestation Types" />
            </Tabs>
          </Box>
        )}
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
          <Typography variant="subtitle2" sx={{ p: 2, pt: 3 }}>
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
        {/* Extra space to account for the tabs */}
        {hierarchyData && !showFileUpload && <Box sx={{ height: 48 }} />}
        
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