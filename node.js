const http = require("http");
const WebSocket = require("ws");

const wsServer = new WebSocket.Server({ port: 3000 }); 
const httpServer = http.createServer();

let piSocket = null; 

wsServer.on("connection", (socket) => {
    console.log("Raspberry Pi connected");
    piSocket = socket;

    socket.on("close", () => {
        console.log("Raspberry Pi disconnected");
        piSocket = null;
    });
});

httpServer.on("request", (req, res) => {
    if (!piSocket || piSocket.readyState !== WebSocket.OPEN) {
        res.statusCode = 502; // Bad Gateway
        return res.end("Raspberry Pi is not connected");
    }

    const payload = {
        method: req.method,
        url: req.url,
        headers: req.headers,
    };

    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
        payload.body = Buffer.concat(chunks).toString("base64"); // Encode binary data as Base64

 
        piSocket.send(JSON.stringify(payload), (err) => {
            if (err) {
                res.statusCode = 500;
                return res.end("Error sending request to Raspberry Pi");
            }
        });

        piSocket.once("message", (message) => {
            const response = JSON.parse(message);
            res.writeHead(response.status, response.headers);
            res.end(Buffer.from(response.body, "base64")); 
        });
    });
});

httpServer.listen(8080, () => {
    console.log("VPS HTTP server listening on port 8080");
});
