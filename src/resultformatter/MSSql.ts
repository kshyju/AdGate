const sql = require("mssql");
import { MsSqlConfig } from "../configs/mssqlconfig";

export class MSSql {
  public async publish() {
    const msSqlConfig = new MsSqlConfig();

    const config = msSqlConfig.getConfig();
    let url = "test";
    try {
      let pool = await sql.connect(config);
      let result1 = await pool
        .request()
        .input("requestUrl", sql.NVarChar(250), url)
        .query(
          "INSERT INTO Requests (RequestUrl) VALUES (@requestUrl); select @@identity as Id"
        );

      var id = result1.recordset[0].Id;

      console.dir("NEW ID " + id);
      let r = { success: true, id:id };
      return r;
    } catch (err) {
      console.log(err);

      return;
    }

    sql.on("error", (err: any) => {
      console.log(err);
      return;
    });
  }
}
