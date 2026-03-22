import Navbar from '../components/layout/Navbar';

const heroImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
const roomImg = 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80';
const poolImg = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80';
const cityImg = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80';
const partnerLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/6/6e/Booking.com_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7e/Expedia_Logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2e/Agoda_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2b/TripAdvisor_Logo.svg',
];

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #0a2342 60%, #1e3a5c 100%)',
      color: '#fff',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 70% 10%, #4fd1c5 0%, transparent 60%)',
        opacity: 0.18,
      }} />
      <Navbar />
      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '7vw 4vw 5vw',
          gap: 64,
          maxWidth: 1400,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            flex: '1 1 420px',
            minWidth: 260,
            maxWidth: 600,
            marginBottom: 32,
          }}
        >
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 18, letterSpacing: '-2px', lineHeight: 1.08, textShadow: '0 2px 16px rgba(10,35,66,0.18)' }}>
            Book Your Dream Stay<br />with <span style={{ color: '#4fd1c5' }}>StayEase</span>
          </h1>
          <p style={{ fontSize: '1.35rem', marginBottom: 32, color: '#e0e7ef', maxWidth: 520, textShadow: '0 1px 8px rgba(10,35,66,0.10)' }}>
            Discover the best hotels, resorts, and apartments worldwide. Enjoy exclusive deals, stunning rooms, and world-class service—all in one place.
          </p>
          {/* Booking Search Mockup */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(10,35,66,0.10)',
            padding: '18px 20px',
            marginBottom: 28,
            maxWidth: 420,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}>
            <input placeholder="Where to?" style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1.1rem', padding: '10px', borderRadius: 8 }} />
            <input type="date" style={{ border: 'none', outline: 'none', fontSize: '1.1rem', padding: '10px', borderRadius: 8 }} />
            <button style={{ background: '#0a2342', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
              onMouseOut={e => e.currentTarget.style.background = '#0a2342'}
            >Search</button>
          </div>
          <a href="/register" style={{
            background: 'linear-gradient(90deg, #4fd1c5 0%, #2563eb 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '10px',
            padding: '18px 44px',
            fontSize: '1.2rem',
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(10,35,66,0.12)',
            transition: 'background 0.2s, color 0.2s',
            display: 'inline-block',
            marginTop: 8,
            marginRight: 16,
          }}>Get Started</a>
          <a href="/profile" style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #4fd1c5 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '10px',
            padding: '18px 44px',
            fontSize: '1.2rem',
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(10,35,66,0.12)',
            transition: 'background 0.2s, color 0.2s',
            display: 'inline-block',
            marginTop: 8,
          }}>My Profile</a>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <a href="/register" style={{
              background: 'linear-gradient(90deg, #4fd1c5 0%, #2563eb 100%)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '10px',
              padding: '18px 44px',
              fontSize: '1.2rem',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(10,35,66,0.12)',
              transition: 'background 0.2s, color 0.2s',
              display: 'inline-block',
            }}>Get Started</a>
            <a href="/hotel-service/" style={{
              background: 'transparent',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '10px',
              padding: '18px 36px',
              fontSize: '1.2rem',
              textDecoration: 'none',
              border: '2px solid #4fd1c5',
              boxShadow: '0 4px 24px rgba(10,35,66,0.10)',
              transition: 'background 0.2s, color 0.2s',
              display: 'inline-block',
            }}>Explore Hotels</a>
          </div>
        </div>
        <div style={{
          flex: '1 1 420px',
          minWidth: 220,
          maxWidth: 540,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 32,
            boxShadow: '0 8px 32px rgba(10,35,66,0.18)',
            padding: 0,
            overflow: 'hidden',
            width: '100%',
            maxWidth: 540,
            margin: '0 auto',
            display: 'block',
          }}>
            <img
              src={heroImg}
              alt="Hotel lobby"
              style={{
                width: '100%',
                display: 'block',
                minHeight: 320,
                maxHeight: 420,
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section style={{
        background: 'rgba(255,255,255,0.10)',
        padding: '36px 0 24px',
        margin: '0 auto',
        maxWidth: 1200,
        borderRadius: 24,
        boxShadow: '0 2px 16px rgba(10,35,66,0.08)',
        marginBottom: 32,
      }}>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', textAlign: 'center', marginBottom: 24, letterSpacing: '-1px' }}>
          What Our Guests Say
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          <div style={{ background: '#fff', color: '#0a2342', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,35,66,0.10)', maxWidth: 340, padding: 24, minWidth: 220 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 12 }}>
              “StayEase made booking my vacation so easy and stress-free. The hotel was beautiful and the service was top-notch!”
            </p>
            <div style={{ fontWeight: 700 }}>— Sarah W.</div>
          </div>
          <div style={{ background: '#fff', color: '#0a2342', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,35,66,0.10)', maxWidth: 340, padding: 24, minWidth: 220 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 12 }}>
              “I found the best deals on StayEase and the booking process was seamless. Highly recommend!”
            </p>
            <div style={{ fontWeight: 700 }}>— James L.</div>
          </div>
          <div style={{ background: '#fff', color: '#0a2342', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,35,66,0.10)', maxWidth: 340, padding: 24, minWidth: 220 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 12 }}>
              “The variety of hotels and the quality of service exceeded my expectations. Will book again!”
            </p>
            <div style={{ fontWeight: 700 }}>— Priya S.</div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section style={{ background: 'rgba(255,255,255,0.07)', padding: '18px 0 12px', textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {partnerLogos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="Partner"
              style={{
                height: 32,
                maxWidth: 120,
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
                margin: '8px 0',
                width: 'auto',
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 28,
          justifyContent: 'center',
          alignItems: 'stretch',
          padding: '7vw 4vw 7vw',
          maxWidth: 1300,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: '#fff',
            color: '#0a2342',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(10,35,66,0.10)',
            flex: '1 1 320px',
            minWidth: 220,
            maxWidth: 400,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '12px 0',
          }}
        >
          <img src={roomImg} alt="Luxury Room" style={{ width: '100%', maxWidth: 220, borderRadius: 12, marginBottom: 18 }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', margin: '12px 0 8px' }}>Luxury Rooms</h2>
          <p style={{ textAlign: 'center', color: '#334e68' }}>Experience comfort and elegance in our handpicked selection of luxury hotel rooms, designed for your relaxation.</p>
        </div>
        <div style={{ background: '#fff', color: '#0a2342', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,35,66,0.10)', flex: '1 1 320px', minWidth: 260, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={poolImg} alt="Infinity Pool" style={{ width: '100%', maxWidth: 220, borderRadius: 12, marginBottom: 18 }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', margin: '12px 0 8px' }}>Stunning Pools</h2>
          <p style={{ textAlign: 'center', color: '#334e68' }}>Relax and unwind in breathtaking pools with beautiful views, available at select hotels worldwide.</p>
        </div>
        <div style={{ background: '#fff', color: '#0a2342', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,35,66,0.10)', flex: '1 1 320px', minWidth: 260, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={cityImg} alt="City View" style={{ width: '100%', maxWidth: 220, borderRadius: 12, marginBottom: 18 }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', margin: '12px 0 8px' }}>Prime Locations</h2>
          <p style={{ textAlign: 'center', color: '#334e68' }}>Stay close to the action with hotels in the heart of the world’s most exciting cities and destinations.</p>
        </div>
      </section>

      {/* How It Works Stepper */}
      <section
        style={{
          background: 'rgba(10,35,66,0.97)',
          padding: '7vw 4vw',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 32 }}>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ flex: '1 1 220px', minWidth: 200, padding: 18 }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🔍</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Search Hotels</h3>
            <p style={{ color: '#cbd5e1' }}>Browse thousands of hotels, resorts, and apartments worldwide with advanced filters.</p>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200, padding: 18 }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>💳</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Book & Pay</h3>
            <p style={{ color: '#cbd5e1' }}>Reserve your room securely with instant confirmation and multiple payment options.</p>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200, padding: 18 }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🛏️</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Enjoy Your Stay</h3>
            <p style={{ color: '#cbd5e1' }}>Check in, relax, and enjoy your trip with 24/7 support from StayEase.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          background: '#fff',
          color: '#0a2342',
          padding: '7vw 4vw',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>What Our Customers Say</h2>
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: '#f5f7fb', borderRadius: 16, boxShadow: '0 2px 12px rgba(10,35,66,0.06)', flex: '1 1 320px', minWidth: 260, padding: 32 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 18 }}>
              “StayEase made booking my vacation so easy and stress-free. The hotel was beautiful and the service was top-notch!”
            </p>
            <div style={{ fontWeight: 700 }}>— Sarah W.</div>
          </div>
          <div style={{ background: '#f5f7fb', borderRadius: 16, boxShadow: '0 2px 12px rgba(10,35,66,0.06)', flex: '1 1 320px', minWidth: 260, padding: 32 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 18 }}>
              “I found the perfect hotel for my business trip in minutes. Highly recommend StayEase to everyone!”
            </p>
            <div style={{ fontWeight: 700 }}>— James L.</div>
          </div>
          <div style={{ background: '#f5f7fb', borderRadius: 16, boxShadow: '0 2px 12px rgba(10,35,66,0.06)', flex: '1 1 320px', minWidth: 260, padding: 32 }}>
            <p style={{ fontStyle: 'italic', marginBottom: 18 }}>
              “The booking process was smooth and the support team was always available. Will use again!”
            </p>
            <div style={{ fontWeight: 700 }}>— Priya S.</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        style={{
          background: 'rgba(10,35,66,0.95)',
          padding: '7vw 4vw',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 18 }}>Why Choose StayEase?</h2>
        <p style={{ fontSize: '1.15rem', maxWidth: 700, margin: '0 auto 18px', color: '#cbd5e1' }}>
          StayEase is your trusted partner for hotel bookings. We offer a seamless experience, secure payments, and 24/7 support. Whether you’re planning a business trip or a family vacation, we help you find the perfect stay at the best price.
        </p>
        <a href="/register" style={{
          background: '#4fd1c5',
          color: '#0a2342',
          fontWeight: 700,
          borderRadius: '10px',
          padding: '14px 36px',
          fontSize: '1.1rem',
          textDecoration: 'none',
          marginTop: 18,
          display: 'inline-block',
        }}>Create Your Account</a>
      </section>
    </div>
  );
}
