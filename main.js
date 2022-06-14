const Fastify = require('fastify')({
    logger: true
  })

  Fastify.register(require('@fastify/cors'));

const getHTML = require('./highlight').getHTML;


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
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            html: { type: 'string' },
            error: { type: 'boolean' },
            errorType: { type: 'string' }
          }
        }
      }
    }
}


Fastify.post('/api/highlight', highlightOpts, async (req, res) => {
    return await getHTML(req.body);
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