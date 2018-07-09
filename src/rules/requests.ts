import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

const url = require("url");

export class Requests {
  ruleResult = new RuleResult([]);
  reqData: any = {};

  constructor() {
    this.ruleResult.recommendations = [];
  }

  listen(page: any) {
    let t = this;
    page.on("request", function(request: any) {
      console.log('re',t.reqData);
      t.reqData[request._requestId] = {
        url: request._url,
        type: request._resourceType
      };
    });

    page.on("requestfailed", function(request: any) {
      var r = t.reqData[request._requestId];
      r.status = -1;
      r.method = request._method;
    });

    page.on("requestfinished", function(request: any) {
      console.log('re2',t.reqData);

      var r = t.reqData[request._requestId];
      if (r != undefined) {
        r.status = request._response._status;
        r.method = request._method;
      }
    });
  }

  results(): RuleResult {

    let requests: any[] = [];
    let t=this;
    Object.keys(t.reqData).forEach(function(key, index) {
      requests.push(t.reqData[key]);
    });

    var hostNames = requests.map(function(item: any) {
      return url.parse(item.url).hostname;
    });

    var uniqueHostNames = hostNames.filter((v, i, a) => a.indexOf(v) === i);

    // Recommendation for too many DNS lookups
    var dnsLookupRuleStatus = 1;
    if (uniqueHostNames.length > 3 && uniqueHostNames.length <= 5) {
      dnsLookupRuleStatus = 2;
    } else if (uniqueHostNames.length >= 6) {
      dnsLookupRuleStatus = 3;
    }
    var dnsLookupCountResult = new Recommendation("dns", dnsLookupRuleStatus);
    this.ruleResult.recommendations.push(dnsLookupCountResult);

    // Recommendation for too many external calls
    var tooManyNetworkCallsStatus = 1;
    if (hostNames.length > 4 && hostNames.length <= 7) {
      tooManyNetworkCallsStatus = 2;
    } else if (uniqueHostNames.length > 7) {
      tooManyNetworkCallsStatus = 3;
    }
    var tooManyNetworkCalls = new Recommendation(
      "too-many-network-calls",
      tooManyNetworkCallsStatus
    );
    this.ruleResult.recommendations.push(tooManyNetworkCalls);

    // Recommendation for redirect response ?
    var redirectResponseStatus = 1;
    if (hostNames.length >= 1 && hostNames.length <= 2) {
      redirectResponseStatus = 2;
    } else if (uniqueHostNames.length > 2) {
      redirectResponseStatus = 3;
    }
    var tooManyNetworkCalls = new Recommendation(
      "redirects",
      redirectResponseStatus
    );
    this.ruleResult.recommendations.push(tooManyNetworkCalls);
    //this.ruleResult.meta = this.requests;
    return this.ruleResult;
  }
}
