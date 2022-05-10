const setupDb = require('./src/db/db-setup');
const express = require('express');
const helmet = require('helmet')
const logger = require('./src/utils/pinoLogger')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./src/utils/swagger')

require('dotenv').config()

const app = express()
let port = process.env.APP_PORT

setupDb();

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(cookieParser());


// Router
require("./src/routes")(app);

app.listen(port, (req, res) => {
    logger.info(`Server running on http://localhost:${port}`);
    swaggerDocs(app, port)
})