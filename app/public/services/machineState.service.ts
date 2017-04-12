import { Injectable } from "@angular/core";

@Injectable()
export class MachineStateService {
	private _registerState: string[] = [
	    "00", "00", "00", "00", "00", "00", "00", "00", "00",
	    "00", "00", "00", "00", "FF", "FF", "00"
	];
	private _pswState: string[] = ["40", "0000"];
	private _memoryState: string[][] = [
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

	/*
	 *	loadMachineCode - takes WALL machine code and places it into memory and
	 *					  loads up the IP in PSW.
	 */
	loadMachineCode(): void {

	};

	//getters + setters

	get memoryState(): string[][] {
		return this._memoryState;
	};

	set memoryState(ram: string[][]) {
		for (let i = 0; i < 16; i++) {
			for (let j = 0; j < 16; j++) {
				this.memoryState[i][j] = ram[i][j];
			}
		}
	};

	setMemoryCell(row: number, column: number, content: string): void {
		this.memoryState[row][column] = content;
	};

	get pswState(): string[] {
		return this._pswState;
	};
	
	set pswState(psw: string[]) {
		this.pswState = psw;
	};

	setPSWRegister(pswRegister: number, content: string): void {
		this.pswState[pswRegister] = content;
	};

	get registerState(): string[] {
		return this._registerState;
	};

	set registerState(registers: string[]) {
		this.registerState = registers;
	};

	setRegister(register: number, content: string): void {
		this.registerState[register] = content;
	};
}
