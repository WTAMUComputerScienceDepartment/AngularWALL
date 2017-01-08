import { Injectable } from "@angular/core";

@Injectable()
export class AssemblerService {
  constructor () {};

  assemble(): void {

  };

  /*
   * passOne - The first pass of the assemble process.
   *           1.) Strips out comments.
   *           2.) Maps "Operations" to addresses
   *           3.) Maps "Labels" to addresses
   *           4.) Marks forward references to be resolved in the second pass.
   */
  passOne(): void {

  };

  /*
   * passTwo - The second pass of the assemble process.
   *           1.) Handles forward References.
   *           2.) Resolves Pseudo-Operations.
   *           3.) Creates byte-code of Operations.
   */
  passTwo(): void {

  };
}
