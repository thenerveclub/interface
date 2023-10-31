import styled from '@emotion/styled';
import jazzicon from '@metamask/jazzicon';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

const StyledIdenticon = styled.div<{ iconSize: number }>`
	height: ${({ iconSize }) => `${iconSize}px`};
	width: ${({ iconSize }) => `${iconSize}px`};
	border-radius: 1.125rem;
	background-color: #000014;
	font-size: initial;
	display: flex;
	margin-right: 0.25rem;
`;

export default function Identicon({ size }: { size?: number }) {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const iconSize = size ?? 24;

	const icon = useMemo(() => account && jazzicon(iconSize, parseInt(account.slice(2, 10), 16)), [account, iconSize]);
	const iconRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const current = iconRef.current;
		if (icon) {
			current?.appendChild(icon);
			return () => {
				try {
					current?.removeChild(icon);
				} catch (e) {
					console.error('Avatar icon not found');
				}
			};
		}
		return;
	}, [icon, iconRef]);

	return (
		<StyledIdenticon iconSize={iconSize}>
			<span ref={iconRef} />
		</StyledIdenticon>
	);
}
