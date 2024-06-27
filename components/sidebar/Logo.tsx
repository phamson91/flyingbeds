import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center cursor-pointer">
      <Image
        alt="logo"
        className="hidden md:block"
        height="40"
        width="40"
        src="/images/logo.svg"
      />
      <p className="px-4 text-lg font-medium">DOB Tech</p>
    </div>
  );
};

export default Logo;
