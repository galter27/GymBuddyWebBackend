const appInit = require("./server");
const port = process.env.PORT;

const tmpFunc = async () => {
  const app = await appInit();
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
};

tmpFunc();

