import styled from 'styled-components';

const Loader = styled.div<{ centered?: boolean }>`
	width: 60px;
	height: 60px;
	border: 3px solid #3498db;
	border-top: 1px solid transparent;
	border-bottom: 1px solid transparent;
	border-radius: 50%;
	animation: spin 2s linear infinite;
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	position: ${(props) => (props.centered ? 'fixed' : 'relative')};
	top: calc(50% - 30px);
	left: calc(50% - 30px);
`;

export default Loader;
