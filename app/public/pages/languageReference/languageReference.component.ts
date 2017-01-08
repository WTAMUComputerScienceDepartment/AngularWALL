import { Component, Input } from "@angular/core";

import { OperationFilterPipe } from "./operationFilter.pipe";

import { Operation } from "./operation";
import { OPERATIONS } from "./operations";

@Component({
    selector: "languageReference",
    templateUrl: "app/public/pages/languageReference/languageReference.component.html",
    styleUrls: ["app/public/app.component.css", "app/public/pages/languageReference/languageReference.component.css"]
})

export class LanguageReferenceComponent {
  columns: String[] = Object.keys(OPERATIONS[0]);
  operations: Operation[] = OPERATIONS;

  filter: Operation = new Operation();

  operationsFilter(): any {
    let result = [];

    for (let prop in this.filter) {
      for (let i = 0; i < this.operations.length; i++) {
        if (this.operations[i][prop].includes(this.filter[prop]))
          result.push(this.operations[i]);
      }
    }

    return result;
  };
}
