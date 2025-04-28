import type { ComponentType } from 'react';
import React from 'react';

const withBasicLayout = (Component: ComponentType) => {
	return <Component />;
};

export default withBasicLayout;
