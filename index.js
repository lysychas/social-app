const app = require("./server.js");
require("dotenv").config();
const port = process.env.PORT;

app.listen(port || 3001, () => {
  console.log(`Listening on port ${port}`);
});
