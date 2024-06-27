import Header from '@/components/header/Header';
import Logo from '@/components/sidebar/Logo';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<>
			<div>
				<Header />
				<div className="z-10 fixed bg-white hidden md:flex flex-col gap-y-4 w-[240px] px-5 pt-2">
					<Logo />
				</div>
			</div>
			<div>
				<main className="pt-20">{children}</main>
			</div>
		</>
	);
};

export default DashboardLayout;
