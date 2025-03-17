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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
    
    // Group resources by their appropriate paths
    resources.forEach(resource => {
      // Use the path from the resource
      const path = resource.path;
      
      if (!tree[path]) {
        tree[path] = [];
      }
      
      // Add the resource to its path's collection
      tree[path].push(resource);
    });
    
    return tree;
  }, [resources]);
  
  // Get tree paths sorted by depth (number of path segments)
  // Filter out redundant entries for the current space
  const sortedPaths = useMemo(() => {
    // Early return if currentSpace is null
    if (!currentSpace) return [];
    
    // Get the current space path and name
    const currentSpacePath = flatSpaces.find(s => s.name === currentSpace.name)?.path || '';
    const currentSpaceName = currentSpace.name;
    
    return Object.keys(resourceTree)
      // Filter out paths that end with the current space name (redundant fold-outs)
      .filter(path => {
        const pathParts = path.split(' / ');
        // If this is an exact match with the current space path, we want to keep it
        if (path === currentSpacePath) return true;
        
        // Otherwise, check if the last part matches the current space name
        // If so, it's redundant and should be filtered out
        const lastPart = pathParts[pathParts.length - 1];
        return lastPart !== currentSpaceName;
      })
      .sort((a, b) => {
        const aDepth = a.split(' / ').length;
        const bDepth = b.split(' / ').length;
        if (aDepth !== bDepth) return aDepth - bDepth;
        return a.localeCompare(b);
      });
  }, [resourceTree, currentSpace, flatSpaces]);
  
  // Get the relative path from the current space
  const getRelativePath = (path) => {
    if (!currentSpace) return path;
    
    // Get current space path
    const currentSpacePath = flatSpaces.find(s => s.name === currentSpace.name)?.path || currentSpace.name;
    
    // If this is the current space, just return the last part
    if (path === currentSpacePath) {
      const parts = path.split(' / ');
      return parts[parts.length - 1];
    }
    
    // If this is a child path of the current space, return the relative path
    if (path.startsWith(currentSpacePath + ' / ')) {
      return path.substring(currentSpacePath.length + 3); // +3 for ' / '
    }
    
    // Otherwise return the full path
    return path;
  };
  
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
                        primary={getRelativePath(path)} 
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
                            ...(resource.inherited ? { backgroundColor: 'rgba(65, 105, 225, 0.05)' } : {})
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {resource.inherited 
                              ? <ArrowUpwardIcon color="primary" fontSize="small" />
                              : getResourceIcon(resourceType)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={resource.name} 
                            secondary={resource.inherited 
                              ? `Inherited from: ${resource.inheritedFromPath || resource.originalPath}`
                              : ''}
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