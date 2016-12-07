import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "call-stack",
    templateUrl: "app/public/components/callStack/callStack.component.html",
    providers: []
})

export class CallStackComponent implements OnInit {
  @Input() title: string = "Call Stack";
  @Input() stack;

  ngOnInit() {};
}
