import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ToggleActiveStatusProps {
  userId: string;
  activeStatus: boolean;
}

const toggleActiveStatus = async ({
  userId,
  activeStatus,
}: ToggleActiveStatusProps): Promise<void> => {
  const supabase = createClientComponentClient({});

  const { error } = await supabase
    .from('users')
    .update({ is_operating: activeStatus })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
};

export default toggleActiveStatus;
