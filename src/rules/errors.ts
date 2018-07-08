import { Debug } from "../debug";
import { Result } from "../types/Result";

export class Errors {
  errorEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("error", function(msg: any) {
      t.errorEntries.push(msg.text());
    });
  }

  results(): string[] {
    return this.errorEntries;
  }
}
