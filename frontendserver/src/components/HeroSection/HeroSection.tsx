import { Button } from "react-bootstrap";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section py-5">
      <div className="container">
        <div className="text-center mx-auto">
          <h1 className="hero-title display-1 mb-3">Your Favorite Games,<br/> Unbeatable Prices</h1>
          <p className="hero-subtitle fs-4 mb-4">Instant delivery on verified game keys from trusted sellers worldwide.</p>
          <Button className="btn-add-cart w-50 py-2 rounded-0" onClick={() => {
            navigate("/list");
            window.scrollTo(0, 0);
          }}>
            Browse Games
          </Button>
          <div className="trust-indicators">
            <div className="trust-item">
              <div className="trust-icon-box">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <span>Verified Sellers</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <span>Instant Delivery</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <span>Secure Payment</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <i className="bi bi-award-fill"></i>
              </div>
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
