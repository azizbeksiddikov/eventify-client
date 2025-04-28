import type { ComponentType } from 'react';
import React from 'react';

const withAdminLayout = (Component: ComponentType) => {
	return <Component />;
};

export default withAdminLayout;
