import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";
import { resolve } from "url";

export class Errors {
  ruleResult = new RuleResult([]);

  errorEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("error", function(msg: any) {
      t.errorEntries.push(msg.text());
    });
  }

  results(): Promise<RuleResult> {

    return new Promise(function(resolve:any,reject:any) {

      let status= this.errorEntries.length==0?1:2;
      var errorRecommendation = new Recommendation(
        "console-errors",
        status
      );

       this.ruleResult.recommendations.push(errorRecommendation);
       return resolve(this.ruleResult);

    });
  }
}
