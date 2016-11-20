import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "register-table",
    templateUrl: "app/public/components/registerTable/registerTable.component.html",
    providers: [],
    styleUrls: ["app/public/components/registerTable/registerTable.component.css"]
})

export class RegisterTableComponent implements OnInit {
    @Input() numberOfRegisters: number = 16;
    @Input() registerState: string[] = [
        "00", "00", "00", "00", "00", "00", "00", "00", "00",
        "00", "00", "00", "00", "00", "00"
    ];
    @Input() verticalHeader: string[] = ["Register", "Content"];
    @Input() horizontalHeader: string[] = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F",
    ];
    @Input() contentSpacing: number;

    ngOnInit(){};

    formatRegisterState(value: string): string {
      return "";
    };
}
