const express = require("express")
const router = require("./router")

require("./database")

const app = express()

require("dotenv").config()

require("./controllers/SonicSearch").init()

app.use(express.json())

app.use(router)

app.use(require("./middlewares/errorHandler"))

app.use("/images", express.static("resources/static/assets/uploads"))

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})