import React, { useState, createContext, FC } from 'react';

interface LoaderStore {
	isLoading: boolean;
	showLoader: (value: boolean) => void;
}

export const LoaderContext = createContext<LoaderStore>({
	isLoading: false,
	showLoader: (value: boolean) => void value,
});

const LoaderContextProvider: FC = (props) => {
	const [isLoading, showLoader] = useState(false);

	return (
		<LoaderContext.Provider
			value={{
				isLoading,
				showLoader,
			}}
		>
			{props.children}
		</LoaderContext.Provider>
	);
};

export default LoaderContextProvider;
