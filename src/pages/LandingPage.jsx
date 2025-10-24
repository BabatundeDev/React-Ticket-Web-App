import './LandingPage.css';
import waveSvg from '../assets/hero-wave.svg';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Ticket Web App</h1>
          <p>Manage your tickets effortlessly across teams and timelines.</p>

          <div className="cta-buttons">
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Get Started</button></Link>
          </div>
        </div>

        <img src={waveSvg} alt="Wave background" className="wave" />
        <div className="circle-decor"></div>
      </header>

      <section className="features">
        <div className="feature-box">Secure Authentication</div>
        <div className="feature-box">Real-Time Ticket Updates</div>
        <div className="feature-box">Responsive Design</div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Ticket Web App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
