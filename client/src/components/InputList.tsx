import React, { useEffect, useMemo, useState } from "react";
import { IInput } from "../types";
import { ChangeEvent } from "react";
import { Col, Row } from "react-bootstrap";

interface InputListProps {
	inputs: IInput[];
	changeName: (e: ChangeEvent<HTMLInputElement>) => any;
	changeValue: (e: ChangeEvent<HTMLInputElement>) => any;
}

const InputList = ({ inputs, changeName, changeValue }: InputListProps) => {
	const [width, setWidth] = useState<number>(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);
	const isMobile = width <= 768;
	return (
		<>
			{inputs.map((input) => (
				<Row
					className={
						"p-0 m-0 " + (isMobile ? "flex-column w-100 gap-1" : "")
					}
					key={input.id}
				>
					<Col xs={isMobile ? undefined : 5} className='p-1'>
						<input
							className='w-100 p-2'
							type='text'
							value={input.name}
							placeholder='Переменная'
							name={input.id.toString()}
							onChange={changeName}
						/>
					</Col>
					<Col xs={isMobile ? undefined : 7} className='p-1'>
						<input
							className='w-100 p-2'
							type='text'
							value={input.value}
							placeholder='Значение'
							name={input.id.toString()}
							onChange={changeValue}
						/>
					</Col>
				</Row>
			))}
		</>
	);
};

export default InputList;
