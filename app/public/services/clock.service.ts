import { Injectable } from "@angular/core";

import { MachineStateService } from "./machineState.service";

@Injectable()
export class ClockService {
	private instructions = {
		"0": /0000/, "1": /1[0-9A-F]{3}/, "2": /2[0-9A-F]{3}/, "3": /3[0-9A-F]{3}/,
		"4": /4[0-9A-F]{3}/, "5": /5[0-9A-F]{3}/, "60": /60[0-9A-F]{2}/, "61": /61[0-9A-F]{2}/,
		"62": /62[0-9A-F]{2}/, "63": /6301/, "64": /64[0-9A-F]0/, "65": /65[0-9A-F]0/,
		"7": /7[0-9A-F]{3}/, "8": /8[0-9A-F]{3}/, "9": /9[0-9A-F]{3}/, "A0": /A0[0-9A-F]{2}/,
		"A1": /A1[0-9A-F]{2}/, "A2": /A2[0-9A-F]{2}/, "A3": /A3[0-9A-F]{2}/, "A4": /A4[0-9A-F]{2}/,
		"B": /B[0-9A-F]{3}/, "B0": /B0[0-9A-F]{2}/, "C": /C000/, "D0": /D0[0-9A-F]{2}/,
		"D1": /D1[0-9A-F]{2}/, "D2": /D2[0-9A-F]{2}/, "E": /E[0-9A-F]{3}/, "F": /F[0-9A-F]{3}/
	};
	private functionMap = {
		"0": "noOp", "1": "directLoad", "2": "immediateLoad", "3": "store",
		"4": "rload", "5": "add", "60": "call", "61": "ret",
		"62": "scall", "63": "sret", "64": "push", "65": "pop",
		"7": "or", "8": "and", "9": "xor", "A0": "ror",
		"A1": "rol", "A2": "sra", "A3": "srl", "A4": "sl",
		"B": "jmpeq", "B0": "jmp", "C": "halt", "D0": "iload",
		"D1": "istore", "D2": "move", "E": "rstore", "F": "jmplt"
	};
	private runInProgress;

	constructor(private machineStateService: MachineStateService) {};

	/*
	 * run - Runs the clock. Clock Speed at 10% is 4 seconds, at 100% is 1 milisecond.
	 * speed - A percentage of how fast the machine moves. Default is 50%
	 */
	run(speed = 50): void {
		speed = 4100 - (4000 * (speed * .01));
		this.runInProgress = setInterval(this.step.bind(this), speed);
	};

