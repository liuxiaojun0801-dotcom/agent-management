import { getData, setData } from './storage.mjs'

export function dataApiPlugin() {
  return {
    name: 'data-api',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res) => {
        // 只允许 POST 请求
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const { action, name, data } = JSON.parse(body)

            if (action === 'get') {
              const result = getData(name)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, data: result }))
            } else if (action === 'set') {
              setData(name, data)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } else {
              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'Unknown action' }))
            }
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        })
      })
    }
  }
}
