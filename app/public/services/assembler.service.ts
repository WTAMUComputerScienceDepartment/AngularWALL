import { Injectable } from "@angular/core";

@Injectable()
export class AssemblerService {
  private srcCode: string[][] = [];
  private assembledCode: string[][] = [];
  private labelAddrMap: Object = {};
  private OPERATIONS: Object = {
		"0": "noOp", "1": "directLoad", "2": "immediateLoad", "3": "store",
		"4": "rload", "5": "add", "60": "call", "61": "ret",
		"62": "scall", "63": "sret", "64": "push", "65": "pop",
		"7": "or", "8": "and", "9": "xor", "A0": "ror",
		"A1": "rol", "A2": "sra", "A3": "srl", "A4": "sl",
		"B": "jmpeq", "B0": "jmp", "C": "halt", "D0": "iload",
		"D1": "istore", "D2": "move", "E": "rstore", "F": "jmplt"
	};
  private PSEUDOOPS: string[] = ["BSS", "DB", "EQU", "ORG", "SIP"];

  assemble(code: string[]): void {
    this.passOne(code);
    this.passTwo();
  };

  /*
   * passOne - The first pass of the assemble process.
   *           1.) Strips out comments and whitespace.
   *           2.) Maps "Labels" to addresses
   *           3.) Marks forward references to be resolved in the second pass.
   */
  passOne(code: string[]): void {
    let currentAddress = 0;

    //strip whitespace, create template for assembly listing
    for (let i = 0; i < code.length; i++) {
    	this.srcCode.push(code[i].match(/[\w:=<\-\[\]]+|["'][^"']+["']|#.*/g).filter(Boolean));
    }

    for (let i = 0; i < this.srcCode.length; i++) {
      let line = this.srcCode[i], label;
      if (line.length > 0) {
        if (/:/.test(line[0]) && this.isValidLabel(line[0])) {
          label = line[0].slice(0, line[0].length - 1);
          this.labelAddrMap[label] = currentAddress;
          line = line.slice(1); //remove label
        }
        if (line.length > 0) {
          switch(line[0].toLowerCase()) {
            case "bss":
            case "org":
              if (this.isValidHex(line[1]))
                currentAddress = parseInt(line[1], 16);
              else if (this.isValidInt(line[1], "positive"))
                currentAddress = parseInt(line[1]);
              break;
            case "db":
              let args = line.slice(1);
              for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                if (/"[\s\S]*"/.test(arg))
                  currentAddress += arg.length - 2;
                else
                  currentAddress++;
              }
              break;
            case "equ":
              // if (this.isValidHex(line[1]))
              //   currentAddress = parseInt(line[i], 16);
              // else if (this.isValidInt(line[1], "positive"))
              //   currentAddress = parseInt(line[1]);
              break;
            case "sip":
              break;
            default: //Operations
              currentAddress += 2;
          }
        }
      }
    }
    console.log(this.labelAddrMap);
  };

  /*
   * passTwo - The second pass of the assemble process.
   *           1.) Handles forward References.
   *           2.) Resolves Pseudo-Operations.
   *           3.) Creates byte-code of Operations.
   */
  passTwo(): void {

  };

  private isValidHex(value: string): boolean {
    return /0x[0-9A-Fa-f]{1,2}/.test(value) && value.length <= 4;
  };

  private isValidInt(value: string, sign?: string): boolean {
    if (sign.toLowerCase() === "negative")
      return /\-{0,1}[0-9]{1,3}/.test(value) && value.length <= 4;
    return /[0-9]{1,3}/.test(value) && value.length <= 3; //positive by default
  };

  private isValidLabel(value: string): boolean {
    //Alpha-numeric, no ops or Pseudo-Ops
    return /[0-9a-zA-Z]+:/.test(value) &&
      Object.values(this.OPERATIONS).filter((op) => {
        return op.toLowerCase() === value.toLowerCase()
      }).length === 0 &&
      Object.values(this.PSEUDOOPS).filter((pseudoOp) => {
        return pseudoOp.toLowerCase() === value.toLowerCase()
      }).length === 0;
  };
}
