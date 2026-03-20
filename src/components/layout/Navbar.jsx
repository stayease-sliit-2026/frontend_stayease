import useAuth from '../../hooks/useAuth';

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<header
			style={{
				height: '72px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 24px',
				background: '#ffffff',
				borderBottom: '1px solid #e5e7eb',
			}}
		>
			<strong>StayEase</strong>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<span>{user?.email}</span>
				<button
					type="button"
					onClick={logout}
					style={{
						border: '1px solid #d0d5dd',
						borderRadius: '8px',
						padding: '8px 12px',
						background: '#fff',
						cursor: 'pointer',
					}}
				>
					Logout
				</button>
			</div>
		</header>
	);
}
