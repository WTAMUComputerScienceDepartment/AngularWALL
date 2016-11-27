import { Injectable } from "@angular/core";

@Injectable()
export class MachineStateService {
	private registerState: string[] = [
	    "00", "00", "00", "00", "00", "00", "00", "00", "00",
	    "00", "00", "00", "00", "FF", "FF", "00"
	];
	private pswState: string[] = ["00", "0000"];
	private memoryState: string[][] = [
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
		["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"]
	];

	getMemoryCell(row: number, column: number): string {
		return this.memoryState[row][column];
	};

	getMemoryState(): string[][] {
		return this.memoryState;
	};

	getPSWRegister(pswRegister: number): string {
		return this.pswState[pswRegister];
	};

	getPSWState(): string[] {
		return this.pswState;
	};

	getRegister(register: number): string {
		return this.registerState[register];
	};

	getRegisterState(): string[] {
		return this.registerState;
	};

	setMemoryCell(row: number, column: number, content: string): void {
		this.memoryState[row][column] = content;
	};

	setMemoryState(ram: string[][]): void {
		this.memoryState = ram;
	};

	setPSWRegister(pswRegister: number, content: string): void {
		this.pswState[pswRegister] = content;
	};

	setPSWState(psw: string[]): void {
		this.pswState = psw;
	};

	setRegister(register: number, content: string): void {
		this.registerState[register] = content;
	};

	setRegisterState(registers: string[]): void {
		this.registerState = registers;
	};
}
