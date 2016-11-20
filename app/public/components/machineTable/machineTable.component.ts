import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "machine-table",
    templateUrl: "app/public/components/machineTable/machineTable.component.html",
    providers: [],
    styleUrls: ["app/public/components/machineTable/machineTable.component.css"]
})

export class MachineTableComponent implements OnInit {
    @Input() dimension: number = 16;
    @Input() machineState: string[][];
    @Input() verticalHeader: string[] = [
        "", "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F",
    ];
    @Input() horizontalHeader: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F",
    ];

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
}
