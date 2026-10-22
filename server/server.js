const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const ping = require('ping');
const si = require('systeminformation');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const targets = [
  { name: 'Google DNS', host: '8.8.8.8' },
  { name: 'Cloudflare DNS', host: '1.1.1.1' },
  { name: 'Local Gateway', host: '192.168.1.1' }
];

async function checkHealth() {
  const results = [];
  for (const target of targets) {
    const res = await ping.promise.probe(target.host, { timeout: 2 });
    results.push({
      name: target.name,
      host: target.host,
      alive: res.alive,
      time: res.time !== 'unknown' ? parseFloat(res.time) : null
    });
  }

  const sysMem = await si.mem();
  const sysCpu = await si.currentLoad();

  return {
    nodes: results,
    system: {
      cpuLoad: sysCpu.currentLoad.toFixed(1),
      ramUsage: (((sysMem.active) / sysMem.total) * 100).toFixed(1)
    },
    timestamp: new Date().toISOString()
  };
}

io.on('connection', (socket) => {
  const interval = setInterval(async () => {
    const data = await checkHealth();
    socket.emit('metrics', data);
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
