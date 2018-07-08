import { Debug } from "../debug";
import { Result } from "../types/Result";

export class Console {
  consoleEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("console", function(msg: any) {
      t.consoleEntries.push(msg.text());
    });
  }

  results(): string[] {
    return this.consoleEntries;
  }
}
