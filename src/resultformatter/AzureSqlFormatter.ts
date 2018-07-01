import { Debug } from "../debug";
import { Azure }  from "../configs/azure";
var Connection = require('tedious').Connection,
	Request = require('tedious').Request,
	TYPES = require('tedious').TYPES;
const debug = new Debug();
const azure= new Azure();



export class AzureSqlFormatter {

    publish(url:string, results:any)
    {
        console.log('pub');
    }
     async publish2(url:string, results:any)
    {
        var connection = new Connection(azure.getConfig());

        debug.log("Publishing results using AzureSqlFormatter");
        console.log(results);
        debug.log("before connect");
        connection.on('connect', function(err:any){

            debug.log("inside saveRequest connect");
            let requestId : number;
            var request = new Request("INSERT INTO Requests (RequestUrl) VALUES (@requestUrl); select @@identity", function (err: any) {
                if (err) {
                    debug.log(err);
                }

            });
            request.addParameter('requestUrl', TYPES.NVarChar, url);

            request.on('row', function(columns:any) {
                requestId = columns[0].value;
                console.log('New id: ' +  requestId);
            });

            connection.execSql(request);
            debug.log("after exec");
            let r ={ success : true};
            return new Promise((resolve: Function, reject: Function) => {
                return resolve(r);
              });
        });

    }


}