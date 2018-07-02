const sql = require("mssql");
import { Debug } from "../debug";

const debug = new Debug();

import { MsSqlConfig } from "../configs/mssqlconfig";
import { ValidationResult } from "../types/ValidationResult";
const msSqlConfig = new MsSqlConfig();

export class MSSql {


  public  async getDetails(id:number): Promise<any>
  {
    const config = msSqlConfig.getConfig();

    const pool = new sql.ConnectionPool(config);
    pool.on("error", (err: any) => {
      console.log("sql errors", err);
    });

    let sqlquery ="SELECT Id,ResourceUrl,Msg from ScaledImages WHERE RequestId=@id";

    try {
      await pool.connect();
      let result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(sqlquery);
      return result.recordset;

    } catch (err) {
      return { err: err };
    } finally {
      pool.close(); //closing connection after request is finished.
    }
  }

  public async saveRequest(url: string): Promise<any> {
    const config = msSqlConfig.getConfig();

    const pool = new sql.ConnectionPool(config);
    pool.on("error", (err: any) => {
      console.log("sql errors", err);
    });

    let sqlquery =
      "INSERT INTO Requests (RequestUrl) VALUES (@requestUrl); select @@identity as Id";

    try {
      await pool.connect();
      let result = await pool
        .request()
        .input("requestUrl", sql.NVarChar(250), url)
        .query(sqlquery);
      const id = result.recordset[0].Id;
      return id;
    } catch (err) {
      return { err: err };
    } finally {
      pool.close(); //closing connection after request is finished.
    }
  }

  public async publish(id: number, validationResults: any): Promise<any> {
    if (validationResults.length == 0) {
      debug.log("No validation results to log!");
      return;
    }

    debug.log(`Logging validation results: ${validationResults.length}`);

    const config = msSqlConfig.getConfig();

    const pool = new sql.ConnectionPool(config);
    pool.on("error", (err: any) => {
      console.log("sql errors", err);
    });

    try {
      await pool.connect();

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
      return;
    } catch (err) {
      return { err: err };
    } finally {
      pool.close(); //closing connection after request is finished.
    }
  }
}
