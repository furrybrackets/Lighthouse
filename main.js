const Fastify = require('fastify')({
    logger: true
  })
const bodyParser = require('body-parser');
const fs = require('fs');


const highlightOpts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          theme: { type: 'string' },
          lang: { type: 'string' },
          lineNumbers: { type: 'boolean' },
          fileTheme: { type: 'string' },
          langSpec: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            html: { type: 'string' },
            error: { type: 'boolean' }
          }
        }
      }
    }
}


Fastify.post('/api/highlight', highlightOpts, async (req, res) => {
    return { html: 'world', error: false };
})

const start = async () => {
    try {
      await Fastify.listen({ port: 3000 })
    } catch (err) {
      Fastify.log.error(err)
      process.exit(1)
    }
  }
  start()