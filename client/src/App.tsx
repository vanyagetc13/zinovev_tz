import React, { ChangeEvent, useState } from "react";
import { IInput } from "./types";
import axios from "axios";
import { Button, Col, Container, Row } from "react-bootstrap";
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

	const fileInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const FileList = e.currentTarget.files;
		if (FileList && FileList.length > 0) {
			const file: File = FileList[0];
			const { lastModified, name } = file;
			const path = `${lastModified} ${name}`;
			setFile(file);
			setPath(path);
		}
	};
	const cleanUpHandler = (path: string) => {
		axios
			.post("http://127.0.0.1:4444/delete", {
				path,
			})
			.then((res) => console.log(res))
			.catch((err) => console.error(err));
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
					const path = res.data.replace("/client/public", "");
					const link = document.createElement("a");
					link.href = path;
					link.setAttribute("download", `${file?.name}`);
					link.click();
					link.parentNode?.removeChild(link);
					cleanUpHandler(path);
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
		if (inputs.length <= 1) return;
		setInputs((prev) => prev.splice(0, prev.length - 1));
	};

	return (
		<Container fluid className='p-5 d-flex'>
			<Col className='gap-3 d-flex flex-column m-0'>
				<Row className='m-0'>
					<FileInput change={fileInputHandler} />
				</Row>
				<Row className='d-flex flex-column gap-3 p-0 m-0'>
					<InputList
						inputs={inputs}
						changeName={changeInputsNameHandler}
						changeValue={changeInputsValueHandler}
					/>
				</Row>
				<Row className='d-flex gap-2 mt-4 m-0 w-auto'>
					<Button
						variant='success'
						size='sm'
						onClick={addInputHandler}
					>
						Добавить новую пару
					</Button>
					<Button
						variant='danger'
						size='sm'
						onClick={removeLastInputHandler}
					>
						Удалить последнюю пару
					</Button>
				</Row>
				{file && (
					<Row className='w-auto m-0'>
						<Button variant='primary' onClick={sendFileHandler}>
							Send file to Server!
						</Button>
					</Row>
				)}
			</Col>
		</Container>
	);
}

export default App;
