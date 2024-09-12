import React from 'react';
import { InstagramIcon, LinkedInIcon, PortfolioIcon, TikTokIcon, YouTubeIcon } from '../Hooks/IconsFaFooter';
import '../css/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <h2>CanepaDev - Software Solutions</h2>
      <ul className="social-icons">
        <li>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />
          </a>
        </li>
        <li>
          <a href="https://your-portfolio-link.com" target="_blank" rel="noopener noreferrer">
            <PortfolioIcon />
          </a>
        </li>
        <li>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
            <TikTokIcon />
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <YouTubeIcon />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
