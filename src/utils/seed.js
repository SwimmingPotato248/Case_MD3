const connection = require("./database");

const sql = `SELECT * FROM USER LIMIT 1`

connection.query("DROP TABLE USER;", (e, results, fields) => {
  if (e) throw e;
  console.log("Done");
  console.log(results);
  console.log(fields);
});

