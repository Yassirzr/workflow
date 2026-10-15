'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const allowed = new Set(['index.html', 'style.css', 'pipeline.js', 'script.js']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const port = Number(process.env.PORT || 3000);
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const requested = url.pathname === '/' ? 'index.html' : url.pathname.substring(1);
  if (!allowed.has(requested)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — Fichier introuvable');
    return;
  }
  const body = fs.readFileSync(path.join(root, requested));
  res.writeHead(200, { 'Content-Type': types[path.extname(requested)] });
  res.end(body);
}).listen(port, () => console.log(`✓ Ouvre http://localhost:${port}`));
