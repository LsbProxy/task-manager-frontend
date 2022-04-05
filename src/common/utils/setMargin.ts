const setMargin = (
	margin: undefined | number | { top?: number; bottom?: number; left?: number; right?: number },
): string => {
	if (typeof margin === 'object') {
		return `${margin.top || 0}rem ${margin.right || 0}rem ${margin.bottom || 0}rem ${
			margin.left || 0
		}rem`;
	}
	return `${margin ? margin : 0}rem`;
};

export default setMargin;
