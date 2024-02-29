import { useEffect, useState } from 'react';

const usePlayerDataSearchList = (keyWord: string) => {
	const [playerSearchList, setPlayerSearchList] = useState<any[]>([]);

	useEffect(() => {
		const getPlayerDataSearchList = async () => {
			const QueryForPlayerSearchList = `
			 {
				domains(first: 10, where: {name: "${keyWord}.eth"}) {
				  name
				  resolver {
					 addr {
						id
					 }
				  }
				}
			 }
      `;

			try {
				const fetchPlayerData = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerSearchList }),
				});

				const data = await fetchPlayerData.json();
				setPlayerSearchList(data.data.domains);
			} catch (error) {
				console.error(error);
			}
		};

		getPlayerDataSearchList();
	}, [keyWord]);

	return playerSearchList;
};

export default usePlayerDataSearchList;
