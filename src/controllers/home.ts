
let express = require("express");
import { Runner } from "../runner"
import { Cosmos } from "../resultformatter/Cosmos";
import { Debug } from "../debug";
import { Result } from "../types/Result";
const url = require('url');

const debug = new Debug();

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: any) => {
    res.render("index", {
        title: "Home"
    });
};

/**
 * GET /
 * Details page with validation results
 */
export let details = async (req: any, res: any) => {
    const mssql = new Cosmos();
    var resultItems = await mssql.getDocument(req.params.id).then(function(document:any){

        //console.log(29);
        //console.log(document);
        let recommendations:any[] = [];


        document.ruleResults.map(function(ruleResult:any) {
            //console.log(key);
            recommendations.push(...ruleResult.recommendations);

        });
        console.log(recommendations);



        res.render("details", { model: document});
    }).catch(function(err){
        debug.log(`ERROR:${err}`);
        res.render("details", { resultItems: [] });
    });

}

/**
 * GET /
 * Details for a specific recommendation * 
 * Ex: /recommendation/005df20b-0a30-673f-9ea7-061ca440ab56/console/rec=console-logs
 * console is the rule name & console-logs is the recommendation name
 */
export let recommendationdetails = async (req: any, res: any) => {
    const mssql = new Cosmos();
    var ruleName = req.params.ruleName;
    console.log(ruleName);
    var recommendationName = req.params.recName;
    console.log(recommendationName);

    var resultItems = await mssql.getDocument(req.params.id).then(function(doc:any){

        var rules = doc.ruleResults.filter((item:any)=>{
            return item.name==ruleName;
        });
        var rule = rules[0];
        console.log('rule',rule.recommendations);
        
        var recommendations = rule.recommendations.filter((r:any)=>{
            return r.name==recommendationName;
        });

        var recommendation = recommendations[0];
        
        var viewName = `partials/recdetails/${recommendationName}`;// recommendationName;

        res.render(viewName, { model: recommendation, meta : rule.meta});
    }).catch(function(err){
        debug.log(`ERROR:${err}`);
        res.render("details", { resultItems: [] });
    });

}

/**
 * POST  /
 * Analyse endpoint
 */
export let analyse = async function (req: any, res: any) {

    var r = new Runner();
    var delay=req.body.delay;
    if(delay>5)
    {
        delay=5;  // Do not want people messing up with delay
    }
    var includeMeta = true;

    var result:Result = await r.runRules(req.body.reqUrl, delay,includeMeta);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
}