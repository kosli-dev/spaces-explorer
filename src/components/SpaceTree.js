import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import { useHierarchy } from '../hooks/useHierarchy';

// A recursive component to render the space tree
const SpaceTreeItem = ({ space, level = 0, parentPath = '' }) => {
  const [open, setOpen] = useState(level === 0); // Auto-expand root level
  const { setCurrentSpace } = useHierarchy();
  
  if (!space) return null;
  
  const hasSubspaces = space.spaces && space.spaces.length > 0;
  const currentPath = parentPath ? `${parentPath} / ${space.name}` : space.name;
  
  const handleSpaceClick = () => {
    setCurrentSpace(space);
  };
  
  const handleExpandClick = (e) => {
    setOpen(!open);
    e.stopPropagation();
  };
  
  return (
    <>
      <ListItem 
        disablePadding
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.03)'
        }}
      >
        <ListItemButton
          onClick={handleSpaceClick}
          sx={{ pl: level * 2 + 2 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={space.name} />
          {hasSubspaces && (
            <Box onClick={handleExpandClick}>
              {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </Box>
          )}
        </ListItemButton>
      </ListItem>
      
      {hasSubspaces && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {space.spaces.map((subspace, index) => (
              <SpaceTreeItem 
                key={index} 
                space={subspace} 
                level={level + 1} 
                parentPath={currentPath}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const SpaceTree = () => {
  const { getSpacesTree } = useHierarchy();
  const spacesTree = getSpacesTree();
  
  if (!spacesTree || spacesTree.length === 0) {
    return <Box sx={{ p: 2 }}>No spaces available</Box>;
  }
  
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
    >
      {spacesTree.map((space, index) => (
        <SpaceTreeItem key={index} space={space} />
      ))}
    </List>
  );
};

export default SpaceTree;