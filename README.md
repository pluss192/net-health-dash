# 🖥️ IT Infrastructure & Network Health Dashboard
[![Node.js CI](https://github.com/pluss192/net-health-dash/actions/workflows/ci.yml/badge.svg)](https://github.com/pluss192/net-health-dash/actions/workflows/ci.yml)
A real-time network and system monitoring dashboard built to track node latency, device uptime, host system metrics (CPU/RAM), and historical latency telemetry.

## 🚀 Features
- **Real-Time Updates:** WebSockets (`socket.io`) stream live latency and system health updates every 3 seconds.
- **Latency Telemetry:** Visualizes real-time network latency trends using `recharts`.
- **Node Monitoring:** Periodically pings infrastructure targets (DNS servers, local routers, gateways).
- **Host Metrics:** Displays host CPU load and memory utilization via `systeminformation`.
- **Dockerized:** Packaged for seamless container deployment with Docker Compose.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, Socket.IO, Ping, Systeminformation
- **Frontend:** React, Tailwind CSS, Recharts, Lucide Icons
- **Deployment:** Docker, Docker Compose

## 📦 Getting Started
```bash
git clone https://github.com/pluss192/net-health-dash.git
cd net-health-dash
docker-compose up --build
