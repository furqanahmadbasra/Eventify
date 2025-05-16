import { useNavigate } from 'react-router-dom';
import { FiSearch, FiZap, FiArrowRight, FiPlay, FiUsers, FiCalendar, FiAward, FiDollarSign } from 'react-icons/fi';
import '../styles/Home.css';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
       <ParticleBackground /> {/* ✅ Always placed here */}
      {/* Animated Background Elements */}
      <div className="bg-circle-1"></div>
      <div className="bg-circle-2"></div>
      <div className="bg-grid"></div>


      {/* Add particle background here */}
      {/* <ParticleBackground /> */}

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section animate-fade-in">
          <h1 className="hero-title">
            <span className="title-gradient">Eventify</span> - Where Events Meet Innovation
          </h1>
          <p className="hero-subtitle">
            Discover local events, showcase your ideas, and connect with investors - all in one platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="features-container">
          <div className="feature-card animate-slide-up delay-100">
            <div className="card-icon">
              <FiSearch className="icon" />
            </div>
            <h3>Event Discovery</h3>
            <p>
              Find workshops, seminars, and competitions near you with our smart search and interactive map.
            </p>
            <button
              onClick={() => navigate('/eventlookup')}
              className="nav-button hover-grow"
            >
              Browse Events <FiArrowRight className="button-icon" />
            </button>
          </div>

          <div className="feature-card animate-slide-up delay-200">
            <div className="card-icon">
              <FiZap className="icon" />
            </div>
            <h3>Startup Platform</h3>
            <p>
              Event winners can showcase their ideas to advisors and potential investors.
            </p>
            <button
              onClick={() => navigate('/startup')}
              className="nav-button hover-grow"
            >
              Explore Startups <FiArrowRight className="button-icon" />
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works animate-fade-in delay-300">
          <h2>How Eventify Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <p>Find and attend local events</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Participate and showcase your skills</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Connect with mentors and investors</p>
            </div>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="video-section animate-fade-in">
          <h2>See Eventify in Action</h2>
          <div className="video-container">
            <div className="video-placeholder">
              <FiPlay className="play-icon" />
              <img src="/eventify-preview.jpg" alt="Eventify platform preview" />
            </div>
            <p className="video-caption">Watch our 2-minute demo to see how Eventify can transform your event experience</p>
          </div>
        </div>

        {/* Advanced Features Section */}
        <div className="advanced-features animate-fade-in">
          <h2>Why Choose Eventify?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FiUsers className="feature-icon" />
              <h3>Community Network</h3>
              <p>Join innovators, creators, and investors in our growing ecosystem.</p>
            </div>
            <div className="feature-item">
              <FiCalendar className="feature-icon" />
              <h3>Smart Matching</h3>
              <p>Our AI recommends events and connections based on your interests and skills.</p>
            </div>
            <div className="feature-item">
              <FiAward className="feature-icon" />
              <h3>Talent Recognition</h3>
              <p>Top performers get featured in our monthly showcase viewed by investors.</p>
            </div>
            <div className="feature-item">
              <FiDollarSign className="feature-icon" />
              <h3>Funding Opportunities</h3>
              <p>Access to potential funding through our investor network.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials animate-fade-in">
          <h2>What Our Users Say</h2>
          <div className="testimonial-cards">
            <div className="testimonial">
              <p>"Eventify helped me connect with three investors who believed in my project. We secured $250k in funding!"</p>
              <div className="user-info">
                <img src="/user1.png" alt="Sarah K." className="user-avatar" />
                <span>Sarah K., Founder of EcoPack</span>
              </div>
            </div>
            <div className="testimonial">
              <p>"As an investor, I've found three promising startups through Eventify that I'm now mentoring."</p>
              <div className="user-info">
                <img src="/user2.png" alt="Michael T." className="user-avatar" />
                <span>Michael T., Angel Investor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="upcoming-events animate-fade-in">
          <h2>Upcoming Featured Events</h2>
          <div className="event-cards">
            <div className="event-card">
              <div className="event-date1">
                <span className="day">15</span>
                <span className="month">JUN</span>
              </div>
              <div className="event-details">
                <h3>Tech Innovation Summit</h3>
                <p>San Francisco | $50,000 prize pool</p>
                <button className="event-button">Learn More</button>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date1">
                <span className="day">22</span>
                <span className="month">JUL</span>
              </div>
              <div className="event-details">
                <h3>Startup Pitch Battle</h3>
                <p>Virtual Event | Investor panel</p>
                <button className="event-button">Learn More</button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section animate-fade-in">
          <h2>Ready to Join the Eventify Community?</h2>
          <p>Whether you're looking to attend events, showcase your talent, or find promising startups, Eventify has you covered.</p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => navigate('/profile')}>
              Join Now
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/eventlookup')}>
              Browse Events
            </button>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Home;