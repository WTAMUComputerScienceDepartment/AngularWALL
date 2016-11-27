import { Injectable } from "@angular/core";

import { MachineStateService } from "./machineState.service";

@Injectable()
export class ClockService {
	private instructions = {
		"0": /0000/,
		"1": /1[0-9A-F]{3}/,
		"2": /2[0-9A-F]{3}/,
		"3": /3[0-9A-F]{3}/,
		"4": /4[0-9A-F]{3}/,
		"5": /5[0-9A-F]{3}/,
		"60": /60[0-9A-F]{2}/,
		"61": /61[0-9A-F]{2}/,
		"62": /62[0-9A-F]{2}/,
		"63": /6301/,
		"64": /64[0-9A-F]0/,
		"65": /65[0-9A-F]0/,
		"7": /7[0-9A-F]{3}/,
		"8": /8[0-9A-F]{3}/,
		"9": /9[0-9A-F]{3}/,
		"A0": /A0[0-9A-F]{2}/,
		"A1": /A1[0-9A-F]{2}/,
		"A2": /A2[0-9A-F]{2}/,
		"A3": /A3[0-9A-F]{2}/,
		"A4": /A4[0-9A-F]{2}/,
		"B": /B[0-9A-F]{3}/,
		"B0": /B0[0-9A-F]{2}/,
		"C": /C000/,
		"D0": /D0[0-9A-F]{2}/,
		"D1": /D1[0-9A-F]{2}/,
		"D2": /D2[0-9A-F]{2}/,
		"E": /E[0-9A-F]{3}/,
		"F": /F[0-9A-F]{3}/
	};
	private functionMap = {
		"0": "noOp",
		"1": "directLoad",
		"2": "immediateLoad",
		"3": "store",
		"4": "rload",
		"5": "add",
		"60": "call",
		"61": "ret",
		"62": "scall",
		"63": "sret",
		"64": "push",
		"65": "pop",
		"7": "or",
		"8": "and",
		"9": "xor",
		"A0": "ror",
		"A1": "rol",
		"A2": "sra",
		"A3": "srl",
		"A4": "sl",
		"B": "jmpeq",
		"B0": "jmp",
		"C": "halt",
		"D0": "iload",
		"D1": "istore",
		"D2": "move",
		"E": "rstore",
		"F": "jmplt"
	}

	constructor(private machineStateService: MachineStateService) {};

	run(): void {
		while (!this.instructions.C.test(this.machineStateService.getPSWRegister(1))) {
			this.step();
		}
	};

	step(): void {
		let operation = this.fetch();
		operation = this.decode(operation);
		this.execute(operation);
	};

	stop(): void {
		this.halt();
	};

	pswUpdate(): void {
		let ip = this.machineStateService.getPSWRegister(0),
			address = this.resolveHexAddress(ip),
			content = this.machineStateService.getMemoryCell(address[0], address[1]);

		address = this.resolveHexAddress(this.addHexStrings(ip, "1"));
		content += this.machineStateService.getMemoryCell(address[0], address[1]);
		//update IR
		this.machineStateService.setPSWRegister(1, content);
		//update IP
		this.machineStateService.setPSWRegister(0, this.addHexStrings(ip, "2"));
	};

	/*
	 * fetch - Increment the Instruction Point (IP) and retrieve the value in
	 *				 the Instruction Register (IR) in the PSW, and passes it to the decode
	 *         step.
	 * return - String in Instruction Register (IR)
	 */
	fetch(): string {
		this.pswUpdate();
		return this.machineStateService.getPSWRegister(1);
	};

