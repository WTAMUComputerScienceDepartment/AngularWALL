import { Component } from "@angular/core";

@Component({
    selector: "home",
    templateUrl: "app/public/pages/home/home.component.html",
    styleUrls: ["app/public/pages/home/home.component.css"]
})

export class HomeComponent {
    pswState: string[] = ["00", "00 00"];
    registerState: string[] = [
        "00", "00", "00", "00", "00", "00", "00", "00", "00",
        "00", "00", "00", "00", "FF", "FF", "00"
    ];
    pswHorizontalHeader: string[] = ["IP", "IR"];
}
