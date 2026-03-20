import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				textAlign: 'center',
				padding: '24px',
			}}
		>
			<section>
				<h1 style={{ fontSize: '56px', margin: '0 0 8px' }}>404</h1>
				<p style={{ marginBottom: '16px' }}>The page you requested was not found.</p>
				<Link to="/" style={{ color: '#0f6fff', fontWeight: 600 }}>
					Go back home
				</Link>
			</section>
		</main>
	);
}
