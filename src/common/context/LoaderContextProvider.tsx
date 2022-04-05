import React, { FC, createContext, useContext, useState } from 'react';

interface LoaderStore {
	isLoading: boolean;
	showLoader: (value: boolean) => void;
}

const LoaderContext = createContext<LoaderStore>({
	isLoading: false,
	showLoader: (value: boolean) => void value,
});

export const useLoader = (): LoaderStore => useContext(LoaderContext);

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
