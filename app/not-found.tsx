'use client';

import Link from 'next/link';

export default function NotFound() {
	return (
		<div>
			<div>
				<Link href={`/`} passHref style={{ textDecoration: 'none' }}>
					<h1>Sorry</h1>
				</Link>
				<p>
					<a>We couldn&apos;t find that page.</a>
				</p>
			</div>
		</div>
	);
}