	/*
	 * decode - First validates OpCode, then validates the Operation format, and then
	 *					formats it for the given instruction.
	 */
	decode(operation: string): any {
		let firstNibble, firstByte, secondNibble, thirdNibble, fourthNibble,
			validInstruction = false;

		firstByte = operation.substring(0, 2);
		firstNibble = operation.substring(0, 1);
		secondNibble = operation.substring(1, 2);
		thirdNibble = operation.substring(2, 3);
		fourthNibble = operation.substring(3, 4);

		if (this.instructions[firstNibble] && this.instructions[firstNibble].test(operation)) {
			validInstruction = true;
		}
		else if (this.instructions[firstByte] && this.instructions[firstByte].test(operation)) {
			validInstruction = true;
		}

		if (validInstruction) {
			switch (firstNibble) {
				case "1":
					return {
						firstNibble: firstNibble,
						secondNibble: parseInt(secondNibble, 16),
						thirdNibble: parseInt(thirdNibble, 16),
						fourthNibble: parseInt(fourthNibble, 16)
					};
				case "2":
					return {
						firstNibble: firstNibble,
						secondNibble: parseInt(secondNibble, 16),
						thirdNibble: thirdNibble,
						fourthNibble: fourthNibble
					};
				case "3":
					return;
				case "4":
					return;
				case "5":
					return {
						firstNibble: firstNibble,
						secondNibble:parseInt(secondNibble, 16),
						thirdNibble: parseInt(thirdNibble, 16),
						fourthNibble: parseInt(fourthNibble, 16)
					};
				case "6":
					return;
				case "7":
					return;
				case "8":
					return;
				case "9":
					return;
				case "A":
					return;
				case "B":
					return;
				case "C":
					return {
						firstNibble: firstNibble,
						secondNibble: secondNibble,
						thirdNibble: thirdNibble,
						fourthNibble: fourthNibble
					};
				case "D":
					return;
				case "E":
					return;
				case "F":
					return;
			}
		}
		return {
			firstNibble: "0",
			secondNibble: "0",
			thirdNibble: "0",
			fourthNibble: "0"
		};
	};

	/*
	 * execute -
	 */
	execute(operation): void {
		// let execOp;
		// if (this.instructions[operation.firstNibble]) {
		// 	execOp = this[this.functionMap[operation.firstNibble]];
		// 	execOp(operation.secondNibble, operation.thirdNibble, operation.fourthNibble);
		// }
		// else if (this.instructions[operation.firstNibble + operation.secondNibble]) {
		// 	this[operation.firstNibble + operation.secondNibble](operation.thirdNibble, operation.fourthNibble);
		// }

		switch (operation.firstNibble) {
			case "1":
				this.directLoad(operation.secondNibble, operation.thirdNibble, operation.fourthNibble);
				break;
			case "2":
				this.immediateLoad(operation.secondNibble, operation.thirdNibble + operation.fourthNibble);
				break;
			case "3":
				break;
			case "4":
				break;
			case "5":
				this.add(operation.secondNibble, operation.thirdNibble, operation.fourthNibble);
				break;
			case "6":
				switch (operation.secondNibble) {
					case "0":
						break;
					case "1":
						break;
					case "2":
						break;
					case "3":
						break;
					case "4":
						break;
					case "5":
						break;
				}
				break;
			case "7":
				break;
			case "8":
				break;
			case "9":
				break;
			case "A":
				break;
			case "B":
				break;
			case "C":
				this.halt();
				break;
			case "D":
				break;
			case "E":
				break;
			case "F":
				break;
			default:
				break;
		}
	};

	/*
	 * Direct LOAD (1L MN) - Loads the value indicated by Memory Cell MN into
	 *											 Register L.
	 * destReg - Destination Register (L)
	 * memRow - Memory address (M)
	 * memCol - Memory Column (N)
	 */
	directLoad(destReg: number, memRow: number, memCol: number): void {
		let content = this.machineStateService.getMemoryCell(memRow, memCol);
		this.machineStateService.setRegister(destReg, content);
	};

	/*
	 * Immediate LOAD (2L MN) - Loads the value MN into Register L.
	 * destReg - Destination Register (L); 0-15
	 * value - hexadecimal number from 00-255
	 */
	immediateLoad(destReg: number, value: string): void {
		this.machineStateService.setRegister(destReg, value);
	};

	/*
	 * ADD (5l MN) - Adds the value of Register M and Register N, storing the
	 *							 result in Register L.
	 * destReg - Destination register (L); 0-15
	 * srcRegA - left source register (M); 0-15
	 * srcRegB - Right source register (N); 0-15
	 */
	add(destReg: number, srcRegA: number, srcRegB: number): void {
		let valueA = this.machineStateService.getRegister(srcRegA);
		let valueB = this.machineStateService.getRegister(srcRegB);
		this.machineStateService.setRegister(destReg, this.addHexStrings(valueA, valueB));
	};

	/*
	 * HALT (C0 00) - Cancels execution of the clock.
	 */
	halt(): void {

	};

	addHexStrings(hexValA: string, hexValB: string): string {
		let result = (parseInt(hexValA, 16) + parseInt(hexValB, 16)).toString(16);
		return result.length >= 2 ? result : "0" + result;
	};

	resolveHexAddress(address: string): number[] {
		let row = parseInt(address.substring(0, 1), 16);
		let col = parseInt(address.substring(1, 2), 16);
		return [row, col];
	};
}
