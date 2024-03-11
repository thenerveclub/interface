import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { claimTriggerSlice } from '../../state/trigger/claimTriggerSlice';
import { joinTriggerSlice } from '../../state/trigger/joinTriggerSlice';
import { proveTriggerSlice } from '../../state/trigger/proveTriggerSlice';
import { redeemTriggerSlice } from '../../state/trigger/redeemTriggerSlice';
import { voteTriggerSlice } from '../../state/trigger/voteTriggerSlice';
import { CHAINS } from '../../utils/chains';

const useDareData = (network: string, taskId: string) => {
	const [dareData, setDareData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Redux
	const dispatch = useDispatch();
	const claimTrigger = useSelector((state: { claimTrigger: boolean }) => state.claimTrigger);
	const joinTrigger = useSelector((state: { joinTrigger: boolean }) => state.joinTrigger);
	const redeemTrigger = useSelector((state: { redeemTrigger: boolean }) => state.redeemTrigger);
	const voteTrigger = useSelector((state: { voteTrigger: boolean }) => state.voteTrigger);
	const proveTrigger = useSelector((state: { proveTrigger: boolean }) => state.proveTrigger);

	useEffect(() => {
		setIsLoading(true);

		if (!network || !taskId || (!network && !taskId)) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setDareData([]);
			setIsLoading(false);
			return;
		}

		const getDareData = async () => {
			const QueryForDareData = `
          {
            userTasks(where: {task_: {id: "${taskId}"}}) {
               id
               userAddress
               userStake
               blockNumber
               endTask
               finished
               vote
               voted
              task {
               id
               initiatorAddress
               recipientAddress
               amount
               chainId
               description
               endTask
               entranceAmount
               executed
               finished
               negativeVotes
               participants
               positiveVotes
               proofLink
              }
            }
          }
      `;

			try {
				const fetchDareData = await fetch(CHAINS[network]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDareData }),
				});

				const data = await fetchDareData.json();
				setDareData(data.data.userTasks);
			} catch (error) {
				console.error(error);
				setDareData([]);
			} finally {
				setIsLoading(false);
			}
		};

		getDareData();
		dispatch(claimTriggerSlice.actions.setClaimTrigger(false));
		dispatch(joinTriggerSlice.actions.setJoinTrigger(false));
		dispatch(redeemTriggerSlice.actions.setRedeemTrigger(false));
		dispatch(voteTriggerSlice.actions.setVoteTrigger(false));
		dispatch(proveTriggerSlice.actions.setProveTrigger(false));

		console.log('triggered new dare data fetch');
	}, [network, taskId, claimTrigger, joinTrigger, redeemTrigger, voteTrigger, proveTrigger, dispatch]);

	return { dareData, isLoading };
};

export default useDareData;
