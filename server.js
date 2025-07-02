// server.js (VERSÃO FINAL PARA HOSPEDAGEM)

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os'); // Usado para encontrar a pasta temporária do sistema

const app = express();
const PORT = 3000; // O Render vai ignorar isso, mas é bom para o teste local

// Servir os arquivos estáticos da pasta 'public' (index.html, style.css, etc.)
app.use(express.static('public'));

// Configuração do Multer para salvar o upload em uma pasta temporária
const upload = multer({ dest: os.tmpdir() });

app.post('/optimize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    try {
        const { path: tempPath, originalname, size: originalSize } = req.file;

        const optimizedBuffer = await sharp(tempPath)
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        fs.unlinkSync(tempPath); // Limpa o arquivo original temporário imediatamente

        // Decide qual buffer usar (o otimizado ou o original se não houver melhora)
        const originalFileBuffer = fs.readFileSync(req.file.path);
        const finalBuffer = (optimizedBuffer.length < originalSize) ? optimizedBuffer : originalFileBuffer;
        const finalSize = finalBuffer.length;
        
        let statusMessage = (finalBuffer.length < originalSize) ? "Otimizada com sucesso!" : "Já estava otimizada!";

        // Envia a imagem de volta como um dado base64, em vez de um link
        const base64Image = finalBuffer.toString('base64');
        const mimeType = 'image/jpeg';

        res.json({
            success: true,
            originalName: originalname,
            originalSize: Math.round(originalSize / 1024),
            optimizedSize: Math.round(finalSize / 1024),
            status: statusMessage,
            imageData: `data:${mimeType};base64,${base64Image}` // A imagem é enviada diretamente na resposta JSON
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao otimizar a imagem.' });
    }
});

// O Render vai usar a porta que ele mesmo definir, mas o listen é necessário
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});