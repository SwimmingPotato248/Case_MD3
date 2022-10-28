const connection = require("./database");

connection.query("DROP TABLE USER;", (e, results, fields) => {
  if (e) throw e;
  console.log("Done");
  console.log(results);
  console.log(fields);
});
