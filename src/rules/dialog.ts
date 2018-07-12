import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Dialog {
  dialogPresent: boolean = false;;
  listen(page: any) {
    let t = this;
    page.on("dialog",  async (dialog:any) => {
      t.dialogPresent=true;
      await dialog.dismiss();
    });


  }

  async results(): Promise<RuleResult> {
    let t = this;

    let ruleResult = new RuleResult("dialog");
    let status= t.dialogPresent?3:1;

    var recommendation = new Recommendation("dialog", status);

    ruleResult.recommendations.push(recommendation);
    return ruleResult;
  }
}
