MachineTable

  A component that takes the values of a 2-D array and displays them in a 2-D
  table (with both vertical and horizontal header). 3 hooks are also provided to
  allow for the addition of animation to cells.

  Bindings
    dimension:  determines the size of the table, Dim x Dim
      default:  16
    machineState: a 2-D array that represents the active state of each cell in
                  the table
      default: 16x16 2-D array
    verticalHeader: The table header across the top of the table
      default: ["RAM", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
    horizontalHeader: The table header across the first column of the table
      default: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
    pswIP: A hex string that is used to determine which cell should be hi-lighted
           with the animate state 'activeIP'
      default: none
    stackPointer: A hex string that is used to determine which cell should be
                  hi-lighted with the animate state 'activeSP'
      default: none
    basePointer: A hex string that is used to determine which cell should be
                 hi-lighted with the animate state 'activeBP'
      default: none
