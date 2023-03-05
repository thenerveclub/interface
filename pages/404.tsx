import styled from '@emotion/styled';
import { Box } from '@mui/material';

const StyledBox = styled(Box)`
	margin: 7.5rem 5rem auto 5rem;

	@media (max-width: 600px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

export default function IndexPage() {
	return (
		<StyledBox>
			<h1>404 - Page Not Found</h1>
			<p>The page could not be found.</p>
			<p>
				<a href="/">
					<a>Go back to the homepage</a>
				</a>
			</p>
		</StyledBox>
	);
}
