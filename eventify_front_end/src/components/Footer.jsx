import { useState } from 'react';
import { 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, 
  FiMail, FiMessageSquare, FiArrowUp 
} from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  window.addEventListener('scroll', toggleVisibility);

  return (
    <footer className="site-footer">
      {/* Back to Top Button (animated) */}
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="back-to-top hover-grow"
          aria-label="Back to top"
        >
          <FiArrowUp className="arrow-icon" />
        </button>
      )}

      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-logo">Eventify</h3>
          <p className="footer-description">
            Connecting innovators with opportunities through events and networking.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon hover-bounce" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" className="social-icon hover-bounce" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="social-icon hover-bounce" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" className="social-icon hover-bounce" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#" className="hover-underline">Home</a></li>
            <li><a href="#" className="hover-underline">Events</a></li>
            <li><a href="#" className="hover-underline">Startups</a></li>
            <li><a href="#" className="hover-underline">Advisors</a></li>
            <li><a href="#" className="hover-underline">Investors</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li><a href="#" className="hover-underline">Blog</a></li>
            <li><a href="#" className="hover-underline">Help Center</a></li>
            <li><a href="#" className="hover-underline">Pitch Guide</a></li>
            <li><a href="#" className="hover-underline">Event Calendar</a></li>
            <li><a href="#" className="hover-underline">Success Stories</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h4 className="footer-heading">Stay Updated</h4>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
            </div>
            <button type="submit" className="subscribe-btn hover-grow">
              Subscribe
            </button>
          </form>
          {isSubscribed && (
            <div className="success-message animate-bounce-in">
              Thanks for subscribing!
            </div>
          )}
          <div className="contact-info">
            <FiMessageSquare className="contact-icon" />
            <a href="mailto:hello@eventify.com" className="hover-underline">
              hello@eventify.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright-section">
        <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
        <div className="legal-links">
          <a href="#" className="hover-underline">Privacy Policy</a>
          <a href="#" className="hover-underline">Terms of Service</a>
          <a href="#" className="hover-underline">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;