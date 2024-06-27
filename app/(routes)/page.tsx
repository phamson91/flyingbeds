'use client';

import { PATHS } from '@/lib/paths';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import Loader from '@/components/Loader';

const HomePage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(PATHS.DASHBOARD);
    } else {
      router.push(PATHS.LOGIN);
    }
  }, [router, user]);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default HomePage;
