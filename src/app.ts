import initApp from "./server";
import https from "https";
import fs from "fs";
const port = process.env.PORT;
const domain_base = process.env.DOMAIN_BASE

initApp().then((app) => {
  if (process.env.NODE_ENV != 'production') {
    app.listen(port, () => {
      console.log(`App is listening at ${domain_base}`);
    });
  } else {
    const prop = {
      key: fs.readFileSync("../client-key.pem"),
      cert: fs.readFileSync("../client-cert.pem")
    }
    https.createServer(prop, app).listen(port);
    console.log(`App is listening at ${domain_base}`);
  }

});
