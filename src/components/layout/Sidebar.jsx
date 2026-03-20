import { NavLink } from 'react-router-dom';

export default function Sidebar() {
	return (
		<aside
			style={{
				background: '#111827',
				color: '#f9fafb',
				padding: '20px 16px',
			}}
		>
			<h3 style={{ marginTop: 0 }}>Menu</h3>
			<nav style={{ display: 'grid', gap: '10px' }}>
				<NavLink to="/" style={{ color: '#f9fafb' }}>
					Dashboard
				</NavLink>
			</nav>
		</aside>
	);
}
