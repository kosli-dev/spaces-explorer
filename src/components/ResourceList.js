import React, { useMemo, useState } from 'react';
import { useHierarchy } from '../hooks/useHierarchy';
import { 
  Typography, 
  Paper,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import WebIcon from '@mui/icons-material/Web';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';

const ResourceList = () => {
  const { resourceType, getResourcesOfType, currentSpace, flatSpaces } = useHierarchy();
  
  // Track expanded state of tree nodes
  const [expandedPaths, setExpandedPaths] = useState({});
  
  // Get all resources of the current type
  const resources = useMemo(() => {
    return getResourcesOfType(resourceType);
  }, [resourceType, getResourcesOfType]);
  
  // Get resource type icon
  const getResourceIcon = (type) => {
    switch(type) {
      case 'environments': return <WebIcon />;
      case 'flows': return <AddCircleIcon />;
      case 'env_policies': return <SettingsIcon />;
      case 'attestation_types': return <VerifiedIcon />;
      default: return <DescriptionIcon />;
    }
  };
  
  // Organize resources into a hierarchical structure by path
  const resourceTree = useMemo(() => {
    const tree = {};
    
    if (!resources) return tree;
    
    // Group resources by their path
    resources.forEach(resource => {
      if (!tree[resource.path]) {
        tree[resource.path] = [];
      }
      tree[resource.path].push(resource);
    });
    
    return tree;
  }, [resources]);
  
  // Get tree paths sorted by depth (number of path segments)
  const sortedPaths = useMemo(() => {
    return Object.keys(resourceTree).sort((a, b) => {
      const aDepth = a.split(' / ').length;
      const bDepth = b.split(' / ').length;
      if (aDepth !== bDepth) return aDepth - bDepth;
      return a.localeCompare(b);
    });
  }, [resourceTree]);
  
  // Toggle expand/collapse for a path
  const toggleExpand = (path) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Map resource types to readable names
  const resourceTypeLabels = {
    'environments': 'Environments',
    'flows': 'Flows',
    'env_policies': 'Environment Policies',
    'attestation_types': 'Attestation Types'
  };
  
  if (!currentSpace) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">
          Please select a space or load a hierarchy file
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Current Space: {flatSpaces.find(s => s.name === currentSpace.name)?.path || currentSpace.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resourceType === 'env_policies' || resourceType === 'attestation_types' 
            ? 'Showing resources for this space, all nested spaces below, and inherited from parent spaces'
            : 'Showing resources for this space and all nested spaces below'}
        </Typography>
      </Box>
      
      {resources.length > 0 ? (
        <Paper sx={{ mb: 4 }}>
          <List component="nav" aria-label="resource hierarchy">
            {sortedPaths.map((path) => {
              const pathParts = path.split(' / ');
              const level = pathParts.length - 1; // Nesting level
              const isExpanded = expandedPaths[path] !== false; // Default to expanded
              const resourcesInPath = resourceTree[path] || [];
              
              return (
                <React.Fragment key={path}>
                  {/* Path header */}
                  <ListItem 
                    disablePadding
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
                  >
                    <ListItemButton
                      onClick={() => toggleExpand(path)}
                      sx={{ pl: level + 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={pathParts[pathParts.length - 1]} 
                        secondary={`${resourcesInPath.length} ${resourceTypeLabels[resourceType].toLowerCase()}`}
                      />
                      {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </ListItemButton>
                  </ListItem>
                  
                  {/* Resources in this path */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {resourcesInPath.map((resource) => (
                        <ListItem
                          key={resource.id}
                          sx={{ 
                            pl: level + 3,
                            ...(resource.inherited ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {})
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {getResourceIcon(resourceType)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={resource.name} 
                            secondary={resource.inherited ? 'Inherited' : ''}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  {level === 0 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No {resourceTypeLabels[resourceType].toLowerCase()} found in the hierarchy
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ResourceList;