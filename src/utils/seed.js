const connection = require("./database");

const sql = `SELECT * FROM User LIMIT 3 `
console.log(sql)

connection.query(sql, (e, results, fields) => {
  if (e) throw e;
  console.log("Done");
  console.log(results);
  console.log(fields);
});
