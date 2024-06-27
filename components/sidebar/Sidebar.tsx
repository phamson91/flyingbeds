'use client';

import SidebarItem from './SidebarItem';
import Logo from './Logo';
import { IconType } from 'react-icons';

type Route = {
  icon: IconType;
  label: string;
  href: string;
};

interface SidebarProps {
  children: React.ReactNode;
  routes: Route[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, routes }) => {
  return (
    <>
      <div className="z-10 h-full fixed bg-white hidden md:flex flex-col gap-y-4 w-[240px] px-5 py-4">
        <div className="mb-8">
          <Logo />
        </div>
        {routes.map((route) => (
          <SidebarItem key={route.href} {...route} />
        ))}
      </div>
      <main className="ml-[240px]">{children}</main>
    </>
  );
};

export default Sidebar;
