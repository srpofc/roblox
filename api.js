const express = require("express");
const bodyParser = require("body-parser");

const API_KEY = process.env.API_KEY; // Shared Variable Railway

const app = express();
app.use(bodyParser.json());

// Filas separadas por jogo
let queueFusion = [];
let queueBalneario = [];

// ==================== ROTAS GERAIS ==================== //

// Recebe mensagens do Roblox (qualquer jogo)
app.post("/fromRoblox", (req, res) => {
    try {
        const { key, userId, action, value } = req.body;
        if (key !== API_KEY) return res.status(403).send("Acesso negado!");
        console.log(`[ROBLOX -> API] ${userId} fez ${action} com valor ${value}`);
        return res.send({ status: "ok" });
    } catch (err) {
        console.error("Erro em /fromRoblox:", err);
        return res.status(500).send({ status: "erro_interno" });
    }
});

// Recebe mensagens para enviar ao Discord
app.post("/toDiscord", (req, res) => {
    try {
        const { key, action, discordId, content } = req.body;
        if (key !== API_KEY) return res.status(403).send("Acesso negado!");
        console.log(`[ROBLOX -> DISCORD] (${action}) ${discordId}: ${content}`);
        return res.send({ status: "ok" });
    } catch (err) {
        console.error("Erro em /toDiscord:", err);
        return res.status(500).send({ status: "erro_interno" });
    }
});

// ==================== JOGO FUSION ==================== //
app.post("/toRoblox", (req, res) => {
    try {
        const { key, action, content } = req.body;
        if (key !== API_KEY) return res.status(403).send("Acesso negado!");

        if (action === "mensagem") {
            console.log(`[BOT FUSION -> ROBLOX] ${content}`);
            queueFusion.push(content);
            return res.send({ status: "mensagem_recebida" });
        }

        if (action === "check") {
            if (queueFusion.length > 0) {
                const msg = queueFusion.shift();
                return res.send({ status: "mensagem_enviada", content: msg });
            } else {
                return res.send({ status: "ok" });
            }
        }

        return res.send({ status: "ok" });
    } catch (err) {
        console.error("Erro interno /toRoblox:", err);
        return res.status(500).send({ status: "erro_interno" });
    }
});

// ==================== JOGO BALNEÁRIO ==================== //
app.post("/toRobloxBalneario", (req, res) => {
    try {
        const { key, action, content } = req.body;
        if (key !== API_KEY) return res.status(403).send("Acesso negado!");

        if (action === "mensagem") {
            console.log(`[BOT BALNEARIO -> ROBLOX] ${content}`);
            queueBalneario.push(content);
            return res.send({ status: "mensagem_recebida" });
        }

        if (action === "check") {
            if (queueBalneario.length > 0) {
                const msg = queueBalneario.shift();
                return res.send({ status: "mensagem_enviada", content: msg });
            } else {
                return res.send({ status: "ok" });
            }
        }

        return res.send({ status: "ok" });
    } catch (err) {
        console.error("Erro interno /toRobloxBalneario:", err);
        return res.status(500).send({ status: "erro_interno" });
    }
});

// Porta Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 API rodando na porta ${PORT}`);
});
