
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

        console.log(29);
        //console.log(document);
        let requests:any[] = [];
        Object.keys(document.result.requestEntries).forEach(function(key,index) {
            //console.log(key);
            requests.push(document.result.requestEntries[key]);
        });
        console.log(35);
        var hostNames = requests.map(function(item:any) {
            //console.log(url.parse(item.url));
            return url.parse(item.url).hostname;
        });
        console.log(hostNames);
        var uniqueHostNames = hostNames.filter((v, i, a) => a.indexOf(v) === i);
        console.log('unique');
        console.log(uniqueHostNames);

        // convert document to result view model



        res.render("details", { model: document, uniqueHostNames:uniqueHostNames });
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
    var result:Result = await r.runRules(req.body.reqUrl, delay);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
}