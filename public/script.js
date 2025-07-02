// public/script.js (ATUALIZADO)

const uploadForm = document.getElementById('upload-form');
const resultArea = document.getElementById('result-area');
const imageInput = document.getElementById('image-input');
const fileLabelText = document.querySelector('.file-label-text');

// Adiciona um listener para mostrar o nome do arquivo selecionado
imageInput.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        fileLabelText.textContent = imageInput.files[0].name;
        fileLabelText.style.color = '#f3f4f6'; // Muda a cor do texto para indicar seleção
    } else {
        fileLabelText.textContent = 'Clique para selecionar ou arraste uma imagem';
        fileLabelText.style.color = '#9ca3af'; // Volta para a cor padrão
    }
});


uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    if (imageInput.files.length === 0) {
        resultArea.innerHTML = '<p style="color: #fca5a5;">Por favor, selecione uma imagem.</p>';
        return;
    }

    resultArea.innerHTML = '<p>Otimizando, por favor aguarde...</p>';

    try {
        const response = await fetch('/optimize', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
            resultArea.innerHTML = ''; 
            
            const reduction = result.originalSize - result.optimizedSize;
            const reductionPercent = result.originalSize > 0 ? ((reduction / result.originalSize) * 100).toFixed(1) : 0;
            
            const cardHtml = `
                <div class="result-card">
                    <img src="${result.optimizedUrl}" alt="Imagem otimizada">
                    <div class="stats">
                        <p>Original: <strong>${result.originalSize} KB</strong></p>
                        <p>Otimizado: <strong>${result.optimizedSize} KB</strong></p>
                        ${reduction > 0 ? `<p class="reduction">Redução de ${reduction} KB (${reductionPercent}%)</p>` : ''}
                    </div>
                    <p class="status ${reduction > 0 ? 'success' : 'neutral'}">${result.status}</p>
                    <a href="${result.optimizedUrl}" download="${result.originalName}">Baixar Imagem</a>
                </div>
            `;
            resultArea.innerHTML = cardHtml;
        } else {
            resultArea.innerHTML = `<p style="color: #fca5a5;">Erro: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        resultArea.innerHTML = '<p style="color: #fca5a5;">Ocorreu um erro de comunicação com o servidor.</p>';
    }
});