const express = require("express");
const bodyParser = require("body-parser");

const API_KEY = process.env.API_KEY; // Railway Shared Variable

const app = express();
app.use(bodyParser.json());

let messageQueue = [];

// Recebe mensagens do Roblox
app.post("/fromRoblox", (req, res) => {
  const { key, userId, action, value } = req.body;
  if (key !== API_KEY) return res.status(403).send("Acesso negado!");
  console.log(`[ROBLOX -> API] ${userId} fez ${action} com valor ${value}`);
  res.send({ status: "ok" });
});

// Recebe retorno do Roblox para Discord
app.post("/toDiscord", async (req, res) => {
  const { key, action, discordId, content } = req.body;
  if (key !== API_KEY) return res.status(403).send("Acesso negado!");

  console.log(`[ROBLOX -> DISCORD] (${action}) ${discordId}: ${content}`);

  // Aqui você pode processar com interação do Discord, se quiser
  return res.send({ status: "ok" });
});

// Node para Roblox checar mensagens
app.post("/toRoblox", (req, res) => {
  const { key, action, user, content } = req.body;
  if (key !== API_KEY) return res.status(403).send("Acesso negado!");

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

// Porta Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌍 API rodando na porta ${PORT}`);
});
