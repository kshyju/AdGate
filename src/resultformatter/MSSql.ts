const sql = require("mssql");
import { Debug } from "../debug";

const debug = new Debug();

import { MsSqlConfig } from "../configs/mssqlconfig";
import { ValidationResult } from "../types/ValidationResult";

export class MSSql {
  public async publish(
    url: string,
    validationResults: any
  ): Promise<any> {
    if (validationResults.length == 0) {
      debug.log("No validation results to log!");
      return;
    }

    debug.log(`Logging validation results: ${validationResults.length}`);

    const msSqlConfig = new MsSqlConfig();

    const config = msSqlConfig.getConfig();

    try {
      let pool = await sql.connect(config);
      let result1 = await pool
        .request()
        .input("requestUrl", sql.NVarChar(250), url)
        .query(
          "INSERT INTO Requests (RequestUrl) VALUES (@requestUrl); select @@identity as Id"
        );
      const id = result1.recordset[0].Id;

      for (var i = 0; i < validationResults.length; i++) {
        let item = validationResults[i];
        await pool
          .request()
          .input("requestId", sql.NVarChar(250), id)
          .input("url", sql.NVarChar(250), item.url)
          .input("msg", sql.NVarChar(250), item.msg)
          .query(
            "INSERT INTO ScaledImages (RequestId,ResourceUrl,Msg) VALUES (@requestId,@url,@msg);"
          );
      }
      pool.close();

      return id;
    } catch (err) {
      debug.log(err);
      return;
    }

    sql.on("error", (err: any) => {
      debug.log(err);
      return;
    });
  }
}
