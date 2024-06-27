import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DeleteRowProps {
  table: string;
  id: string;
}

const deleteRow = async ({ table, id }: DeleteRowProps): Promise<void> => {
  const supabase = createClientComponentClient({});

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export default deleteRow;
