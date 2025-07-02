// public/script.js (VERSÃO COMPLETA E ATUALIZADA)

// Seleciona os elementos do DOM uma única vez para melhor performance
const uploadForm = document.getElementById('upload-form');
const resultArea = document.getElementById('result-area');
const imageInput = document.getElementById('image-input');
const fileLabelText = document.querySelector('.file-label-text');
const submitButton = uploadForm.querySelector('button[type="submit"]');

// Adiciona um listener para mostrar o nome do arquivo selecionado na UI
imageInput.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        // Se um arquivo for selecionado, mostra o nome dele
        fileLabelText.textContent = imageInput.files[0].name;
        fileLabelText.style.color = '#f3f4f6'; // Muda a cor para indicar seleção
    } else {
        // Se nenhum arquivo for selecionado, volta ao texto padrão
        fileLabelText.textContent = 'Clique para selecionar ou arraste uma imagem';
        fileLabelText.style.color = '#9ca3af';
    }
});

// Adiciona o listener para o evento de envio do formulário
uploadForm.addEventListener('submit', async (event) => {
    // Impede o comportamento padrão de recarregar a página
    event.preventDefault();

    // Cria um objeto FormData para enviar os dados do formulário, incluindo o arquivo
    const formData = new FormData(uploadForm);

    // Validação: verifica se um arquivo foi realmente selecionado
    if (imageInput.files.length === 0) {
        resultArea.innerHTML = '<p style="color: #fca5a5;">Por favor, selecione uma imagem.</p>';
        return;
    }

    // Inicia o processo de UI: mostra mensagem de carregamento e desabilita o botão
    resultArea.innerHTML = '<p>Otimizando, por favor aguarde...</p>';
    submitButton.disabled = true;
    submitButton.textContent = 'Otimizando...';

    try {
        // Faz a requisição para a API no Vercel
        // A rota agora é '/api/optimize'
        const response = await fetch('/api/optimize', {
            method: 'POST',
            body: formData,
        });

        // Converte a resposta do servidor de JSON para um objeto JavaScript
        const result = await response.json();
        
        // Verifica se a otimização foi bem-sucedida
        if (result.success) {
            resultArea.innerHTML = ''; // Limpa a mensagem "Otimizando..."
            
            // Calcula a redução de tamanho
            const reduction = result.originalSize - result.optimizedSize;
            const reductionPercent = result.originalSize > 0 ? ((reduction / result.originalSize) * 100).toFixed(1) : 0;
            
            // Monta o HTML do card de resultado
            // A imagem agora vem de 'result.imageData' (em formato base64)
            // O link de download também usa o 'result.imageData'
            const cardHtml = `
                <div class="result-card">
                    <img src="${result.imageData}" alt="Imagem otimizada">
                    <div class="stats">
                        <p>Original: <strong>${result.originalSize} KB</strong></p>
                        <p>Otimizado: <strong>${result.optimizedSize} KB</strong></p>
                        ${reduction > 0 ? `<p class="reduction">Redução de ${reduction} KB (${reductionPercent}%)</p>` : ''}
                    </div>
                    <p class="status ${reduction > 0 ? 'success' : 'neutral'}">${result.status}</p>
                    <a href="${result.imageData}" download="${result.originalName}">Baixar Imagem</a>
                </div>
            `;
            // Insere o card de resultado na página
            resultArea.innerHTML = cardHtml;
        } else {
            // Se o servidor retornar um erro, exibe a mensagem
            resultArea.innerHTML = `<p style="color: #fca5a5;">Erro: ${result.error}</p>`;
        }
    } catch (error) {
        // Captura erros de rede (ex: servidor offline)
        console.error('Fetch error:', error);
        resultArea.innerHTML = '<p style="color: #fca5a5;">Ocorreu um erro de comunicação com o servidor.</p>';
    } finally {
        // Este bloco 'finally' sempre será executado, independentemente de sucesso ou erro
        // Reabilita o botão e restaura o texto original
        submitButton.disabled = false;
        submitButton.textContent = 'Otimizar Agora';
    }
});