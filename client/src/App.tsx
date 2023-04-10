import React, { useState } from "react";
import { IInput } from "./types";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

function App() {
	const [file, setFile] = useState<File>();
	const [inputs, setInputs] = useState<Array<IInput>>([]);
	const [path, setPath] = useState<string>("");
	const [downloadPath, setDownloadPath] = useState<string>("");

	const makeSomeDuty = () => {
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
		if (!inputs.length) return;
		setInputs((prev) => prev.splice(0, prev.length - 1));
	};

	return (
		<>
			<Container>
				<input
					type='file'
					onChange={(e) => {
						const FileList = e.currentTarget.files;
						if (FileList) {
							const file = FileList[0];
							const { lastModified, name } = file;
							const path = `${lastModified} ${name}`;
							setFile(file);
							setPath(path);
						}
					}}
					accept='.docx'
				/>
			</Container>
			<Container fluid='true' className='p-3'>
				<Col>
					{inputs.map((input) => (
						<Row key={input.id}>
							<input
								className='input'
								type='text'
								value={input.name}
								placeholder='Переменная'
								name={input.id.toString()}
								onChange={(e) => {
									const { name, value } = e.currentTarget;
									const index = inputs.findIndex(
										(input) => input.id === Number(name)
									);
									setInputs((prev) => {
										const newArray = [...prev];
										newArray[index].name = value;
										return newArray;
									});
								}}
							/>
							<input
								className='input'
								type='text'
								value={input.value}
								placeholder='Значение'
								name={input.id.toString()}
								onChange={(e) => {
									const { name, value } = e.currentTarget;
									const index = inputs.findIndex(
										(input) => input.id === Number(name)
									);
									setInputs((prev) => {
										const newArray = [...prev];
										newArray[index].value = value;
										return newArray;
									});
								}}
							/>
						</Row>
					))}
				</Col>
			</Container>
			<div className='buttons'>
				<Button variant='success' size='sm' onClick={addInputHandler}>
					+
				</Button>
				<Button
					variant='danger'
					size='sm'
					onClick={removeLastInputHandler}
				>
					-
				</Button>
			</div>
			<div>{file && <button onClick={makeSomeDuty}>click</button>}</div>
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
					download
				</a>
			)}
		</>
	);
}

export default App;
