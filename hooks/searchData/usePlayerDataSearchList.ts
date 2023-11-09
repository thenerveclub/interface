import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const usePlayerDataSearchList = (chainIdUrl: number, keyWord: string) => {
	const [playerSearchList, setPlayerSearchList] = useState<any[]>([]);

	useEffect(() => {
		if (!chainIdUrl) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setPlayerSearchList([]);
			return;
		}

		const getPlayerDataSearchList = async () => {
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
				const fetchPlayerData = await fetch(CHAINS[chainIdUrl]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerSearchList }),
				});

				const data = await fetchPlayerData.json();
				setPlayerSearchList(data.data.globalStats[0].users);
			} catch (error) {
				console.error(error);
			}
		};

		getPlayerDataSearchList();
	}, [chainIdUrl, keyWord]);

	return playerSearchList;
};

export default usePlayerDataSearchList;
