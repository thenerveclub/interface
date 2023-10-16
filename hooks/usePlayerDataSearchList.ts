import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePlayerDataSearchList = (chainId: number, keyWord: string) => {
	const [playerSearchList, setPlayerSearchList] = useState<any[]>([]);

	useEffect(() => {
		const getPlayerData = async () => {
			const QueryForPlayerSearchList = `
			{
				globalStats {
				  userCount
				  users(first: 10, where: {userName_starts_with_nocase: "${keyWord}"}) {
					 id
					 userName
					 userAddress
				  }
				}
			 }
      `;

			// search for address as well, currently not possible because userAddress is Bytes! type and not String! type
			// users(first: 10, where: { or: [{userName_starts_with_nocase: "${keyWord}"}, {userAddress_starts_with_nocase: "${keyWord}"}] }) {

			try {
				const fetchPlayerData = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerSearchList }),
				});

				const data = await fetchPlayerData.json();
				console.log(data.data.globalStats[0].users);
				setPlayerSearchList(data.data.globalStats[0].users);
			} catch (error) {
				console.error(error);
			}
		};

		getPlayerData();
	}, [chainId, keyWord]);

	return playerSearchList;
};

export default usePlayerDataSearchList;
