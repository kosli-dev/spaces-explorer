import React, { createContext, useContext, useState, useEffect } from 'react';

const HierarchyContext = createContext();

// Utility function to flatten a space and all its subspaces
const flattenSpaces = (space, parentPath = '') => {
  if (!space) return [];
  
  const currentPath = parentPath ? `${parentPath} / ${space.name}` : space.name;
  
  const result = [{
    id: currentPath,
    name: space.name,
    path: currentPath,
    data: space
  }];
  
  if (space.spaces && Array.isArray(space.spaces)) {
    space.spaces.forEach(subspace => {
      const flattened = flattenSpaces(subspace, currentPath);
      result.push(...flattened);
    });
  }
  
  return result;
};

// Function to collect resources (environments, flows, etc.) with their paths
const collectResources = (space, resourceType, parentPath = '', result = []) => {
  if (!space) return result;
  
  const currentPath = parentPath ? `${parentPath} / ${space.name}` : space.name;
  
  // Add resources of this space
  if (space[resourceType] && Array.isArray(space[resourceType])) {
    space[resourceType].forEach(resource => {
      result.push({
        id: `${currentPath} / ${resourceType} / ${resource}`,
        name: resource,
        path: currentPath,
        type: resourceType
      });
    });
  }
  
  // Recursively collect from subspaces
  if (space.spaces && Array.isArray(space.spaces)) {
    space.spaces.forEach(subspace => {
      collectResources(subspace, resourceType, currentPath, result);
    });
  }
  
  return result;
};

export const HierarchyProvider = ({ children, hierarchyData }) => {
  const [currentSpace, setCurrentSpace] = useState(null);
  const [flatSpaces, setFlatSpaces] = useState([]);
  const [resourceType, setResourceType] = useState('environments');
  
  // When hierarchy data changes, flatten the spaces for easier navigation
  useEffect(() => {
    if (hierarchyData && hierarchyData.spaces && hierarchyData.spaces.length > 0) {
      const rootSpace = hierarchyData.spaces[0];
      const allSpaces = flattenSpaces(rootSpace);
      setFlatSpaces(allSpaces);
      
      // Set the root space as the current space initially
      setCurrentSpace(rootSpace);
    } else {
      setFlatSpaces([]);
      setCurrentSpace(null);
    }
  }, [hierarchyData]);
  
  // Get resources of the selected type for the current space and its subspaces
  const getResourcesOfType = (type) => {
    if (!hierarchyData || !hierarchyData.spaces || hierarchyData.spaces.length === 0 || !currentSpace) {
      return [];
    }
    
    // Only collect resources from the current space and its subspaces
    return collectResources(currentSpace, type);
  };
  
  // Get the spaces as a nested tree structure
  const getSpacesTree = () => {
    if (!hierarchyData || !hierarchyData.spaces) return [];
    return hierarchyData.spaces;
  };
  
  return (
    <HierarchyContext.Provider 
      value={{ 
        hierarchyData,
        currentSpace,
        setCurrentSpace,
        flatSpaces,
        resourceType,
        setResourceType,
        getResourcesOfType,
        getSpacesTree
      }}
    >
      {children}
    </HierarchyContext.Provider>
  );
};

export const useHierarchy = () => useContext(HierarchyContext);