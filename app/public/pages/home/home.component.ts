import { Component, OnInit } from "@angular/core";

import { AssemblerService } from "../../services/assembler.service";
import { MachineStateService } from "../../services/machineState.service";
import { ClockService } from "../../services/clock.service";

@Component({
    selector: "home",
    templateUrl: "app/public/pages/home/home.component.html",
    styleUrls: ["app/public/pages/home/home.component.css"]
})

export class HomeComponent {
    machineCode: string[][];
    memoryState: string[][];
    pswHorizontalHeader: string[] = ["IP", "IR"];
    pswState: string[];
    registerNames: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D (BP)", "E (SP)", "F",
    ];
    registerState: string[];
    speed: { value: number } = { value: 50 };
    speedOptions: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    srcCode: string = "";

    constructor(private machineStateService: MachineStateService, private clockService: ClockService,
        private assemblerService: AssemblerService) {
        this.memoryState = this.machineStateService.memoryState;
        this.registerState = this.machineStateService.registerState;
        this.pswState = this.machineStateService.pswState;
    };

    //Machine Control Buttons

    assemble(): void {
        this.assemblerService.assemble(this.srcCode.split(/\n|\n\r/));
        this.machineCode = this.assemblerService.getAssembledCode();
        this.machineStateService.memoryState = this.machineCode;
    };

    disassemble(): void {

    };

    onTextEditorUpdate(event): void {
        this.srcCode = event;
    };

    reset(): void {

    };

    run(): void {
        this.clockService.run(this.speed.value);
    };

    step(): void {
        this.clockService.step();
    }

    setSpeed(speed: number, $event?): void {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.speed = { value: speed };
    };

    stop(): void {
        this.clockService.stop();
    };

    //Watchers for primitives
    
    getBP(): string {
        return this.machineStateService.registerState[13];
    };

    getIP(): string {
        return this.machineStateService.pswState[0];
    };

    getSP(): string {
        return this.machineStateService.registerState[14];
    };
}
