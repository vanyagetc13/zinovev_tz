import React, { ChangeEvent, useState } from "react";
import { IInput } from "./types";
import axios from "axios";
import { Button } from "react-bootstrap";
import FileInput from "./components/FileInput";
import InputList from "./components/InputList";

function App() {
	const inputsInitialState = [
		{
			id: 0,
			name: "",
			value: "",
		},
	];
	const [file, setFile] = useState<File>();
	const [inputs, setInputs] = useState<Array<IInput>>(inputsInitialState);
	const [path, setPath] = useState<string>("");
	const [downloadPath, setDownloadPath] = useState<string>("");

	const fileInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const FileList = e.currentTarget.files;
		if (FileList) {
			const file = FileList[0];
			const { lastModified, name } = file;
			const path = `${lastModified} ${name}`;
			setFile(file);
			setPath(path);
		}
	};

	const sendFileHandler = () => {
		const inputsFormData = JSON.stringify(inputs);
		axios
			.post(
				"http://127.0.0.1:4444/file",
				{
					file,
					path,
					inputsFormData,
				},
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setDownloadPath(res.data.replace("/client/public", ""));
				}
			})
			.catch((err) => console.log(err));
	};

	const changeInputsNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		const index = inputs.findIndex((input) => input.id === Number(name));
		setInputs((prev) => {
			const newArray = [...prev];
			newArray[index].name = value;
			return newArray;
		});
	};
	const changeInputsValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		const index = inputs.findIndex((input) => input.id === Number(name));
		setInputs((prev) => {
			const newArray = [...prev];
			newArray[index].value = value;
			return newArray;
		});
	};

	const addInputHandler = () => {
		const ID = Number(new Date());
		const newInput: IInput = {
			id: ID,
			name: "",
			value: "",
		};
		setInputs((prev) => [...prev, newInput]);
	};

	const removeLastInputHandler = () => {
		setInputs((prev) => prev.splice(0, prev.length - 1));
	};

	return (
		<>
			<FileInput change={fileInputHandler} />
			<InputList
				inputs={inputs}
				changeName={changeInputsNameHandler}
				changeValue={changeInputsValueHandler}
			/>
			<div className='buttons'>
				<Button variant='success' size='sm' onClick={addInputHandler}>
					Добавить новую пару
				</Button>
				<Button
					variant='danger'
					size='sm'
					onClick={removeLastInputHandler}
				>
					Удалить последнюю пару
				</Button>
			</div>
			{file && (
				<Button variant='primary' onClick={sendFileHandler}>
					Send file to Server!
				</Button>
			)}
			{downloadPath && (
				<a
					onClick={() => {
						axios
							.post("http://127.0.0.1:4444/delete", {
								downloadPath,
							})
							.then((res) => console.log(res))
							.catch((err) => console.error(err));
						setDownloadPath("");
					}}
					href={downloadPath}
					download
				>
					Download Changed Word file
				</a>
			)}
		</>
	);
}

export default App;
