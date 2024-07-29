import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get('url');

	if (!url) {
		return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
	}

	try {
		let finalUrl = url;

		if (url.startsWith('eip155:')) {
			const [, chainId, contractType, contractAddress, tokenId] = url.split(':');
			if (contractType === 'erc721') {
				const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-rpc.publicnode.com');
				const contract = new ethers.Contract(contractAddress, ['function tokenURI(uint256 tokenId) view returns (string)'], provider);
				const tokenURI = await contract.tokenURI(tokenId);
				const metadataResponse = await fetch(tokenURI);
				if (!metadataResponse.ok) {
					throw new Error('Failed to fetch token metadata');
				}
				const metadata = await metadataResponse.json();
				finalUrl = metadata.image || metadata.image_url;
			}
		} else if (url.startsWith('ipfs:')) {
			finalUrl = `https://ipfs.io/ipfs/${url.split('ipfs://')[1]}`;
		}

		const response = await fetch(finalUrl);
		if (!response.ok) {
			return NextResponse.json({ error: `Failed to fetch avatar: ${response.statusText}` }, { status: response.status });
		}

		const contentType = response.headers.get('content-type');
		const buffer = await response.arrayBuffer();

		const headers = new Headers();
		headers.set('Content-Type', contentType || 'application/octet-stream');

		return new NextResponse(Buffer.from(buffer), {
			status: 200,
			headers,
		});
	} catch (error) {
		return NextResponse.json({ error: `Failed to fetch avatar: ${error.message}` }, { status: 500 });
	}
}
