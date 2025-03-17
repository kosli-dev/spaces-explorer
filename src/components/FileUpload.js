import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileUpload = ({ onFileUpload }) => {
  const [error, setError] = useState(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Validate by parsing (will throw if invalid)
        JSON.parse(e.target.result);
        // Call the callback with the file content
        onFileUpload(e.target.result);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file: ' + err.message);
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  };
  
  // Function to load the sample data (bigbankinc-hierarchy.json)
  const loadSampleData = async () => {
    try {
      const response = await fetch('/bigbankinc-hierarchy.json');
      if (!response.ok) {
        throw new Error('Failed to load sample data');
      }
      const data = await response.text();
      onFileUpload(data);
    } catch (err) {
      setError('Error loading sample data: ' + err.message);
    }
  };
  
  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Load Hierarchy Data
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Upload a JSON file with your organization&apos;s hierarchy data to get started.
        The file should match the format of the provided example.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Upload JSON File
          <input
            type="file"
            accept=".json"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        
        <Button
          variant="outlined"
          onClick={loadSampleData}
        >
          Use Sample Data
        </Button>
      </Box>
    </Paper>
  );
};

export default FileUpload;