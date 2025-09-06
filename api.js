const express = require("express");
const bodyParser = require("body-parser");

const API_KEY = "SENHA_ULTRA_SECRETA_123";

const app = express();
app.use(bodyParser.json());

let messageQueue = [];

app.post("/fromRoblox", (req, res) => {
    const { key, userId, action, value } = req.body;
    if (key !== API_KEY) return res.status(403).send("Acesso negado!");
    console.log(`[ROBLOX -> API] ${userId} fez ${action} com valor ${value}`);
    res.send({ status: "ok" });
});

app.post("/toDiscord", (req, res) => {
    const { key, action, discordId, content } = req.body;
    if (key !== API_KEY) return res.status(403).send("Acesso negado!");

    console.log(`[ROBLOX -> DISCORD] (${action}) ${discordId}: ${content}`);

    // Aqui você pode devolver só "ok"
    return res.send({ status: "ok" });
});

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

// ---- O segredo do Railway ----
const PORT = process.env.PORT;
if (!PORT) {
    console.error("❌ Porta não encontrada. Certifique-se de rodar no Railway.");
    process.exit(1);
}

// ⚡ bind 0.0.0.0 é obrigatório
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 API rodando na porta ${PORT}`);
});

