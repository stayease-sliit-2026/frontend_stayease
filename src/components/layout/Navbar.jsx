import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const navLinks = [
	{ to: '/', label: 'Home' },
	{ to: '/hotel-service', label: 'Explore Hotels' },
	{ to: '/booking-service/my-bookings', label: 'My Bookings' },
	{ to: '/payments', label: 'Payments' },
	{ to: '/register', label: 'Register' },
	{ to: '/login', label: 'Login' },
];

export default function Navbar() {
	const { user, logout } = useAuth();
	const location = useLocation();
	const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
	const [menuOpen, setMenuOpen] = useState(false);

	// Responsive styles
	const navStyle = {
		height: 72,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0 5vw',
		background: '#0a2342',
		color: '#fff',
		borderBottom: '2px solid #4fd1c5',
		position: 'sticky',
		top: 0,
		zIndex: 100,
		boxShadow: '0 2px 12px rgba(10,35,66,0.08)',
		minWidth: 0,
	};

	const logoStyle = {
		color: '#fff',
		fontWeight: 900,
		fontSize: '1.7rem',
		letterSpacing: '-1px',
		textDecoration: 'none',
		display: 'flex',
		alignItems: 'center',
		gap: 8,
	};

	const linksStyle = {
		display: 'flex',
		gap: 28,
		alignItems: 'center',
		fontWeight: 600,
		fontSize: '1.08rem',
	};

	const mobileMenuStyle = {
		display: menuOpen ? 'flex' : 'none',
		flexDirection: 'column',
		position: 'absolute',
		top: 72,
		right: 0,
		background: '#0a2342',
		width: '100vw',
		boxShadow: '0 4px 24px rgba(10,35,66,0.18)',
		padding: '24px 0',
		zIndex: 200,
		alignItems: 'center',
		gap: 24,
	};

	// Hide nav links on mobile
	const isMobile = typeof window !== 'undefined' && window.innerWidth < 800;

	return (
		<header style={navStyle}>
			<Link to="/" style={logoStyle}>
				<span style={{ color: '#4fd1c5', fontSize: '2rem' }}>🏨</span> StayEase
			</Link>
			{!isAuthPage && (
				<>
					<nav className="desktop-nav" style={{ ...linksStyle, display: isMobile ? 'none' : 'flex' }}>
						{navLinks.map(link => (
							<Link key={link.to} to={link.to} style={{ color: '#fff', textDecoration: 'none', borderBottom: location.pathname === link.to ? '2px solid #4fd1c5' : 'none', paddingBottom: 2 }}>{link.label}</Link>
						))}
						{user && (
							<button
								type="button"
								onClick={logout}
								style={{
									border: '1px solid #4fd1c5',
									borderRadius: '8px',
									padding: '8px 12px',
									background: 'transparent',
									color: '#fff',
									cursor: 'pointer',
									fontWeight: 600,
									marginLeft: 12,
								}}
							>
								Logout
							</button>
						)}
					</nav>
					{/* Hamburger for mobile */}
					<button
						className="mobile-menu-btn"
						aria-label="Open menu"
						style={{
							display: isMobile ? 'block' : 'none',
							background: 'none',
							border: 'none',
							color: '#fff',
							fontSize: 32,
							cursor: 'pointer',
							marginLeft: 18,
						}}
						onClick={() => setMenuOpen(m => !m)}
					>
						{menuOpen ? '✖' : '☰'}
					</button>
					{/* Mobile menu */}
					{isMobile && menuOpen && (
						<nav className="mobile-nav" style={mobileMenuStyle}>
							{navLinks.map(link => (
								<Link key={link.to} to={link.to} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', borderBottom: location.pathname === link.to ? '2px solid #4fd1c5' : 'none', paddingBottom: 2 }} onClick={() => setMenuOpen(false)}>{link.label}</Link>
							))}
							{user && (
								<button
									type="button"
									onClick={() => { logout(); setMenuOpen(false); }}
									style={{
										border: '1px solid #4fd1c5',
										borderRadius: '8px',
										padding: '10px 18px',
										background: 'transparent',
										color: '#fff',
										cursor: 'pointer',
										fontWeight: 600,
										marginTop: 12,
									}}
								>
									Logout
								</button>
							)}
						</nav>
					)}
				</>
			)}
		</header>
	);
}
