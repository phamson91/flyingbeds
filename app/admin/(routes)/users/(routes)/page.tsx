import getUsers from '@/actions/getUsers';
import Heading from '@/components/Heading';
import { PATHS } from '@/lib/paths';
import Link from 'next/link';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/Button';
import AgentTable from '../components/AgentTable';

const AgentsPage = async () => {
	const users = await getUsers();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title="Manage Agents" />
				<Link href={PATHS.ADMIN_USERS_ADD}>
					<Button data-testid="btnAddAgent" type="button">
						<AiOutlinePlus />
					</Button>
				</Link>
			</div>
			<AgentTable users={users} />
		</>
	);
};

export default AgentsPage;
