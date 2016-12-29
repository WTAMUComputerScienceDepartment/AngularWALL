import { Component, OnInit, Input, animate, trigger, state, style, transition } from "@angular/core";

@Component({
    selector: "machine-table",
    templateUrl: "app/public/components/machineTable/machineTable.component.html",
    providers: [],
    styleUrls: ["app/public/components/machineTable/machineTable.component.css"],
    animations: [
      trigger("selectedCell", [
        state("inactive", style({})),
        state("activeIP", style({
          background: "#5477af",
          color: "white"
        })),
        state("activeSP", style({
          background: "#54a35b",
          color: "white"
        })),
        state("activeBP", style({
          background: "#a3545f",
          color: "white"
        })),
        transition("inactive => *", animate("100ms ease-in")),
        transition("* => inactive", animate("100ms ease-out"))
      ])
    ]
})

export class MachineTableComponent implements OnInit {
    @Input() dimension: number = 16;
    @Input() machineState: string[][];
    @Input() verticalHeader: string[] = [
        "RAM", "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F"
    ];
    @Input() horizontalHeader: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F"
    ];
    @Input() pswIP: string;
    @Input() stackPointer: string;
    @Input() basePointer: string;

    ngOnInit() {
        if (!this.machineState) {
            this.machineState = new Array(this.dimension);
            for (let i = 0; i < this.dimension; i++) {
                this.machineState[i] = [];
                for (let j = 0; j < this.dimension; j++) {
                    this.machineState[i][j] = "00";
                }
            }
        }
    };

    activeCell(row, col): string {
      if (parseInt(this.pswIP.substring(0, 1), 16) === row && parseInt(this.pswIP.substring(1, 2), 16) === col)
        return "activeIP";
      if (parseInt(this.stackPointer.substring(0, 1), 16) === row && parseInt(this.stackPointer.substring(1, 2), 16) === col)
        return "activeSP";
      if (parseInt(this.basePointer.substring(0, 1), 16) === row && parseInt(this.basePointer.substring(1, 2), 16) === col)
        return "activeBP";    };
}
