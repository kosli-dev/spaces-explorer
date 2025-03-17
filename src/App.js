import React, { useState } from 'react';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import { HierarchyProvider } from './hooks/useHierarchy';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [hierarchyData, setHierarchyData] = useState(null);

  const handleFileUpload = (fileData) => {
    try {
      const parsedData = JSON.parse(fileData);
      setHierarchyData(parsedData);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      alert('Invalid JSON file. Please upload a valid hierarchy JSON file.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <HierarchyProvider hierarchyData={hierarchyData}>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Layout onFileUpload={handleFileUpload} />
        </Box>
      </HierarchyProvider>
    </ThemeProvider>
  );
}

export default App;