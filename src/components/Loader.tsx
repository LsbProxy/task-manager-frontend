import React, { FC } from 'react';

import { Spinner } from 'react-bootstrap';

const Loader: FC = () => {
	return (
		<Spinner
			animation="border"
			variant="primary"
			style={{
				position: 'absolute',
				top: 'calc(50% - 16px)',
				left: 'calc(50% - 16px)',
			}}
		/>
	);
};

export default Loader;