	step(): void {
		if (this.machineStateService.getPSWRegister(1) !== "C000") {
			let operation = this.fetch();
			operation = this.decode(operation);
			this.execute(operation);
		}
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
					return {
						firstNibble: firstNibble,
						secondNibble: secondNibble,
						thirdNibble: thirdNibble,
						fourthNibble: fourthNibble
					};
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
				default:
					return {
						firstNibble: "C",
						secondNibble: "0",
						thirdNibble: "0",
						fourthNibble: "0"
					};
			}
		}
		return {
			firstNibble: "C",
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
		if (this.functionMap[operation.firstNibble] === "halt") {
			this.halt();
		}
		// this.immediateLoad(operation.secondNibble, operation.thirdNibble, operation.fourthNibble);
		else if (this.instructions[operation.firstNibble]) {
			// execOp = this[this.functionMap[operation.firstNibble]];
			this[this.functionMap[operation.firstNibble]](operation.secondNibble, operation.thirdNibble, operation.fourthNibble);
		}
		else if (this.instructions[operation.firstNibble + operation.secondNibble]) {
			this[this.functionMap[operation.firstNibble + operation.secondNibble]](operation.thirdNibble, operation.fourthNibble);
		}
	};

	/*
	 * LOAD (1L MN) - Direct Load; Loads the value indicated by Memory Cell MN into
	 *								Register L.
	 * destReg - Destination Register (L)
	 * memRow - Memory address (M)
	 * memCol - Memory Column (N)
	 */
	directLoad(destReg: number, memRow: number, memCol: number): void {
		let content = this.machineStateService.getMemoryCell(memRow, memCol);
		this.machineStateService.setRegister(destReg, content);
	};

	/*
	 * LOAD (2L MN) - Immediate Load; Loads the value MN into Register L.
	 * 								destReg - Destination Register (L); 0-15
	 * value - hexadecimal number from 00-255
	 */
	immediateLoad(destReg: number, hNibble: string, lNibble: string): void {
		this.machineStateService.setRegister(destReg, hNibble + lNibble);
	};

	/*
	 * STORE (3N XY) - Takes the value in Register N and places it into the memory
	 *								 cell XY.
	 * srcReg - Source Register (N); 0-15
	 * memoryRow -
	 * memoryCol -
	 */
	store(srcReg: number, memoryRow: number, memoryCol: number) {
		let content = this.machineStateService.getRegister(srcReg);
		this.machineStateService.setMemoryCell(memoryRow, memoryCol, content);
	};

	/*
	 * RLOAD (4H NM) - Relative Load; Loads a value to Register N based on the content
	 *								 of Register M, plus an offset of H
	 *
	 */
	rload(offset: string, destReg: number, srcReg: number): void {
		let address = this.machineStateService.getRegister(srcReg);
		let content = this.addHexStrings(offset, address);
		this.machineStateService.setRegister(destReg, content);
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
	 * CALL (60 XY) -
	 *
	 */
	call(): void {

	};

	/*
	 * RET (61 XY) -
	 *
	 */
	ret(): void {

	};

	/*
	 * SCALL (62 XY) -
	 *
	 */
	scall(): void {

	};

	/*
 	 * SRET (63 01) -
 	 *
 	 */
	sret(): void {

	};

	/*
	 * PUSH (64 N0) -
	 *
	 */
	push(): void {

	};

	/*
	 * POP (65 N0) -
	 *
	 */
	pop(): void {

	};

	/*
	 * OR (7L MN) - Bitwise OR of Register M and Register N; result is stored in
	 *							Register L.
	 * destReg - Destination register (L): 0-15
	 * srcRegA - Left source register (M): 0-15
	 * srcRegB - Right source register (N): 0-15
	 */
	or(destReg: number, srcRegA: number, srcRegB: number): void {
		let valueA = this.machineStateService.getRegister(srcRegA);
		let valueB = this.machineStateService.getRegister(srcRegB);
		let result = parseInt(valueA, 16) | parseInt(valueB, 16);
		this.machineStateService.setRegister(destReg, result.toString(16));
	};

	/*
	 * AND (8L MN) - Bitwise AND of Register M and Register N; result is stored in
	 *							 Register L.
	 * destReg - Destination register (L): 0-15
	 * srcRegA - Left source register (M): 0-15
	 * srcRegB - Right source register (N): 0-15
	 */
	and(destReg: number, srcRegA: number, srcRegB: number): void {
		let valueA = this.machineStateService.getRegister(srcRegA);
		let valueB = this.machineStateService.getRegister(srcRegB);
		let result = parseInt(valueA, 16) & parseInt(valueB, 16);
		this.machineStateService.setRegister(destReg, result.toString(16));
	};

	/*
	 * XOR (9L MN) - Bitwise XOR of Register M and Register N; result is stored in
	 *							 Register L.
	 * destReg - Destination register (L): 0-15
	 * srcRegA - Left source register (M): 0-15
	 * srcRegB - Right source register (N): 0-15
	 */
	xor(destReg: number, srcRegA: number, srcRegB: number): void {
		let valueA = this.machineStateService.getRegister(srcRegA);
		let valueB = this.machineStateService.getRegister(srcRegB);
		let result = parseInt(valueA, 16) ^ parseInt(valueB, 16);
		this.machineStateService.setRegister(destReg, result.toString(16));
	};

	/*
	 * ROR (A0 NX) -
	 *
	 */
	ror(): void {

	};

	/*
   * ROL (A1 NX) -
	 */
	rol(): void {

	};

	/*
	 * SRA (A2 NX) -
	 *
	 */
	sra(): void {

	};

	/*
	 * SRL (A3 NX) -
	 *
	 */
	srl(): void {

	};

	/*
	 * SL (A4 NX) -
	 *
	 */
	sl(): void {

	};

	/*
	 * JMP (B0 XY) - Unconditional jump to address XY; Alters Instruction Pointer (IP)
	 *							 by placing the address XY into it.
	 * hNibble - High nibble (X): 0-F
	 * lNibble - Low nibble (Y): 0-F
	 */
	jmp(hNibble: string, lNibble: string): void {
		this.machineStateService.setPSWRegister(0, hNibble + lNibble);
	};

	/*
	 * JMPEQ (BN XY) - Jump on Equality; Alters Instruction Pointer (IP) by placing
	 *                 the address XY into it, if the value in Register N is equal
	 *								 to the value in Register 0.
	 * compReg - Comparison Register (N): 0-15
	 * hNibble - High nibble (X): 0-F
	 * lNibble - Low nibble (Y): 0-F
	 */
	jmpeq(compReg: number, hNibble: string, lNibble: string): void {
		let compValue = this.machineStateService.getRegister(0);
		if (this.machineStateService.getRegister(compReg) === compValue) {
			this.machineStateService.setPSWRegister(0, hNibble + lNibble);
		}
	};

	/*
	 * HALT (C0 00) - Cancels execution of the clock.
	 */
	halt(): void {
		if (this.runInProgress) {
			clearInterval(this.runInProgress);
		}
	};

	/*
	 * ILOAD (D0 NM) - Indirect Load; Loads the value pointed to by the content of
	 *								 Register M into Register N.
	 * destReg - Destination register (N); 0-15
	 * srcReg - Source register (M); 0-15
	 */
	iload(destReg: number, srcReg: number): void {
		let address = this.machineStateService.getRegister(srcReg);
		let row = parseInt(address.substring(0, 1), 16);
		let column = parseInt(address.substring(1, 2), 16);
		let content = this.machineStateService.getMemoryCell(row, column);
		this.machineStateService.setRegister(destReg, content);
	};

	/*
	 * ISTORE (D1 NM) - Indirect STORE;
	 * srcReg - Source register (N); 0-15
	 * destReg - Destination register (M); 0-15
	 */
	istore(srcReg: number, destReg: number): void {

	};

	/*
	 * RSTORE (EH MN) -
	 *
	 */
	rstore(): void {

	};

	/*
	 * JMPLT (FN XY) -
	 *
	 */
	jmplt(compReg: number, hNibble: string, lNibble: string): void {
		let compValue = this.machineStateService.getRegister(0);
		if (this.machineStateService.getRegister(compReg) <= compValue) {
			this.machineStateService.setPSWRegister(0, hNibble + lNibble);
		}
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
