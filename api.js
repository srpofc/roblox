const express = require("express");
const bodyParser = require("body-parser");

const API_KEY = process.env.API_KEY; // Railway Shared Variable

const app = express();
app.use(bodyParser.json());

// Filas separadas por jogo
let queueFusion = [];
let queueBalneario = [];

// ==================== ROTAS GERAIS ==================== //
app.post("/fromRoblox", (req, res) => {
  const { key, userId, action, value } = req.body;
  if (key !== API_KEY) return res.status(403).send("Acesso negado!");
  console.log(`[ROBLOX -> API] ${userId} fez ${action} com valor ${value}`);
  res.send({ status: "ok" });
});

app.post("/toDiscord", async (req, res) => {
  const { key, action, discordId, content } = req.body;
  if (key !== API_KEY) return res.status(403).send("Acesso negado!");
  console.log(`[ROBLOX -> DISCORD] (${action}) ${discordId}: ${content}`);
  return res.send({ status: "ok" });
});

// ==================== JOGO FUSION ==================== //
app.post("/toRoblox", (req, res) => {
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

  res.send({ status: "ok" });
});

// ==================== JOGO BALNEÁRIO ==================== //
app.post("/toRobloxBalneario", (req, res) => {
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

  res.send({ status: "ok" });
});

// Porta Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌍 API rodando na porta ${PORT}`);
});
