import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
			<Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
		</div>
	);
};

export default Loading;
