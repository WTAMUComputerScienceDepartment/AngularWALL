import { Injectable } from "@angular/core";

@Injectable()
export class AssemblerService {
  private assembledCode: string[] = []; //Assembled Byte Code resulting from Pass Two
  private labelAddrMap: Object = {}; // Contains the mapped values of Label Strings to Hex Address String
  private OPERATIONS: Object = {
    NOOP: "0", LOAD: { DIRECT: "1", IMMEDIATE: "2" }, STORE: "3", RLOAD: "4", ADD: "5", CALL: "60", RET: "61",
    SCALL: "62", SRET: "63", PUSH: "64", POP: "65", OR: "7", AND: "8", XOR: "9",
    ROR: "A0", ROL: "A1", SRA: "A2", SRL: "A3", SL: "A4", JMPEQ: "B", JMP: "B0",
    HALT: "C", ILOAD: "D0", ISTORE: "D1", MOVE: "D2", RSTORE: "E", JMPLT: "F"
  };
  private PSEUDOOPS: string[] = ["BSS", "DB", "EQU", "ORG", "SIP"];
  private errors: Object[] = [];
  private sip: string = "00"; //Store the value of the Instruction Pointer - Corresponds to SIP Pseudo-Op
  private listing: string[][] = [] //An Assembler listing of the source code
  private srcCode: string[][] = [];

  constructor() {
    //initialize memory
    for (let i = 0; i < 256; i++) {
      this.assembledCode.push("00");
    }
  };

  /*
   * assemble - The public interface to the Assembler Service. It calls Pass One
   *            and Pass Two, and stores their results in accessable variables.
   */
  assemble(code: string[]): string[] {
    this.passOne(code);
    this.passTwo();
    return this.assembledCode;
  };

