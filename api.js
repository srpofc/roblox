const express = require("express");
const bodyParser = require("body-parser");

const API_KEY = "SENHA_ULTRA_SECRETA_123";

const app = express();
app.use(bodyParser.json());

let messageQueue = [];

// Roblox -> API
app.post("/fromRoblox", (req, res) => {
    const { key, userId, action, value } = req.body;
    if (key !== API_KEY) return res.status(403).send("Acesso negado!");
    console.log(`[ROBLOX -> API] ${userId} fez ${action} com valor ${value}`);
    res.send({ status: "ok" });
});

// Bot -> Roblox
app.post("/toRoblox", (req, res) => {
    const { key, action, user, content } = req.body;
    if (key !== API_KEY) return res.status(403).send("Acesso negado!");

    if (action === "ban") {
        console.log(`[BOT -> ROBLOX] Banindo jogador: ${user}`);
        return res.send({ status: "banido", user });
    }

    if (action === "mensagem") {
        console.log(`[BOT -> ROBLOX] Nova mensagem enfileirada: ${content}`);
        messageQueue.push(content);
        return res.send({ status: "mensagem_recebida" });
    }

    if (action === "check") {
        if (messageQueue.length > 0) {
            const msg = messageQueue.shift();
            return res.send({ status: "mensagem_enviada", content: msg });
        } else {
            return res.send({ status: "ok" });
        }
    }

    res.send({ status: "ok" });
});

// PORT detectada automaticamente pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌍 API rodando na porta ${PORT}`);
});
