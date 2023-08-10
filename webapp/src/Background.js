import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: radial-gradient(circle at 50% 100%, #04202d, #057345);
  background-size: 200% 200%;
  animation: gradientAnimation 14s ease infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
`;

const randomPositions = () => {
    const positions = [];
    for (let i = 0; i < 4; i++) {
      positions.push({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
      });
    }
    return positions;
  };
  
  const positions = randomPositions();
  
  const gradientAnimation = css`
    @keyframes gradientAnimation {
      0% {
        background-position: ${positions[0].x}% ${positions[0].y}%;
      }
      25% {
        background-position: ${positions[1].x}% ${positions[1].y}%;
      }
      50% {
        background-position: ${positions[2].x}% ${positions[2].y}%;
      }
      75% {
        background-position: ${positions[3].x}% ${positions[3].y}%;
      }
      100% {
        background-position: ${positions[0].x}% ${positions[0].y}%;
      }
    }
  `;

function Background() {
    return (
        <Container>
            <Global styles={gradientAnimation} />
        </Container>
    );
  };
  
export default Background;