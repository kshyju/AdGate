import { Recommendation } from "./Recommendation";

export class RuleResult {

    public recommendations: Recommendation[];
    public meta:any;
    constructor(recommendations:Recommendation[])
    {
      this.recommendations = recommendations;

    }
  }
