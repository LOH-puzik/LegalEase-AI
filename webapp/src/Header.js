import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { AiOutlineRobot } from 'react-icons/ai';

import Tec from './modals/Tec';
import FAQ from './modals/FAQ';
import Contact from './modals/Contact';


const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
`;

const Logo = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  color: #eef4f2;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
`;

const NavLink = styled.a`
  margin: 0 15px;
  font-size: 1.1em;
  font-weight: 600;
  color: #eef4f2;
  cursor: pointer;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  transition: color 0.3s ease;

  &:hover {
    color: #eef4f2;
  }
`;

function Header() {
  const [techModalOpen, setTechModalOpen] = useState(false);

  const openTechModal = () => {
    setTechModalOpen(true);
  };

  const closeTechModal = () => {
    setTechModalOpen(false);
  };

  const [faqModalOpen, setFAQModalOpen] = useState(false);

  const openFAQModal = () => {
    setFAQModalOpen(true);
  };

  const closeFAQModal = () => {
    setFAQModalOpen(false);
  };

  const [contModalOpen, setContModalOpen] = useState(false);

  const openContModal = () => {
    setContModalOpen(true);
  };

  const closeContModal = () => {
    setContModalOpen(false);
  };

  return (
    <>
      <HeaderBar>
        <Logo>
          <StyledLink to="/home">
            <AiOutlineRobot size={24} />
          </StyledLink>
        </Logo>
        <NavLinks>
          <NavLink>Features</NavLink>
          <NavLink onClick={openTechModal}>Technology</NavLink>
          <NavLink onClick={openFAQModal}>FAQ</NavLink>
          <NavLink onClick={openContModal}>Contact</NavLink>
        </NavLinks>
      </HeaderBar>
      {techModalOpen && <Tec onClose={closeTechModal} />}
      {faqModalOpen && <FAQ onClose={closeFAQModal} />}
      {contModalOpen && <Contact onClose={closeContModal} />}
    </>
  );
}

export default Header;