// server.js 

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os'); 

const app = express();

const PORT = process.env.PORT || 3000; 


app.use(express.static('public'));


const upload = multer({ dest: os.tmpdir() });


app.post('/optimize', upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    try {
        const { path: tempPath, originalname, size: originalSize } = req.file;

        // 1. Processa a imagem em memória usando o Sharp
        const optimizedBuffer = await sharp(tempPath)
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        let finalBuffer;
        let statusMessage;

        // 2. Compara os tamanhos e decide qual buffer (versão) da imagem usar
        if (optimizedBuffer.length < originalSize) {
            finalBuffer = optimizedBuffer;
            statusMessage = "Otimizada com sucesso!";
        } else {
            finalBuffer = fs.readFileSync(tempPath);
            statusMessage = "Já estava otimizada!";
        }
        
        // 3. AGORA que já temos o buffer final em memória, podemos apagar o arquivo temporário com segurança.
        fs.unlinkSync(tempPath);

        const finalSize = finalBuffer.length;
        
        // 4. Converte o buffer final para uma string base64 para enviá-lo na resposta JSON.
        const base64Image = finalBuffer.toString('base64');
        const mimeType = 'image/jpeg';

        // 5. Envia a resposta JSON de volta para o frontend.
        res.json({
            success: true,
            originalName: originalname,
            originalSize: Math.round(originalSize / 1024),
            optimizedSize: Math.round(finalSize / 1024),
            status: statusMessage,
            imageData: `data:${mimeType};base64,${base64Image}`
        });

    } catch (error) {
        // Bloco de tratamento de erro. Se algo der errado, isso é executado.
        console.error("Erro no processamento da imagem:", error);

        // Tenta apagar o arquivo de upload se ele ainda existir, para não deixar lixo no sistema.
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erro ao limpar arquivo temporário após falha:", err);
            });
        }
        
        // Envia uma resposta de erro genérica para o frontend.
        res.status(500).json({ error: 'Ocorreu um erro ao otimizar a imagem.' });
    }
});

// Inicia o servidor para escutar por requisições
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
