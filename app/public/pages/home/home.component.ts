import { Component, OnInit } from "@angular/core";

import { MachineStateService } from "../../services/machineState.service";

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

    constructor(private machineStateService: MachineStateService) {
        this.memoryState = this.machineStateService.getMemoryState();
        this.registerState = this.machineStateService.getRegisterState();
        this.pswState = this.machineStateService.getPSWState();
    };
}
