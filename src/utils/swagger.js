const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const pathRoute = path.resolve(__dirname, "../routes/*.route.js")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rest API",
      version: "1.0.0",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Rest API Documentation",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [pathRoute],
};

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, port) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = swaggerDocs