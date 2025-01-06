const WebSocket = require("ws");
const http = require("http");

const ws = new WebSocket("ws://<NODE_IP>:3000"); // Connect to the VPS WebSocket server
const localHost = "http://localhost:8080"; // Your local server

ws.on("open", () => {
    console.log("Connected to VPS");
});

ws.on("message", (message) => {
    const request = JSON.parse(message);

    // Forward the request to the local server
    const options = {
        method: request.method,
        headers: request.headers,
    };

    const chunks = [];
    const req = http.request(localHost + request.url, options, (res) => {
        const response = {
            status: res.statusCode,
            headers: res.headers,
        };

        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
            response.body = Buffer.concat(chunks).toString("base64"); // Encode binary data as Base64
            ws.send(JSON.stringify(response)); // Send back to VPS
        });
    });

    req.on("error", (err) => {
        ws.send(JSON.stringify({ status: 500, headers: {}, body: "Error forwarding request" }));
    });

    req.write(Buffer.from(request.body, "base64")); // Decode Base64 back to binary
    req.end();
});

ws.on("close", () => {
    console.log("Disconnected from VPS");
});
