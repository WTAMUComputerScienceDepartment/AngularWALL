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

    constructor(private machineStateService: MachineStateService, private clockService: ClockService) {
        this.memoryState = this.machineStateService.getMemoryState();
        this.registerState = this.machineStateService.getRegisterState();
        this.pswState = this.machineStateService.getPSWState();
    };

    run(): void {
      this.clockService.run();
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

    speed(): void {

    };
}
