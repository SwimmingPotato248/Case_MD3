const connection = require("./database");
const { faker } = require("@faker-js/faker");

// const username = faker.internet.userName();
// const password = faker.internet.password();
const sql = `ALTER TABLE Comment
  ADD user_id INT;
`;

connection.query(sql, (e, results, fields) => {
  if (e) throw e;
  console.log(results);
});
