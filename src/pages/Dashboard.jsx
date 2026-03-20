import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function Dashboard() {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
			<Sidebar />
			<div>
				<Navbar />
				<main style={{ padding: '24px' }}>
					<h2 style={{ marginTop: 0 }}>Dashboard</h2>
					<p>Welcome to StayEase. Your project structure is now wired and running.</p>
				</main>
			</div>
		</div>
	);
}