  /*
   * passOne - The first pass of the assemble process.
   *           1.) Strips out comments and whitespace.
   *           2.) Maps "Labels" to addresses
   *           3.) Marks SIP address
   *           4.) Marks forward references to be resolved in the second pass.
   */
  passOne(code: string[]): void {
    let currentAddress = 0;

    // strip whitespace and comments
    for (let i = 0; i < code.length; i++) {
      let temp = (code[i].match(/[\w:=<\-\[\]]+|["'][^"']+["']|#.*/g) || []).filter(Boolean);
      if (temp.length > 0 && !/^#.*/.test(code[i].trim())) {
        if (/#.*/.test(temp[temp.length - 1]))
          temp.pop();
        this.srcCode.push(temp);
      }
      this.listing.push([code[i]]);
    }

    //Map Labels
    for (let i = 0; i < this.srcCode.length; i++) {
      let line = this.srcCode[i], label; //temp variables
      // if (line.length > 0) {
        if (/:/.test(line[0])) {
          if (this.isValidLabel(line[0])) {
            label = line[0].slice(0, line[0].length - 1);
            this.labelAddrMap[label] = currentAddress;
          }
          else //invalidLabel
            this.errors.push({});
          line.splice(0, 1); //remove the label from source code
        }
        if (line.length === 0) //line only had a label on it
          this.srcCode.splice(i, 1); //remove empty line
        else if (line.length > 1) { //if label, has op/pseudoOp ?
          switch (line[0].toLowerCase()) {
            case "bss":
              if (this.isValidHex(line[1], 2))
                currentAddress += parseInt(line[1], 16);
              else if (this.isValidInt(line[1], 3))
                currentAddress += parseInt(line[1]);
              else //invalid operand
                this.errors.push({}); 
              break;
            case "org":
              if (this.isValidHex(line[1], 2))
                currentAddress = parseInt(line[1], 16);
              else if (this.isValidInt(line[1], 3))
                currentAddress = parseInt(line[1]);
              else //invalid operand
                this.errors.push({}); 
              break;
            case "db":
              let args = line.slice(1);
              for (let i = 0; i < args.length; i++) { //handle single to comma delimited operand
                let arg = args[i];
                if (/"[\s\S]*"/.test(arg))
                  currentAddress += arg.length - 2;
                else
                  currentAddress++;
              }
              break;
            case "equ": //TODO: Implement
              break;
            case "sip":
              if (this.isValidHex(line[1], 2))
                this.sip = line[1];
              else if (this.isValidInt(line[1], 3))
                this.sip = parseInt(line[1]).toString(16);
              else //invalid operand
                this.errors.push({});
              break;
            default: //Operations, pressumably, no validation till Pass Two
              currentAddress += 2;
          }
        }
        else //op/pseudoOp missing operand
          switch(line[0].toUpperCase()) {
            case "RET": //Exceptions - can have no operands
            case "SRET":
              currentAddress += 2;
              break;
            default:
              this.errors.push({});
          }
      // }
    }
    console.log(this.labelAddrMap);
    console.log(this.srcCode);
  };

  /*
   * passTwo - The second pass of the assemble process.
   *            1.) Handles Forward References.
   *            2.) Resolves Pseudo-Operations.
   *            3.) Creates byte-code of Operations.
   */ 
  passTwo(): void {
    let address = 0, isPseudoOp;

    for (let i = 0; i < this.srcCode.length; i++) {
      let byteCode = "0000", line = this.srcCode[i], opCode = line[0].toUpperCase();
      switch(opCode) {
        case "BSS": //TODO: Handle Errors
          address += parseInt(this.resolveNumericArg(line[1], 2), 16);
          isPseudoOp = true;
          break;
        case "ORG": //TODO: Handle Errors
          address = parseInt(this.resolveNumericArg(line[1], 2), 16);
          isPseudoOp = true;
          break;
        case "DB": //TODO: Handle Errors
          for (let j = 1; j <= line.length-1; j++) {
            if (/"/.test(line[j])) {
              let str = line[j];
              for (let pos = 1; pos < str.length-1; pos++) {
                this.assembledCode[address++] = str.charCodeAt(pos).toString(16).toUpperCase();
              }
            }
            else if (this.labelAddrMap.hasOwnProperty(line[j])) 
              this.assembledCode[address++] = parseInt(this.labelAddrMap[line[j]], 16).toString().toUpperCase();
            else
              this.assembledCode[address++] = this.resolveNumericArg(line[j], 2, true).toUpperCase();
          }
          isPseudoOp = true;
          break;
        case "SIP": //TODO: Handle Errors
          if (this.labelAddrMap.hasOwnProperty(line[1]))
            this.sip = this.labelAddrMap[line[1]];
          else
            this.sip = this.resolveNumericArg(line[1], 2);
          isPseudoOp = true;
          break;
        case "EQU":
          isPseudoOp = true;
          break;
        case "ADD": //Triple Register Format Instructions
        case "AND": //TODO: Handle Errors
        case "OR":
        case "XOR":
          if (line.length === 4)
            byteCode = this.OPERATIONS[opCode] + this.tripleRegisterFormat(line[1], line[2], line[3]);
          else
            this.errors.push({});
          break;
        case "ILOAD": //Double Register Format Instructions
          if (line.length === 3 && /\[.+\]/.test(line[2])) {
            let registerB = line[2].slice(1, line[2].length - 1);
            byteCode = this.OPERATIONS[opCode] + this.doubleRegisterFormat(line[1], registerB);
          }
          else
            this.errors.push({});
          break;
        case "ISTORE":
          if (line.length === 3 && /\[.+\]/.test(line[1])) {
            let registerA = line[1].slice(1, line[1].length - 1);
            byteCode = this.OPERATIONS[opCode] + this.doubleRegisterFormat(registerA, line[2]);
          }
          else
            this.errors.push({});
          break;
        case "MOVE":
          if (line.length === 3)
            byteCode = this.OPERATIONS[opCode] + this.doubleRegisterFormat(line[1], line[2]);
          else
            this.errors.push({});
          break;
        case "POP": //Single Register Format Instructions
        case "PUSH": //TODO: Handle Errors
          if (line.length === 2)
            byteCode = this.OPERATIONS[opCode] + this.singleRegisterFormat(line[1]);
          else
            this.errors.push({});
          break;
        case "ROL": //Register Immediate Value Format Instructions
        case "ROR": //TODO: Handle Errors
        case "SL":
        case "SRA":
        case "SRL":
          if (line.length === 3)
            byteCode = this.OPERATIONS[opCode] + this.registerImmediateFormat(line[1], line[2], 1);
          else
            this.errors.push({});
          break;
        case "LOAD":
          if (line.length === 3) {
            if (/\[.+\]/.test(line[2]))
              byteCode = this.OPERATIONS[opCode].DIRECT + this.registerImmediateFormat(line[1], line[2].slice(1, line[2].length -1), 0, true);
            else
              byteCode = this.OPERATIONS[opCode].IMMEDIATE + this.registerImmediateFormat(line[1], line[2], 0, true);
          }
          else
              this.errors.push({});
          break;
        case "JMPEQ":
          if (line.length === 3) {
              let firstOperand = line[1].split("=");
              if (firstOperand.length === 2 && this.isValidRegister(firstOperand[1], "R0"))
                byteCode = this.OPERATIONS[opCode] + this.registerImmediateFormat(firstOperand[0], line[2], 0, true);
          }
          else 
            this.errors.push({});
          break;
        case "JMPLT":
          if (line.length === 3) {
            let firstOperand = line[1].split("<");
            if (firstOperand.length === 2 && this.isValidRegister(firstOperand[1], "R0"))
              byteCode = this.OPERATIONS[opCode] + this.registerImmediateFormat(firstOperand[0], line[2], 0, true);
          }
          else 
            this.errors.push({});
         break;
        case "CALL": //Immediate Value Format
        case "JMP":
        case "SCALL":
          if (line.length === 2)
            byteCode = this.OPERATIONS[opCode] + this.immediateValueFormat(line[1], true);
          else
            this.errors.push({});
          break;
        case "RET":
          if (line.length === 2) {
            let value = this.immediateValueFormat(line[1], false);
            if (this.isValidHex("0x" + value, 2)) {
              value = (parseInt(value, 16) + 1).toString(16);
              value = value.length < 2 ? "0" + value : value;
              byteCode = this.OPERATIONS[opCode] + value;
            }
            else { //should never reach here
              byteCode = this.OPERATIONS[opCode] + "01";
              this.errors.push({});
            }
          }
          else
            byteCode = this.OPERATIONS[opCode] + this.immediateValueFormat("1", false);
          break;
        
        case "STORE": //Aberrants, not conforming exactly to the defined formats.
          if (line.length === 3) {
            if (/\[.+\]/.test(line[1]))
              byteCode = this.OPERATIONS[opCode] + this.registerImmediateFormat(line[2], line[1].slice(1, line[1].length-1), 0, true);
          }
          else
            this.errors.push({});
          break;
        case "RSTORE":
          if (line.length === 3) {
            if (/\[.+\]/.test(line[1])) {
              let firstOperand = line[1].split("[");
              byteCode = this.OPERATIONS[opCode] + this.offsetDoubleRegisterFormat(firstOperand[0], firstOperand[1].slice(0, firstOperand[1].length-1), line[2]);
            }
            else {
              this.errors.push({});
            }
          }
          else
            this.errors.push({}); 
          break;
        case "RLOAD":
          if (line.length === 3) {
            if (/\[.+\]/.test(line[2])) {
              let secondOperand = line[2].split("[");
              byteCode = this.OPERATIONS[opCode] + this.offsetDoubleRegisterFormat(secondOperand[0], secondOperand[1].slice(0, secondOperand[1].length-1), line[1]);
            }
            else {
              this.errors.push({});
            }
          }
          else
            this.errors.push({});
          break;
        case "SRET":
          byteCode = this.OPERATIONS[opCode] + "01";
          break;
        case "HALT":
        case "NOOP":
          byteCode = this.OPERATIONS[opCode] + "000";
          break;
        default:
          this.errors.push({});
          byteCode = "0000";
      }

      if (!isPseudoOp) {
        this.assembledCode[address++] = byteCode.slice(0, 2).toUpperCase();
        this.assembledCode[address++] = byteCode.slice(2, 4).toUpperCase();
      }
      isPseudoOp = false;
    }

    console.log(this.assembledCode);
  };

  //Helper Functions
  
  /*
   * Triple Register Format - Handles all operations that have only 3 registers in their operands. The last argument is an optional errors object
   *                          that will get an 'invalidOperand' attribute attached to it with the error information.
   */
  private tripleRegisterFormat(destReg: string, srcRegA: string, srcRegB: string, errors?): string {
    let validDestReg = this.isValidRegister(destReg), validSrcRegA = this.isValidRegister(srcRegA),
        validSrcRegB = this.isValidRegister(srcRegB), operand = "";
    
    operand += validDestReg ? this.resolveRegister(destReg) : "0";
    operand += validSrcRegA ? this.resolveRegister(srcRegA) : "0";
    operand += validSrcRegB ? this.resolveRegister(srcRegB) : "0";
    if (errors && (!validDestReg || !validSrcRegA || !validSrcRegB))
      errors.invalidOperand = destReg + ": " + validDestReg + ", " + srcRegA + ": " + validSrcRegA + ", " + srcRegB + ": " + validSrcRegB;
    return operand;
  };
  
  /*
   * Double Registe Format - Handles all operations that have only 2 registers for their operands. The last argument is an optional errors object
   *                         that will get an 'invalidOperand' attribute attached to it with the error information.
   */
  private doubleRegisterFormat(destReg: string, srcReg: string, errors?): string {
    let validDestReg = this.isValidRegister(destReg), validSrcReg = this.isValidRegister(srcReg), operand = "";
    
    operand += validDestReg ? this.resolveRegister(destReg) : "0";
    operand += validSrcReg ? this.resolveRegister(srcReg) : "0";
    if (errors && (!validDestReg || !validSrcReg))
      errors.invalidOperand = destReg + ": " + validDestReg + ", " + srcReg + ": " + validSrcReg;
    return operand;
  };

  /*
   * Single Register Format - Designed to validate a single nibble of an operand to a valid register, or flag as an error.
   */
  private singleRegisterFormat(destReg: string, errors?): string {
    let validDestReg = this.isValidRegister(destReg), operand = "";

    operand += validDestReg ? this.resolveRegister(destReg) : "0";
    if (errors && !validDestReg)
      errors.invalidOperand = destReg + ": " + validDestReg;
    return operand + "0";
  };

  /*
   * Register Immediate Format -
   *  size === 0 means ignore size 
   */
  private registerImmediateFormat(destReg: string, immediateValue: string, size: number, labels?: boolean, errors?): string {
    let validDestReg = this.isValidRegister(destReg), label = this.labelAddrMap[immediateValue], operand = "";

    operand += validDestReg ? this.resolveRegister(destReg) : "0";
    if (label) {
      label = label.toString(16);
      if (size > 0 && label.length <= size) {
        let padding = "0".repeat(size - label.length);
        operand += padding + label;
      }
      else if (size > 0 && label.length >= size) {
        operand += "0".repeat(size);
        if (errors)
          errors.inValidOperand = destReg + ": " + validDestReg + ", " + immediateValue + ": false";
      }
      else if (size <= 0) { //ignore size
        let padding = "0".repeat(2 - label.length);
        operand += padding + label;
      }
    }
    else {
      operand += this.resolveNumericArg(immediateValue, 2, true, errors);
  }
    return operand;
  };

  private immediateValueFormat(immediateValue: string, labels?: boolean, errors?): string {
    let label = this.labelAddrMap[immediateValue];

    if (labels && label) {
      let operand = label.toString(16), padding = operand.length === 1 ? "0" : "";
      return padding + operand;
    }
    else {
      return this.resolveNumericArg(immediateValue, 2, true, errors);
    }
  };

  private offsetDoubleRegisterFormat(offset: string, destReg: string, srcReg: string, errors?): string {
    let validOffset = this.isValidInt(offset, 1, /^-/.test(offset)) || this.isValidHex(offset, 1), validDestReg = this.isValidRegister(destReg), 
        validSrcReg = this.isValidRegister(srcReg),operand = "";

    operand += validOffset ? this.resolveNumericArg(offset, 1) : "0";
    operand += validDestReg ? this.resolveRegister(destReg) : "0";
    operand += validSrcReg ? this.resolveRegister(srcReg) : "0";
    if (errors && (!validOffset || !validDestReg || !validSrcReg))
      errors.invalidOperand = offset + ": " + validOffset + ", " + destReg + ": " + validDestReg + ", " + srcReg + ": " + validSrcReg;
    return operand;
    
  };

  private isValidHex(value: string, size: number): boolean {
    let hex = new RegExp("0x[0-9A-Fa-f]{1," + size + "}", "g");
    return hex.test(value) && value.length <= size + 2;
  };

  private isValidInt(value: string, size: number, negative?: boolean): boolean {
    let int = negative ? new RegExp("-[0-9]{1," + size + "}", "g") : new RegExp("[0-9]{1," + size + "}", "g");
    return int.test(value) && value.length <= (negative ? size + 1 : size);
  };

  /*
   * isValidLabel - Determines if a label is valid based on two criteria.
   *               1.) A label is alpha-numeric (no spaces or special characters).
   *               2.) A label is not a reserved word (Operations or Pseudo-Ops).
   */
  private isValidLabel(value: string): boolean {
    //Alpha-numeric, no ops or Pseudo-Ops
    return /[0-9a-zA-Z]+:/.test(value) &&
      Object.keys(this.OPERATIONS).filter((op) => {
        return op.toLowerCase() === value.toLowerCase()
      }).length === 0 &&
      this.PSEUDOOPS.filter((pseudoOp) => {
        return pseudoOp.toLowerCase() === value.toLowerCase()
      }).length === 0;
  };

  private isValidRegister(value: string, register?: string): boolean {
    if (register)
      return /RBP|RSP|R[0-9a-fA-F]{1}/.test(value) && value === register;
    return /RBP|RSP|R[0-9a-fA-F]{1}/.test(value);
  };

  private resolveNumericArg(num: string, size: number, padding?: boolean, errors?): string {
    let negative = num.slice(0, 1) === "-", numericArg = "0".repeat(size);
    if (this.isValidHex(num, size)) {
      numericArg = num.slice(2);
      return padding ? "0".repeat(size-numericArg.length) + numericArg : numericArg;
    }
    else if (this.isValidInt(num, size, negative)) {
        let value;
        if (negative) {
          let max = parseInt("F".repeat(size), 16) + 1;
          value = max - parseInt(num.slice(1));
        }
        value = value ? value.toString(16) : parseInt(num).toString(16);
        return padding ? "0".repeat(size - value.length) + value : value;
    }
    else if (errors)
      errors.invalidOperand = num + ": true";
    return numericArg;
  };

  private resolveRegister(value: string): string {
    if (value.toUpperCase() === "RSP")
      return "E";
    else if (value.toUpperCase() === "RBP")
      return "D";
    else
      return value.charAt(1);
  }

  public getAssembledCode(): string[] {
    return this.assembledCode;
  }
};
