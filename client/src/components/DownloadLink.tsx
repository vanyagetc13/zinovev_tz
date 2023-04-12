import React from "react";

interface DownloadLinkProps {
	path: string;
	click: () => void;
}

const DownloadLink = ({ path, click }: DownloadLinkProps) => {
	return (
		<a onClick={click} href={path} download>
			Download Changed Word file
		</a>
	);
};

export default DownloadLink;
