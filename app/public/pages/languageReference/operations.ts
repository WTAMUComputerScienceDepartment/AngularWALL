import { Operation } from "./operation";

export const OPERATIONS: Operation[] = [
  {
    operation: "ADD RL,RM,RN",
    opCode: "5L MN",
    example: "ADD R0,R1,R2\nAssembled => 50 12",
    description: "Adds the value in Registers M and N (assuming unsignednumbers) and stores the result in Register L.\nreg[L] := reg[M] + reg[N]"
  },{
    operation: "AND RL,RM,RN",
    opCode: "8L MN",
    example: "AND R1,R2,R3\nAssembled => 81 23",
    description: "Bit-wise AND the bit patterns in Registers M and N andstore the result in Register L.\nreg[L] := reg[M] AND reg[N]"
  },{
    operation: "CALL XY",
    opCode: "60 XY",
    example: "CALL labelorg 0x30\nlabel: bss 0x01\nAssembled => 60 30",
    description: "<ol><li>Pushes the Instruction Pointer onto the stack.</li><li>Places address indicated XY into the Instruction Pointer.</li></ol>Notes: The argument can be a Label, EQU label, int, or hex value.The push causes the Stack Pointer to be decrementedby 1.\nPUSH reg[IP]\nreg[IP] := label (the address of the label)"
  },{
    operation: "HALT",
    opCode: "C0 00",
    example: "HALT\nAssembled => C0 00",
    description: "Halts program execution.\nNote: The last byte of the instruction is ignored."
  },{
    operation: "ILOAD RN,[RM]",
    opCode: "D0 NM",
    example: "ILOAD R1,[R2]\nAssembled => D0 12",
    description: "Indirect Load - loads Register N with the value from memorypointed to by the value in Register M.\nreg[N] := memory[reg[M]]"
  },{
    operation: "ISTORE [RM],RN",
    opCode: "D1 NM",
    example: "ISTORE [RB],RA\nAssembled => D1 AB",
    description: "Indirect Store - stores the value in Register N intothe memory cell pointed to by Register M.\nmemory[reg[M]] := reg[N]"
  },{
    operation: "JMP 0xXY",
    opCode: "B0 XY",
    example: "JMP label\norg 0x30<br>label:<br>Assembled => B0 30",
    description: "Unconditional Jump - loads the Instruction Pointer with the valueindicated by the argument (usually a label), unconditionally.\nreg[IP] := XY"
  },{
    operation: "JMPEQ RN=R0,XY",
    opCode: "BN XY",
    example: "JMPEQ R1=R0,labelorg 0x32<br>label:<br>Assembled => B1 32",
    description: "(Conditional Branch)\nJump Equal To - loads the Instruction Pointer with the valueindicated by XY (usually a label is used instead of an AbsoluteAddress) if the value in Register N is equal to the value inRegister 0; otherwise, execution will continue to the nextsequential instruction in memory.\nif (RN == R0)\n&nbsp;reg[IP] := XY"
  },{
    operation: "JMPLT RN<R0,XY",
    opCode: "FN XY",
    example: "JMPLT R1<R0,label\norg 0x32<br>label:<br>Assembled => F1 32",
    description: "(Conditional Branch)\nJump Less Than -&nbsp;If the value in Register N is less than the valuein Register 0, then it will load the Instruction Pointerwith the value indicated by XY (usually a label is usedinstead of an Absolute Address);\n&nbsp;Otherwise, execution will continue with the nextsequential instruction in memory.\nif (RN < R0)\n&nbsp;reg[IP] := XY"
  },{
    operation: "LOAD RN,[XY]",
    opCode: "1N XY",
    example: "label: db 1\nLOAD R3,[label]<br>Assembled => 13 01",
    description: "Direct Load - loads Register N with the value at addressXY in memory.\nNote: A label can be used in place of an Absolute Address (XY).\nreg[N] := memory[XY]"
  },{
    operation: "LOAD RN,XY",
    opCode: "2N XY",
    example: "LOAD R3,0x01\nAssembled => 23 01",
    description: "Immediate Load - loads Register N with the value XY.\nNote: A label can be used in place of an XY value.\nreg[N] := XY"
  },{
    operation: "MOVE RN,RM",
    opCode: "D2 NM",
    example: "MOVE R1,R2\nAssembled => D2 12",
    description: "Copies the value in Register M to Register N.\nreg[N] := reg[M]"
  },{
    operation: "OR RL,RM,RN",
    opCode: "7L MN",
    example: "OR R1,R2,R3\nAssembled => 71 23",
    description: "Bit-wise OR the bit patterns in Registers M and N, andstore the result in Register L.\nreg[L] := reg[M] OR reg[N]"
  },{
    operation: "POP RN",
    opCode: "65 N0",
    example: "POP RBP\nAssembled => 65 D0",
    description: "<ol><li>Get the value pointed to by the Stack Pointer, andplace it into Register N.</li><li>Increment the Stack Pointer by 1.</li></ol>Note: Last nibble is ignored.\nreg[N] := memory[reg[SP]]\nreg[SP] := reg[SP] + 1"
  },{
    operation: "PUSH RN",
    opCode: "64 N0",
    example: "PUSH R2\nAssembled => 64 20",
    description: "<ol><li>Decrement the Stack Pointer by 1.</li><li>Place value in Register N into the memorycell pointed to by the Stack Pointer.</li></ol>Note: Last nibble is ignored.\nreg[SP] := reg[SP] - 1\nmemory[reg[SP]] := reg[N]"
  },{
    operation: "RET XY",
    opCode: "61 XY",
    example: "RET\nAssembled => 61 01",
    description: "Returns from the current Stack Frame.\nTakes an optional argument; a number (in either hex or dec.),and adds it to the Stack Pointer (RE/RSP) at the end ofexecution (in addition to the default 1 passed to the instruction).If no argument is passed a default of 1 is passed to the instruction(In this case, opcode is 61 01).\nNote: By convention, Register A contains the return value.\n<ol><li>Gets Return Address pointed to by the Stack Pointer andloads it into the Instruction Pointer.</li><li>Increment Stack pointer by 1 + XY</li></ol>reg[IP] := memory[reg[SP]]\nreg[SP] := reg[SP] + 1 + XY"
  },{
    operation: "RLOAD RN,H[RM]",
    opCode: "4H NM",
    example: "RLOAD R1,0x04[R2]\nAssembled => 44 12",
    description: "Relative Load - loads Register N with the value frommemory pointed to by Register M, plus the offset H.\nOffset Range: -8 <= H <= 7\nreg[N] := memory[reg[M] + H]"
  },{
    operation: "ROR RN,XY",
    opCode: "A0 NX",
    example: "ROR R1,4\nAssembled => A0 14",
    description: "Rotate Right - Rotates the bit pattern in Register N one bit to theright X times.\nNote: This is a circular shift, so the bit that istruncated in the low-order nibble is appended to the startof the high-order nibble.\nreg[N] := Reg[N] ROR X"
  },{
    operation: "ROL RN,X",
    opCode: "A1 NX",
    example: "ROL R1,3\nAssembled => A1 13",
    description: "Rotate Left - Rotates the bit pattern in Register None bit to the left X times.\nNote: This is a circular shift; so the bit that istruncated in the high-order nibble is appended to theend of the low-order nibble.\nreg[N] := Reg[N] ROL X"
  },{
    operation: "RSTORE&nbsp;H[RM],RN",
    opCode: "EH MN",
    example: "RSTORE&nbsp;0x04[R2],R1\nAssembled => E4 21",
    description: "Relative Store - stores the value in Register N intothe memory cell pointed to by the address in Register M,plus Offset H.\nOffset Range: -8 <= H <= 7\nmemory[reg[M] + H] := reg[N]"
  },{
    operation: "SCALL XY",
    opCode: "62 XY",
    example: "SCALL label\norg 0x30<br>label: bss 0x01<br>Assembled => 62 30",
    description: "<ol><li>Pushes the Instruction Pointer onto the Stack.</li><li>Places address XY into the Instuction Pointer.</li><li>Pushes the Base Pointer onto the Stack.</li><li>Copies the value in RE(SP) into RD(BP).</li></ol>Notes: The argument can be a Label, EQU label, int, or hex value.Pushes twice, once for the Return Address and once for the Base Pointer.\nPUSH reg[IP]\nreg[IP] := XY (typically a Label)\nPUSH reg[BP]\nreg[BP] := reg[SP]"
  },{
    operation: "SL RN,X",
    opCode: "A4 NX",
    example: "SL R1,0\nAssembled => A4 10",
    description: "Shift Left - Shifts the value in Register N to theleft X number of times. After each shift, the vacantLow-Order bit is filled in with a 0.\nNote: Truncates the high-order bit X number of times.\nreg[N] := reg[N] << X"
  },{
    operation: "SRA RN,X",
    opCode: "A2 NX",
    example: "SRA R1,6\nAssembled => A2 16",
    description: "Shift Right (Arithmetic) - Shifts the value in RegisterN to the right X number of times. After each shift thevacant High-Order bit is filled with the sign bit (1 ifnegative, 0 if positive).\nNote: Truncates the low-order bit X number of times."
  },{
    operation: "SRET",
    opCode: "63 01",
    example: "SRET\nAssembled => 63 01",
    description: "<ol><li>Get Previous Base Pointer pointed to by the StackPointer</li><li>Increment Stack Pointer</li><li>Get Return Address pointed to by the Stack Pointer</li><li>Move the value of the Base Pointer to the StackPointer</li></ol>"
  },{
    operation: "SRL RN,X",
    opCode: "A3 NX",
    example: "SRL R1,8\nAssembled => A3 18",
    description: "Shift Right (Logical) - Shifts the value in RegisterN to the right X number of times. After each shift, thevacant High-Order bit is filled in with a 0.\nNote: Truncates the low-order bit X number of times.\nreg[N] := reg[N] >> X"
  },{
    operation: "STORE [XY],RN",
    opCode: "3N XY",
    example: "Store [0x30],R1\nAssembled => 31 30",
    description: "Direct Store - stores the value in Register N into thememory cell at address XY.\nNote: A label can be used in place of an Absolute Address (XY)\nmemory[XY] := reg[N]"
  },{
    operation: "XOR RL,RM,RN",
    opCode: "9L MN",
    example: "XOR R3,R2,R1\nAssembled => 93 21",
    description: "Bit-wise EXCLUSIVE OR the bit patterns in Registers M andN and store the result in Register L.\nreg[L] := reg[M] XOR reg[N]"
  },{
    operation: "Pseudo-Op",
    opCode: "Example",
    example: "Description",
    description: "BSS"
  },{
    operation: "label: bss 0xXY",
    opCode: "Block Storage Start - allocates a block of memory the",
    example: "DB",
    description: "label: db 0xXY[,0xXY]\nlabel: DB XY[,XY]\nlabel: db 'String'\ndB label"
  },{
    operation: "Data Byte - places the value(s) in memory, starting at the",
    opCode: "EQU",
    example: "label:&nbsp;equ&nbsp;newLabel",
    description: "Equivalent - creates a label to reference hex values, intvalues, other labels, and registers.\nNote: Nested EQU statements are not allowed."
  },{
    operation: "ORG",
    opCode: "org 0xXY",
    example: "Origin - places the next instruction or data byte at the",
    description: "SIP"
  },{
    operation: "SIP 0xXY",
    opCode: "Set Instruction Pointer - tells the Machine where to",
    example: "",
    description: ""
  }
];
