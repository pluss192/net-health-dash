# 🖥️ IT Infrastructure & Network Health Dashboard

A real-time network and system monitoring dashboard built to track node latency, device uptime, and host system metrics (CPU/RAM).

## 🚀 Features
- **Real-Time Updates:** Uses WebSockets (`socket.io`) for live ping latency and uptime feeds.
- **Node Monitoring:** Pings key infrastructure targets (DNS servers, local routers, gateways).
- **System Metrics:** Monitors server CPU usage and Memory consumption via `systeminformation`.
- **Modular Design:** Separate Express backend and React client architecture.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, Socket.IO, Ping, Systeminformation
- **Frontend:** React, Tailwind CSS
- **Deployment:** Docker / Docker Compose

## 📄 License
MIT License
