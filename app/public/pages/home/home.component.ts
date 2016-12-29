import { Component, OnInit } from "@angular/core";

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
    speedOptions: string[] = ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    speed: string = "50%";
    registerNames: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D (BP)", "E (SP)", "F",
    ];

    constructor(private machineStateService: MachineStateService, private clockService: ClockService) {
        this.memoryState = this.machineStateService.getMemoryState();
        this.registerState = this.machineStateService.getRegisterState();
        this.pswState = this.machineStateService.getPSWState();
    };

    run(speed?: string): void {
      if (speed) {
        this.clockService.run(parseInt(speed.substring(0, 2)));
      }
      else {
        this.clockService.run();
      }
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
