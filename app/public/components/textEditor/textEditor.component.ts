import { Component, EventEmitter, Input, Output } from "@angular/core";

// import * as ace from "ace-builds";

@Component({
  selector: "text-editor",
  templateUrl: "app/public/components/textEditor/textEditor.component.html",
  providers: [],
  styleUrls: ["app/public/components/textEditor/textEditor.component.css"]
})

export class TextEditorComponent {
  @Input() userInput: string = "";
  @Output() emitUserInput: EventEmitter<String> = new EventEmitter<String>();
};
