import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Console {
  ruleResult = new RuleResult([]);
  consoleEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("console", function(msg: any) {
      t.consoleEntries.push(msg.text());
    });
  }

  results(): Promise<RuleResult> {
    let t=this;
    return new Promise(function(resolve:any,reject:any) {

      let status= t.consoleEntries.length==0?1:2;
      var a = new Recommendation("console-logs", status);

       t.ruleResult.recommendations.push(a);
       return resolve(t.ruleResult);

    });   
  }
}
