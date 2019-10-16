const http = require('http');

const port = process.env.PORT || 5000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('This project contains only some cron job.\n');
});

server.listen(port, () => {
  console.log(` Listening on ${ port }`);
});
