import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

interface FooterProps {
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({ companyName = 'Game Key Marketplace' }) => {
  return (
    <footer className="footer-info py-3 mt-auto">
      <Container>
        <small>&copy; {new Date().getFullYear()} {companyName}</small>
      </Container>
    </footer>
  );
};

export default Footer;