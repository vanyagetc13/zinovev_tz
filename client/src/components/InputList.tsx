import React from "react";
import { IInput } from "../types";
import { ChangeEvent } from "react";

interface InputListProps {
	inputs: IInput[];
	changeName: (e: ChangeEvent<HTMLInputElement>) => any;
	changeValue: (e: ChangeEvent<HTMLInputElement>) => any;
}

const InputList = ({ inputs, changeName, changeValue }: InputListProps) => {
	return (
		<>
			{inputs.map((input) => (
				<div key={input.id}>
					<input
						className='input'
						type='text'
						value={input.name}
						placeholder='Переменная'
						name={input.id.toString()}
						onChange={changeName}
					/>
					<input
						className='input'
						type='text'
						value={input.value}
						placeholder='Значение'
						name={input.id.toString()}
						onChange={changeValue}
					/>
				</div>
			))}
		</>
	);
};

export default InputList;
