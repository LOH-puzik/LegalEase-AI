import React, { useState } from 'react';
import { 
  ChakraProvider,
  Center, 
  Select, 
  Button, 
  Text,
  Box, 
  NumberInput, 
  NumberInputField, 
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper, 
  HStack,
  VStack,
  Divider,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";

import { InfoIcon } from '@chakra-ui/icons';

function CasePred() {
  const [caseType, setCaseType] = useState(1.0);
  const [bulletPoints, setBulletPoints] = useState(0.0);
  const [paragraphs, setParagraphs] = useState(0.0);
  const [articles, setArticles] = useState(0.0);
  const [guilty, setGuilty] = useState(0.0);
  const [prediction, setPrediction] = useState(0.0);

  // Info texts
  const infoCaseType = "The specific type of legal case";
  const infoBulletPoints = "Bullet-points are specific listed items in legal documents that disobey the regulations or the case facts";
  const infoParagraphs = "Violated Paragraphs are broader text sections in legal material that contradict laws or misrepresent case information";
  const infoArticles = "Violated Articles are distinct, numbered sections in legal texts that contain illegal or inconsistent statements or provisions";
  const infoGuilty = "Whether the defendant is proven guilty or not guilty";
  const infoPrediction = "Information about the prediction";

  const handleSubmit = () => {
    console.log(caseType, bulletPoints, paragraphs, articles, guilty);
  
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseType, bulletPoints, paragraphs, articles, guilty })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.prediction);
        setPrediction(data.prediction);
      });
  }

  return (
    <ChakraProvider>
      {/*empty box*/}
      <Box h={100}></Box>
      <HStack>
      <Box 
        color={"white"} 
        flexDirection="column" 
        paddingTop={130}
        paddingLeft={300}
        paddingRight={100}
        >
          {/*case type*/}
          <HStack spacing={-1}>
            <Text fontSize="l" fontWeight="bold" color={"whiteAlpha.900"} mb={1}> Case Type</Text>
            <Tooltip label={infoCaseType} placement="right" hasArrow>
              <IconButton
                color="whiteAlpha.800"
                as="button"
                variant="ghost"
                colorScheme="whiteAlpha"
                aria-label="Warning"
                _hover={{ color: 'white' }}
                icon={<InfoIcon />}
                size="sm"
              />
            </Tooltip>
          </HStack>
          <Select  bgColor={''} placeholder='Select a case type' onChange={e => setCaseType(e.target.value)} width="300px" marginBottom="20px" borderRadius="md">
            <option style={{ color: 'black' }} value={4.0}>Minor Traffic Violations</option>
            <option style={{ color: 'black' }} value={4.0}>Small Claims Disputes</option>
            <option style={{ color: 'black' }} value={4.0}>Landlord-Tenant Disputes</option>
            <option style={{ color: 'black' }} value={4.0}>Misdemeanor Offenses (non-violent)</option>
            <option style={{ color: 'black' }} value={3.0}>Employment Disputes</option>
            <option style={{ color: 'black' }} value={3.0}>Personal Injury</option>
            <option style={{ color: 'black' }} value={3.0}>Contract Disputes (non-high-value)</option>
            <option style={{ color: 'black' }} value={3.0}>Immigration Hearings (non-asylum)</option>
            <option style={{ color: 'black' }} value={2.0}>Financial Fraud</option>
            <option style={{ color: 'black' }} value={2.0}>Child Custody Battles</option>
            <option style={{ color: 'black' }} value={2.0}>Discrimination Lawsuits</option>
            <option style={{ color: 'black' }} value={2.0}>Felony Offenses (non-violent)</option>
            <option style={{ color: 'black' }} value={1.0}>Homicide</option>
            <option style={{ color: 'black' }} value={1.0}>High-Profile Divorce</option>
            <option style={{ color: 'black' }} value={1.0}>Constitutional Law</option>
            <option style={{ color: 'black' }} value={1.0}>Complex Corporate Litigation</option>
          </Select>

          {/*violated bullet points*/}
          <HStack spacing={-1}>
          <Text fontSize="l" fontWeight="bold"  color={"whiteAlpha.900"} mb={1}>Violated Bullet-points</Text>
          <Tooltip label={infoBulletPoints} placement="right" hasArrow>
              <IconButton
                color="whiteAlpha.800"
                as="button"
                variant="ghost"
                colorScheme="whiteAlpha"
                aria-label="Warning"
                _hover={{ color: 'white' }}
                icon={<InfoIcon />}
                size="sm"
              />
            </Tooltip>
          </HStack>
          <NumberInput defaultValue={0} min={0} max={20} width="225px" marginBottom="20px" borderRadius="md" onChange={valueString => setBulletPoints(parseFloat(valueString))}>
            <NumberInputField name='bullet points' onChange={e => setBulletPoints(parseFloat(e.target.value))} placeholder="Bullet-points" borderRadius="md" />
            <NumberInputStepper borderRadius="md" width="32px">
              <NumberIncrementStepper color={"white"} borderRadius="md" />
              <NumberDecrementStepper color={"white"} borderRadius="md" />
            </NumberInputStepper>
          </NumberInput>

          {/*violated paragraphs*/}
          <HStack spacing={-1}>
            <Text fontSize="l" fontWeight="bold"  color={"whiteAlpha.900"} mb={1}>Violated Paragraphs</Text>
            <Tooltip label={infoParagraphs} placement="right" hasArrow>
                <IconButton
                  color="whiteAlpha.800"
                  as="button"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  aria-label="Warning"
                  _hover={{ color: 'white' }}
                  icon={<InfoIcon />}
                  size="sm"
                />
              </Tooltip>
          </HStack>
          <NumberInput defaultValue={0} min={0} max={20} width="225px" marginBottom="20px" borderRadius="md" onChange={valueString => setParagraphs(parseFloat(valueString))}>
            <NumberInputField onChange={e => setParagraphs(parseFloat(e.target.value))} placeholder="Paragraphs" borderRadius="md" />
            <NumberInputStepper borderRadius="md" width="32px">
              <NumberIncrementStepper color={"white"} borderRadius="md" />
              <NumberDecrementStepper color={"white"} borderRadius="md" />
            </NumberInputStepper>
          </NumberInput>

          {/*violated articles*/}
          <HStack spacing={-1}>
              <Text fontSize="l" fontWeight="bold" color={"whiteAlpha.900"} mb={1}>Violated Articles</Text>
              <Tooltip label={infoArticles} placement="right" hasArrow>
                  <IconButton
                      color="whiteAlpha.800"
                      as="button"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      aria-label="Warning"
                      _hover={{ color: 'white' }}
                      icon={<InfoIcon />}
                      size="sm"
                  />
              </Tooltip>
          </HStack>
          <NumberInput defaultValue={0} min={0} max={20} width="225px" marginBottom="20px" borderRadius="md" onChange={valueString => setArticles(parseFloat(valueString))}>
              <NumberInputField onChange={e => setArticles(parseFloat(e.target.value))} placeholder="Articles" borderRadius="md" />
              <NumberInputStepper borderRadius="md" width="32px">
                  <NumberIncrementStepper color={"white"} borderRadius="md" />
                  <NumberDecrementStepper color={"white"} borderRadius="md" />
              </NumberInputStepper>
          </NumberInput>


          {/*guilty*/}
          <HStack spacing={-1}>
            <Text fontSize="l" fontWeight="bold"  color={"whiteAlpha.900"} mb={1}>Guilty Status</Text>
            <Tooltip label={infoGuilty} placement="right" hasArrow>
                <IconButton
                  color="whiteAlpha.800"
                  as="button"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  aria-label="Warning"
                  _hover={{ color: 'white' }}
                  icon={<InfoIcon />}
                  size="sm"
                />
              </Tooltip>
          </HStack>
          <Select placeholder='Select one' onChange={e => setGuilty(e.target.value)} width="300px" marginBottom="20px" borderRadius="md">
            <option style={{ color: 'black' }} value={0.0}>Not Proven Guilty</option>
            <option style={{ color: 'black' }} value={1.0}>Proven Guilty</option>
          </Select>

          {/*submit button*/}
          <HStack spacing={-1}>
            <Button 
            onClick={handleSubmit} 
            colorScheme="blue" 
            borderRadius="md"
            backgroundColor='#00416a'
            _hover={{ backgroundColor: '#08457e' }}
            color={"#eef4f2"}
            >
              Estimate Cost
            </Button>
          </HStack>

        </Box>
        <Divider style={{position: "absolute", bottom: 10, left:700 }}  orientation="vertical" colorScheme="white" height="500px"/>
        <VStack color={"white"} marginTop="20px" spacing={20} fontSize="20px" p={20}>
          <Text fontSize="3xl" color={'whiteAlpha.900'} fontStyle={"italic"} mb={1}> For this specific case, a legal defense in the U.S will cost approx.</Text>
          <Box borderWidth={5} borderColor={'whiteAlpha.900'} borderRadius={20} p={2}>
            <Text fontSize="6xl" fontWeight="bold" mr={5} ml={5}> ${Math.floor(prediction / 10) * 10}</Text>
          </Box>
        </VStack>
      </HStack>
      
        
    </ChakraProvider>
  );
}

export default CasePred;