import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "console",
    templateUrl: "app/public/components/console/console.component.html",
    providers: []
})

export class ConsoleComponent implements OnInit {
    @Input() content: string[] = ["No Content"];
    @Input() rows: number = 6;
    @Input() title: string;

    ngOnInit(){};

    formatContent() {
        let result = "";
        for (let i = 0; i < this.content.length; i++) {
            result += this.content[i];
        }
        return result;
    };
}
