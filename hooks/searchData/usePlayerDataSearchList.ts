import { useEffect, useState } from 'react';

const usePlayerDataSearchList = (keyWord: string) => {
	const [playerSearchList, setPlayerSearchList] = useState<any[]>([]);

	useEffect(() => {
		const getPlayerDataSearchList = async () => {
			// Check if the keyword is an Ethereum address
			const isEthereumAddress = keyWord.startsWith('0x') && keyWord.length === 42;
			const searchKeyword = isEthereumAddress ? keyWord : keyWord.endsWith('.eth') ? keyWord : `${keyWord}.eth`;

			let query;

			if (isEthereumAddress) {
				// Query for resolvers by address
				query = `
          {
            resolvers(where: { addr: "${searchKeyword}" }) {
              id
              domain {
                name
              }
            }
          }
        `;
			} else {
				// Query by domain name
				query = `
          {
            domains(first: 10, where: { name: "${searchKeyword}" }) {
              name
              resolver {
                addr {
                  id
                }
              }
            }
          }
        `;
			}

			try {
				const fetchPlayerData = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: query }),
				});

				const data = await fetchPlayerData.json();

				if (isEthereumAddress) {
					// Handle response from resolvers query
					if (data.data.resolvers.length === 0) {
						setPlayerSearchList([
							{
								name: '',
								resolver: { addr: { id: searchKeyword } },
							},
						]);
					} else {
						const domains = data.data.resolvers.map((resolver) => ({
							name: resolver.domain.name,
							resolver: { addr: { id: searchKeyword } },
						}));
						setPlayerSearchList(domains);
					}
				} else {
					// Handle response from domains query
					if (data.data.domains.length === 0 || data.data.domains[0].resolver === null) {
						setPlayerSearchList([]);
					} else {
						setPlayerSearchList(data.data.domains);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};

		getPlayerDataSearchList();
	}, [keyWord]);

	return playerSearchList;
};

export default usePlayerDataSearchList;
