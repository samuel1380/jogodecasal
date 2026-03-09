const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos (HTML, CSS, JS e Imagens) da pasta atual
app.use(express.static(path.join(__dirname)));

// Qualquer rota vai para o index.html (fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Jogo rodando na porta ${PORT}`);
});
