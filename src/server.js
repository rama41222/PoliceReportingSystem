/* eslint-disable */
require('dotenv').config();
const { bootstrap } = require('./lib');
const { app } = require('./config');

let server;

async function main() {
  server = await bootstrap();
  server.listen(app.port, (e) => {
    if (e) {
      throw new Error(e.message);
    }
    console.info(`Listening on port ${app.port}`);
  });
}

main().catch((e) => console.error(e.message));
module.exports = server;
