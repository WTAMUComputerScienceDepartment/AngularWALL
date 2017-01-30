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
    pswHorizontalHeader: string[] = ["IP", "IR"];
    memoryState: string[][];
    pswState: string[];
    registerState: string[];
    disassembledConsoleContent: string[];
    displayConsoleContent: string[];
    memoryErrorContent: string [];
    speedOptions: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    speed: {value: number} = {value: 50};
    registerNames: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D (BP)", "E (SP)", "F",
    ];

    constructor(private machineStateService: MachineStateService, private clockService: ClockService,
                private assemblerService: AssemblerService) {
        this.memoryState = this.machineStateService.getMemoryState();
        this.registerState = this.machineStateService.getRegisterState();
        this.pswState = this.machineStateService.getPSWState();
    };

    run(): void {
      this.clockService.run(this.speed.value);
    };

    step(): void {
      this.clockService.step();
    }

    stop(): void {
      this.clockService.stop();
    };

    assemble(): void {

    };

    disassemble(): void {

    };

    reset(): void {

    };

    setSpeed(speed: number, $event?): void {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      this.speed = { value: speed };
    };

    getIP(): string {
      return this.machineStateService.getPSWRegister(0);
    };

    getBP(): string {
      return this.machineStateService.getRegister(13);
    };

    getSP(): string {
      return this.machineStateService.getRegister(14);
    };
}
