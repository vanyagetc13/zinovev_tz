import React from "react";
import { ChangeEvent } from "react";

interface FileInputProps {
	change: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileInput = ({ change }: FileInputProps) => {
	return <input type='file' onChange={change} accept='.docx' className="p-0"/>;
};

export default FileInput;
