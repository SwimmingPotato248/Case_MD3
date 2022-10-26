const connection = require("./database");
const sql = `SELECT * FROM Post`;

connection.query(sql, (e, results, fields) => {
  if (e) throw e;
  console.log(results);
});
