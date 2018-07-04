import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
/* import { MSSql } from "./resultformatter/MSSql";
 */import { ValidationResult } from "./types/ValidationResult";

const debug = new Debug();

const imageRule = new ImageRule();
/* const mssql = new MSSql();
 */export class Runner {
  public async runRules(url:string, delay:number) {
    const puppeteer = require("puppeteer");
    debug.log("URL:"+url);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', function(msg:any) {console.log(msg.text()) } );

    await page.goto(url);
    if(delay>0)
    {
      await page.waitFor(1000);
    }   

/*     var requestId = await mssql.saveRequest(url);
 */    // to do : Get all registed rules here
 //  var validationResult:ValidationResult[] = await imageRule.validate(page);
    var a =  await imageRule.validate(page);
    //Promise.all([a]).then(function(ad){
     // console.log(ad);
      //console.log('ValidationResults1:',ad);
    //});
    
    //await browser.close();
/*     await mssql.publish(requestId, validationResult);
 */    return 1; //requestId;
  }
}
