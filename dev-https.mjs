/**
 * Custom HTTPS dev server for local mobile testing (gyroscope needs secure context).
 * Usage: node dev-https.mjs
 *
 * Certs at ./certificates/ were generated via:
 *   mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1 0.0.0.0
 */

import { createServer } from 'https';
import { readFileSync } from 'fs';
import { parse } from 'url';
import next from 'next';
import { networkInterfaces } from 'os';

const dev = true;
const hostname = '0.0.0.0';
const port = 3443;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync('./certificates/localhost-key.pem'),
  cert: readFileSync('./certificates/localhost.pem'),
};

function getLanIp() {
  for (const ifaces of Object.values(networkInterfaces())) {
    for (const iface of ifaces ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return null;
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    const lan = getLanIp();
    console.log(`\n▲ Next.js HTTPS dev server`);
    console.log(`  Local:   https://localhost:${port}`);
    if (lan) console.log(`  Network: https://${lan}:${port}  ← open on phone`);
    console.log(`\n  Accept cert warning once on phone (self-signed).\n`);
  });
});
