// api/index.js (NOVO CÓDIGO DO SERVIDOR)

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os'); // Importar o módulo os

const app = express();

// O Vercel lida com arquivos estáticos de outra forma, então removemos isso.
// app.use(express.static('public')); 
// app.use('/optimized', express.static(path.join(__dirname, 'optimized')));

// No ambiente serverless do Vercel, as pastas de escrita são temporárias.
// Usamos o diretório temporário do sistema operacional.
const uploadsDir = path.join(os.tmpdir(), 'uploads');
const optimizedDir = path.join(os.tmpdir(), 'optimized');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

// A rota agora será /api/optimize
app.post('/api/optimize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    try {
        const { path: tempPath, originalname, size: originalSize } = req.file;

        const optimizedBuffer = await sharp(tempPath)
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        fs.unlinkSync(tempPath); // Limpa o arquivo temporário

        // Se o otimizado for maior, envie o buffer original
        const finalBuffer = (optimizedBuffer.length < originalSize) ? optimizedBuffer : fs.readFileSync(tempPath);
        const finalSize = finalBuffer.length;
        
        let statusMessage = (finalBuffer.length < originalSize) ? "Otimizada com sucesso!" : "Já estava otimizada!";

        // Enviar a imagem como um buffer codificado em base64
        const base64Image = finalBuffer.toString('base64');
        const mimeType = 'image/jpeg';

        res.json({
            success: true,
            originalName: originalname,
            originalSize: Math.round(originalSize / 1024),
            optimizedSize: Math.round(finalSize / 1024),
            status: statusMessage,
            imageData: `data:${mimeType};base64,${base64Image}` // A imagem é enviada diretamente
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao otimizar a imagem.' });
    }
});

// Removemos app.listen e exportamos o app. O Vercel cuida do resto.
module.exports = app;