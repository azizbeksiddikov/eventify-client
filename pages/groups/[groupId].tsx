import { useRouter } from 'next/router';
import ChosenGroup from '@/libs/components/group/ChosenGroup';

const GroupPage = () => {
	const router = useRouter();
	const { groupId } = router.query;

	if (!groupId || typeof groupId !== 'string') {
		return <div>Loading...</div>;
	}

	return <ChosenGroup groupId={groupId} />;
};

export default GroupPage;
