import React, { useMemo } from 'react';
import { useHierarchy } from '../hooks/useHierarchy';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box
} from '@mui/material';

const ResourceList = () => {
  const { resourceType, getResourcesOfType, currentSpace, flatSpaces } = useHierarchy();
  
  // Get all resources of the current type
  const resources = useMemo(() => {
    return getResourcesOfType(resourceType);
  }, [resourceType, getResourcesOfType]);
  
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
        <Typography variant="h5" gutterBottom>
          {resourceTypeLabels[resourceType] || resourceType}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Current Space: {flatSpaces.find(s => s.name === currentSpace.name)?.path || currentSpace.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resourceType === 'env_policies' || resourceType === 'attestation_types' 
            ? 'Showing resources for this space, all nested spaces below, and inherited from parent spaces'
            : 'Showing resources for this space and all nested spaces below'}
        </Typography>
      </Box>
      
      {resources.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table sx={{ minWidth: 650 }} aria-label="resources table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Path</strong></TableCell>
                {(resourceType === 'env_policies' || resourceType === 'attestation_types') && (
                  <TableCell><strong>Inherited</strong></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource) => (
                <TableRow
                  key={resource.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    ...(resource.inherited ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {})
                  }}
                >
                  <TableCell component="th" scope="row">
                    {resource.name}
                  </TableCell>
                  <TableCell>{resource.path}</TableCell>
                  {(resourceType === 'env_policies' || resourceType === 'attestation_types') && (
                    <TableCell>{resource.inherited ? 'Yes' : 'No'}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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