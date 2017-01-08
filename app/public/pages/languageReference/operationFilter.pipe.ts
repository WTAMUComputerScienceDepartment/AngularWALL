import { Pipe, PipeTransform } from '@angular/core';

import { Operation } from './operation';

@Pipe({ name: 'operationFilter', pure: false })
export class OperationFilterPipe implements PipeTransform {
  transform(operations: Operation[], filter: Operation) {
    return operations.filter(op => {
      let result = true;
      for (let key in filter) {
    		if (filter[key] !== "" && op[key].toLowerCase().includes(filter[key].toLowerCase())) {
    			result = true;
    		}
        else if (filter[key] !== "")
          result = false;
    	}
    	return result;
    });
  };
};
