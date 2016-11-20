import { Injectable } from "@angular/core";

import { MachineStateService } from "./machineState.service";

@Injectable()
export class ClockService {
	private instructions = {
		"0": /00 00/,
		"1": /1[0-F] [0-F]{2}/,
		"2": /2[0-F] [0-F]{2}/,
		"3": /3[0-F] [0-F]{2}/,
		"4": /4[0-F] [0-F]{2}/,
		"5": /5[0-F] [0-F]{2}/,
		"60": "",
		"61": "",
		"62": "",
		"63": /01/,
		"64": "",
		"65": "",
		"7": /7[0-F] [0-F]{2}/,
		"8": /8[0-F] [0-F]{2}/,
		"9": "",
		"A": "",
		"B": /B[0-F] [0-F]{2}/,
		"C": /C000/,
		"D": "",
		"E": /E[0-F] [0-F]{2}/,
		"F": /F[0-F] [0-F]{2}/
	};

	constructor(private machineStateService: MachineStateService) {};

	run(): void {

		while (!this.instructions.C.test(this.machineStateService.getPSWRegister(1))) {
			this.step();
		}
	};

	step(): void {
		this.fetch();
	};

	pswUpdate(): void {
		let ip = this.machineStateService.getPSWRegister(0),
				address = this.resolveHexAddress(ip),
				content = this.machineStateService.getMemoryCell(address[0], address[1]);

		address = this.resolveHexAddress(ip + 1);
		content += this.machineStateService.getMemoryCell(address[0], address[1]);
		this.machineStateService.setPSWRegister(1, content);
		this.machineStateService.setPSWRegister(0, ip + 2);
	};

	fetch(): void {

	};

	decode(): void {

	};

	execute(): void {

	};

	/*
	 * Direct LOAD (1L MN) - Loads the value indicated by Memory Cell MN into
	 *											 Register L.
	 * destReg - Destination Register (L)
	 * memCell - Memory address (MN)
	 */
	directLoad(destReg: number, memCell: number): void {

	};

	/*
	 * Immediate LOAD (2L MN) - Loads the value MN into Register L.
	 * destReg - Destination Register (L); 0-15
	 * value - hexadecimal number from 00-255
	 */
	immediateLoad(destReg: number, value: number): void {

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

	addHexStrings(hexValA: string, hexValB: string): string {
		let result = parseInt(hexValA, 16) + parseInt(hexValB, 16);
		return result.toString(16);
	};

	resolveHexAddress(address: string): number[] {
		let row = parseInt(address.substring(0, 1), 16);
		let col = parseInt(address.substring(1, 2), 16);
		return [row, col];
	};
}
