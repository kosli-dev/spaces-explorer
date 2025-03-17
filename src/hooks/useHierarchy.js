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

// Function to collect resources with their paths
// For env_policies and attestation_types, we cascade resources from parent spaces
const collectResources = (space, resourceType, parentPath = '', result = [], cascadedResources = {}) => {
  if (!space) return result;
  
  const currentPath = parentPath ? `${parentPath} / ${space.name}` : space.name;
  const currentCascaded = { ...cascadedResources };
  
  // Add resources of this space
  if (space[resourceType] && Array.isArray(space[resourceType])) {
    space[resourceType].forEach(resource => {
      // Add to result only if not already added (to avoid duplicates)
      if (!currentCascaded[resource]) {
        result.push({
          id: `${currentPath} / ${resourceType} / ${resource}`,
          name: resource,
          path: currentPath,
          type: resourceType
        });
        
        // Mark this resource as seen
        currentCascaded[resource] = true;
      }
    });
  }
  
  // Recursively collect from subspaces
  if (space.spaces && Array.isArray(space.spaces)) {
    space.spaces.forEach(subspace => {
      collectResources(subspace, resourceType, currentPath, result, currentCascaded);
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
  // For env_policies and attestation_types, we also include those from parent spaces
  const getResourcesOfType = (type) => {
    if (!hierarchyData || !hierarchyData.spaces || hierarchyData.spaces.length === 0 || !currentSpace) {
      return [];
    }

    const result = [];
    const cascadedResources = {};
    
    // If the resource type should cascade (env_policies or attestation_types)
    if (type === 'env_policies' || type === 'attestation_types') {
      // Find the current space's path in the hierarchy
      const currentSpacePath = flatSpaces.find(s => s.name === currentSpace.name)?.path;
      
      if (currentSpacePath) {
        // Split path into space names
        const pathParts = currentSpacePath.split(' / ');
        
        // Start from root and work down to current space, collecting resources
        let partialPath = '';
        let currentRoot = hierarchyData.spaces[0]; // Start at ROOT
        
        // First collect from ROOT
        if (currentRoot[type] && Array.isArray(currentRoot[type])) {
          currentRoot[type].forEach(resource => {
            result.push({
              id: `${currentRoot.name} / ${type} / ${resource}`,
              name: resource,
              path: currentRoot.name,
              type: type,
              inherited: true
            });
            cascadedResources[resource] = true;
          });
        }
        
        // Then work our way down the path, collecting resources from each parent space
        for (let i = 1; i < pathParts.length - 1; i++) {
          const spaceName = pathParts[i];
          partialPath = partialPath ? `${partialPath} / ${spaceName}` : spaceName;
          
          // Find this space in the tree
          let foundSpace = null;
          let searchRoot = currentRoot;
          
          // Simple recursion to find the right space
          const findSpace = (space, targetName) => {
            if (space.name === targetName) return space;
            if (!space.spaces) return null;
            
            for (const subspace of space.spaces) {
              const found = findSpace(subspace, targetName);
              if (found) return found;
            }
            return null;
          };
          
          foundSpace = findSpace(searchRoot, spaceName);
          
          if (foundSpace && foundSpace[type] && Array.isArray(foundSpace[type])) {
            foundSpace[type].forEach(resource => {
              if (!cascadedResources[resource]) {
                result.push({
                  id: `${partialPath} / ${type} / ${resource}`,
                  name: resource,
                  path: partialPath,
                  type: type,
                  inherited: true
                });
                cascadedResources[resource] = true;
              }
            });
          }
        }
      }
    }
    
    // Now collect resources from current space and its subspaces
    return [...result, ...collectResources(currentSpace, type, '', [], cascadedResources)];
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