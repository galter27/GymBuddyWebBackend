const app = require("./server");
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

module.exports = app;