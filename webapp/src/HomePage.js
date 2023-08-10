import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { AiOutlineFileText} from 'react-icons/ai';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { GiScales } from 'react-icons/gi';
import { Box } from '@chakra-ui/react';


const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 150px;
`;

const LogoBox = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #057345;
  color: #eef4f2;
  cursor: pointer;
  font-weight: bold;
  border-radius: 6px;
  border: 3px solid #2fb681;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2fb681;
  }
`;

const ContentWrapper = styled.div`
  margin-top: 380px;
`;

const LogoTitlesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Titles = styled.h3`
  margin: 10px 0 0;
  font-size: 1.5em;
  font-weight: normal;
  color: #eef4f2;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  width: 260px;
  line-height: 1.3;
  white-space: pre-wrap;
`;

function HomePage() {

  return (
    <Box>
      <ContentWrapper>
        <Grid>
        <LogoTitlesWrapper>
            <Link to="/legal-doc-assistant">
                <LogoBox>
                <AiOutlineFileText size={90} />
                </LogoBox>
            </Link>
            <Titles>Document Analyzer</Titles>
          </LogoTitlesWrapper>
          <LogoTitlesWrapper>         
            <Link to="/ai-legal-counsel">
                <LogoBox>
                <RiQuestionAnswerLine size={90} />
                </LogoBox>
            </Link>
            <Titles>Legal Counsel</Titles>
          </LogoTitlesWrapper>          
          <LogoTitlesWrapper>
            <Link to="/case-predictor">
                <LogoBox>
                <GiScales size={90} />
                </LogoBox>
            </Link>
            <Titles>Lawyer Cost Estimator</Titles>
          </LogoTitlesWrapper>
        </Grid>
      </ContentWrapper>
    </Box> 
  );  
}  

export default HomePage;