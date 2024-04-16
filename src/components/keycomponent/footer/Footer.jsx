import React from 'react';
import './footer.css'; // Assume you have a CSS file for styling

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <ul>
            <li>Udemy Business</li>
            <li>Teach on Udemy</li>
            <li>Get the app</li>
            <li>About us</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <li>Careers</li>
            <li>Blog</li>
            <li>Help and Support</li>
            <li>Affiliate</li>
            <li>Investors</li>
          </ul>
        </div>
        <div className="footer-section">
          <ul>
            <li>Terms</li>
            <li>Privacy policy</li>
            <li>Cookie settings</li>
            <li>Sitemap</li>
            <li>Accessibility statement</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
          <img src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy-inverted.svg" />
        </div>
        <div className="footer-copy">
          <p>© 2024 Udemy, Inc.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
