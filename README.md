# 🚀 Otimizador de Imagem Inteligente

Uma ferramenta web simples e de alta performance para otimizar imagens para a web. O projeto foi criado para agilizar o fluxo de trabalho de preparação de imagens para plataformas como o WordPress, garantindo que elas sejam leves sem perder qualidade visual.

### ✨ [Veja a Demo Ao Vivo](https://otimizador-imagens.onrender.com)
*(A primeira inicialização pode levar alguns segundos devido à hibernação do plano gratuito do Render.)*


*(Dica: Tire uma screenshot da sua aplicação funcionando, faça upload no [Imgur](https://imgur.com/upload) e cole o link direto aqui.)*

---

## ✨ Funcionalidades Principais

-   **Upload Simples:** Interface minimalista e intuitiva para enviar uma imagem por vez.
-   **Otimização Automática:** Converte imagens para o formato JPEG com compressão progressiva, um padrão de alta qualidade para a web.
-   **Otimização Inteligente:** O sistema compara o tamanho do arquivo otimizado com o original e só aplica a otimização se o resultado for um arquivo realmente menor. Se a imagem já estiver otimizada, ela é mantida.
-   **Feedback Claro:** Exibe o tamanho original, o tamanho otimizado e o status do processo, informando se a imagem foi otimizada ou se já estava em seu melhor estado.
-   **Download Direto:** Permite baixar a imagem otimizada com um único clique.
-   **Pronto para a Nuvem:** Arquitetura pensada para rodar em plataformas de hospedagem como o Render, usando o sistema de arquivos temporário para um processamento seguro e eficiente.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
-   **Backend:** Node.js, Express.js
-   **Motor de Otimização de Imagem:** `sharp` - A biblioteca de processamento de imagem mais rápida e eficiente para Node.js.
-   **Middleware de Upload:** `multer`

---

## 🏃 Como Rodar Localmente

Para executar este projeto em sua máquina, você precisará ter o Node.js instalado.

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd otimizador-inteligente 
    ```
    *(substitua os nomes conforme seu projeto)*

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    node server.js
    ```

4.  **Abra no navegador:**
    Acesse `http://localhost:3000` e comece a otimizar!

---

## ☁️ Deploy

Este projeto está hospedado na plataforma **Render** e configurado para deploy contínuo. Qualquer `push` para a branch `main` aciona uma nova atualização automática.

-   **Plataforma:** Render
-   **Build Command:** `npm install`
-   **Start Command:** `node server.js`
