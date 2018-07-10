import { Recommendation } from "./Recommendation";

export class RuleResult {

    public name: string;
    public recommendations: Recommendation[];
    public meta:any;
    constructor(name: string)
    {
      this.name = name;
      this.recommendations=[];
    }
  }
