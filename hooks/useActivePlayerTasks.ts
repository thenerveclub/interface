import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTriggerSlice } from '../state/create/createTriggerSlice';
import { CHAINS } from '../utils/chains';

const useActivePlayerTasks = (checksumAddress: string) => {
	const [activePlayerTasks, setActivePlayerTasks] = useState<{ [chainId: string]: any[] }>({});
	const timestamp = Math.floor(Date.now() / 1000);

	// Redux
	const dispatch = useDispatch();
	const triggered = useSelector((state: { createTrigger: boolean }) => state.createTrigger);

	useEffect(() => {
		if (!checksumAddress) {
			// Handle the case where the checksumAddress is not ready or not valid
			setActivePlayerTasks({});

			return;
		}

		const getActivePlayerTasks = async () => {
			const QueryForActiveTasks = `
   {
      tasks(where: { endTask_gt:"${timestamp}", recipientAddress:"${checksumAddress}", finished: false }, orderBy:amount, orderDirection:desc, first: 100) 
      {
		 id
		 initiatorAddress
		 endTask
		 entranceAmount
		 negativeVotes
		 positiveVotes
		 participants
		 proofLink
		 description
		 amount
		 chainId
      }
    }
  `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForActiveTasks }),
					}).then((response) => response.json().then((data) => ({ [chainId]: data.data.tasks })));
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});
				console.log('combinedData', combinedData);
				setActivePlayerTasks(combinedData);
			} catch (error) {
				console.log(error);
				console.log('Error fetching TAD');
			}
		};

		// Refresh every 60 seconds
		// const interval = setInterval(getTAD, 60000);

		// Call the function on first page load
		getActivePlayerTasks();

		// Clear the interval on unmount
		// return () => clearInterval(interval);

		// Refresh the data when the chainId or checksumAddress changes
		dispatch(createTriggerSlice.actions.setCreateTrigger(false));
		console.log('triggered');
	}, [checksumAddress, triggered]);

	return activePlayerTasks;
};

export default useActivePlayerTasks;
