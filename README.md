
# ProxyLinker

**ProxyLinker** is a Node.js-based reverse proxy system that enables you to access services running on devices behind NAT or firewalls without direct port forwarding. It creates a secure WebSocket tunnel between a Raspberry Pi (or any device) and a VPS, allowing traffic to flow seamlessly.

---

## 🚀 Features

- **Bypass NAT/firewalls**: Access devices that don’t have direct port forwarding.
- **Secure WebSocket tunnel**: Persistent connection between Raspberry Pi and VPS.
- **Binary data support**: Proper handling of images and other binary files.
- **Lightweight**: Simple and efficient Node.js implementation.

---

## 🛠️ How It Works

1. The **Raspberry Pi** (or device without port forwarding) establishes a WebSocket connection to the **VPS**.
2. The **VPS** acts as a reverse proxy, listening for incoming HTTP requests.
3. Incoming traffic on the VPS is forwarded to the Raspberry Pi through the WebSocket connection.
4. The Raspberry Pi processes the request locally and sends the response back to the VPS.
5. The VPS forwards the response to the client.

---

## 📦 Setup Guide

### Prerequisites

- A VPS with a public IP address.
- Node.js and npm installed on both the VPS and Raspberry Pi.
- A local server running on the Raspberry Pi (e.g., a web server on port 8080).

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/proxylinker.git
cd proxylinker
```

---

### 2. Install Dependencies

On both the VPS and Raspberry Pi, install the required Node.js modules:

```bash
npm install ws http
```

---

### 3. Configure and Start the VPS Server

#### File: `vps.js`

Ensure the VPS server script is properly set up with the WebSocket and HTTP server.

Start the VPS server:

```bash
node vps.js
```

The server listens on:
- **WebSocket:** Port `3000` for the Raspberry Pi connection.
- **HTTP Proxy:** Port `8080` for external client requests.

---

### 4. Configure and Start the Raspberry Pi Client

#### File: `raspberry-pi.js`

Update the WebSocket connection URL to point to your VPS:

```javascript
const ws = new WebSocket("ws://<VPS_IP>:3000"); // Replace <VPS_IP> with your VPS's public IP
```

Start the Raspberry Pi client:

```bash
node raspberry-pi.js
```

---

### 5. Test the Setup

1. Start a local server on the Raspberry Pi (e.g., serving content on port `8080`).
2. Visit your VPS's public IP on port `8080` in a browser:

```bash
http://<VPS_IP>:8080
```

You should see the content served by the Raspberry Pi!

---

## 🐞 Debugging

- **Connection issues**: Ensure the Raspberry Pi can reach the VPS on port `3000`.
- **Binary data issues**: Ensure proper Base64 encoding/decoding is implemented.
- **Port conflicts**: Check that no other services are using the specified ports.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## ❤️ Contributions

Contributions are welcome! Feel free to submit a pull request or report issues in the repository.
