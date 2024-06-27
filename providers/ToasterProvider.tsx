'use client';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const ToasterProvider = () => {
	return (
		<Toaster
			toastOptions={{
				duration: 8000,
			}}
		>
			{(t) => (
				<ToastBar toast={t}>
					{({ icon, message }) => (
						<>
							{icon}
							{message}
							{t.type !== 'loading' && (
								<button onClick={() => toast.dismiss(t.id)}>
									<FaTimes className="text-sm w-4 h-4" />
								</button>
							)}
						</>
					)}
				</ToastBar>
			)}
		</Toaster>
	);
};

export default ToasterProvider;
