import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!email.trim()) {
			return;
		}

		login(email);
		navigate('/', { replace: true });
	};

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				padding: '24px',
			}}
		>
			<form
				onSubmit={handleSubmit}
				style={{
					width: '100%',
					maxWidth: '400px',
					background: '#ffffff',
					borderRadius: '12px',
					padding: '24px',
					boxShadow: '0 12px 30px rgba(16, 24, 40, 0.08)',
				}}
			>
				<h1 style={{ margin: '0 0 20px' }}>StayEase Login</h1>
				<label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
					style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
				/>
				<label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>
					Password
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
					style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
				/>
				<button
					type="submit"
					style={{
						width: '100%',
						border: 'none',
						borderRadius: '8px',
						padding: '11px',
						background: '#0f6fff',
						color: '#fff',
						cursor: 'pointer',
					}}
				>
					Sign in
				</button>
			</form>
		</main>
	);
}
