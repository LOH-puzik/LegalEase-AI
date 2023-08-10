import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import axios from 'axios';

function LegalDocAnalyzer() {
  const [extractedText, setExtractedText] = useState(''); // State variable for extracted text
  const [loading, setLoading] = useState(false); // State variable for loading state

  const onDrop = async (acceptedFiles) => {
    setLoading(true); // Set loading to true when file is dropped
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/doc', formData);
      setExtractedText(response.data.summary.join(' '));
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    } finally {
      setLoading(false); // Set loading to false when request is done
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <VStack alignItems="center" justifyContent="center" minHeight="25vh" spacing={4}>
      <HStack spacing={30}>
        <Box {...getRootProps()} style={{ textAlign: 'center' }}>
          <input {...getInputProps()} accept=".pdf" />
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component="span"
              size="large"
              sx={{
                backgroundColor: '#00416a',
                '&:hover': {
                  backgroundColor: '#08457e',
                },
                color: '#eef4f2',
                fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
                fontWeight: 'bold',
              }}
            >
              Click to Upload & Analyze
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: '#eef4f2',
                  marginLeft: '30px',
                }}
              />
            )}
          </Box>
        </Box>
      </HStack>
      <Box
        style={{
          backgroundColor: 'rgba(211, 211, 211, 0.08)',
          width: '70%',
          height: '75%',
          position: 'absolute',
          bottom: '60px',
          zIndex: -1,
          overflow: 'auto',
          padding: '10px',
          fontSize: '14px',
          color: 'white',
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
          fontWeight: 'bold',
        }}
      >
        {extractedText && (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{extractedText}</pre>
        )}
      </Box>
    </VStack>
  );
}

export default LegalDocAnalyzer;
