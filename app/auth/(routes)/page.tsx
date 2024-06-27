'use client';

import dynamic from 'next/dynamic';

const Login = dynamic(() => import('../components/Login'), {
	ssr: false,
});

const LoginPage = () => {
	return (
		<div>
			<Login title="Welcome" />
		</div>
	);
};

export default LoginPage;
