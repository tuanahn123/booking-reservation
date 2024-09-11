const app = require("./src/app");

const PORT = process.env.PORT || 18012

const sever = app.listen(PORT, () => {
    console.log(`Project start with port ${PORT}`);
})
