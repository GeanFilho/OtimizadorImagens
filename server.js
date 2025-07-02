// server.js (ATUALIZADO)

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/optimized', express.static(path.join(__dirname, 'optimized')));

const uploadsDir = './uploads';
const optimizedDir = './optimized';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// Mudar para upload.single para aceitar apenas um arquivo
const upload = multer({ 
    storage: storage
});

// A rota agora usa upload.single('image')
app.post('/optimize', upload.single('image'), async (req, res) => {
    // Agora usamos req.file, não req.files
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    try {
        const { path: tempPath, originalname, size: originalSize } = req.file;
        const optimizedFileName = `opt-${originalname}`;
        const outputPath = path.join(optimizedDir, optimizedFileName);

        // Processa a imagem e a armazena em um buffer (em memória)
        const optimizedBuffer = await sharp(tempPath)
            .jpeg({ quality: 80, progressive: true }) // progressive: true pode ajudar na percepção de carregamento
            .toBuffer();

        let finalSize = originalSize;
        let statusMessage = "Já estava otimizada! Usando a original.";

        // *** LÓGICA DE COMPARAÇÃO DE TAMANHO ***
        if (optimizedBuffer.length < originalSize) {
            // Se o buffer otimizado for menor, salve-o no disco
            fs.writeFileSync(outputPath, optimizedBuffer);
            finalSize = optimizedBuffer.length;
            statusMessage = "Otimizada com sucesso!";
        } else {
            // Se for maior ou igual, apenas copie o arquivo original
            fs.copyFileSync(tempPath, outputPath);
        }

        // Apaga o arquivo original temporário da pasta /uploads
        fs.unlinkSync(tempPath);

        res.json({
            success: true,
            originalName: originalname,
            optimizedUrl: `/optimized/${optimizedFileName}`,
            originalSize: Math.round(originalSize / 1024), // em KB
            optimizedSize: Math.round(finalSize / 1024), // em KB
            status: statusMessage
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao otimizar a imagem.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});