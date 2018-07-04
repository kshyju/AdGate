
let express = require("express");
import { Runner } from "../runner"
import { MSSql } from "../resultformatter/MSSql";

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
    const mssql = new MSSql();
    var resultItems = await mssql.getDetails(req.params.id)
    res.render("details", { resultItems: resultItems });
}

/**
 * POST  /
 * Analyse endpoint
 */
export let analyse = async function (req: any, res: any) {

    var r = new Runner();

    var requestId = await r.runRules(req.body.reqUrl, 1000);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ requestId: requestId }));
}