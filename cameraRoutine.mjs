// cameraRoutine.mjs

/**
 * Inicializa a rotina de câmera + captura de fotos + download em ZIP.
 *
 * @param {Object} config - Objeto de configuração.
 * @param {string} config.cameraButtonId   - ID do botão que liga a câmera e tira foto.
 * @param {string} config.downloadButtonId - ID do botão que baixa o ZIP.
 * @param {string} config.videoId          - ID do elemento <video>.
 * @param {string} config.canvasId         - ID do elemento <canvas>.
 * @param {string} config.galleryId        - ID da div onde as miniaturas serão exibidas.
 * @param {Object} [config.textos]         - Textos opcionais para o botão principal.
 * @param {string} [config.textos.ligar]       - Texto quando a câmera está desligada.
 * @param {string} [config.textos.fotografar]  - Texto quando a câmera está ligada.
 *
 * @returns {Object} API pública da rotina:
 *  - getImagens(): Array<{id:number, src:string}>
 *  - isCameraAtiva(): boolean
 *  - desligarCamera(): void
 *  - limparGaleria(): void
 */

// Exporta a função para ser usada em outros módulos ES.
export function initCameraRoutine(config) {
    //============================
    // 1. Mapeia elementos via config
    //============================

    // Busca o botão principal da câmera pelo ID passado na configuração.
    const cameraBtn   = document.getElementById(config.cameraButtonId);
    // Busca o botão de download do ZIP pelo ID.
    const downloadBtn = document.getElementById(config.downloadButtonId);
    // Busca o elemento <video> que vai mostrar a câmera.
    const video       = document.getElementById(config.videoId);
    // Busca o elemento <canvas> que será usado para “desenhar” a foto.
    const canvas      = document.getElementById(config.canvasId);
    // Busca a div que será a galeria de miniaturas das fotos.
    const gallery     = document.getElementById(config.galleryId);

    // Verifica se algum desses elementos não foi encontrado.
    if (!cameraBtn || !downloadBtn || !video || !canvas || !gallery) {
        // Se faltar algum, lança um erro para o desenvolvedor.
        throw new Error("Algum dos elementos não foi encontrado. Verifique os IDs passados na config.");
    }

    // Pega o contexto 2D do canvas para conseguir desenhar a imagem da câmera.
    const ctx = canvas.getContext('2d');

    // Define os textos padrão do botão principal, usando os valores da config se existirem.
    const textos = {
        // Texto quando a câmera está desligada.
        ligar: config.textos?.ligar || "📷 Ligar Câmera",
        // Texto quando a câmera está ligada (modo tirar foto).
        fotografar: config.textos?.fotografar || "📸 Tirar Foto"
    };

    //============================
    // 2. Estado interno
    //============================

    // Array que armazena todas as fotos tiradas (cada foto é um objeto com id e src).
    let imagens = [];
    // Flag booleana que indica se a câmera está ativa ou não.
    let cameraAtiva = false;
    // Referência para o stream de vídeo retornado pelo getUserMedia.
    let stream = null;
    // Evita ligar 2x ao mesmo tempo
    let ligandoCamera = false;

    //============================
    // 3. Ligar câmera
    //============================

    // Função assíncrona que liga a câmera e exibe o vídeo no elemento <video>.
    async function ligarCamera(videoElement, buttonElement) {
        try {
            // se já estiver ligando ou já ativa, não faz nada
            if(ligandoCamera || cameraAtiva) return;
                    ligandoCamera = true;
                    
            // Solicita acesso à câmera do dispositivo (vídeo = true, sem áudio).
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            // Atribui o stream de vídeo ao srcObject do elemento <video>.
            videoElement.srcObject = stream;
            // Garante que o vídeo começa a ser reproduzido.
            await videoElement.play();

            // Marca internamente que a câmera está ativa.
            cameraAtiva = true;
            // Atualiza o texto do botão para o modo "tirar foto".
            buttonElement.textContent = textos.fotografar;

            // Loga no console para depuração.
            console.log("Câmera ligada!");
        } catch (error) {
            // Se der erro ao acessar a câmera, mostra um alerta para o usuário.
            alert("Erro ao acessar a câmera.");
            // E registra o erro no console para o desenvolvedor.
            console.error("Erro ao ligar câmera:", error);
        }
    }

    // Função que desliga a câmera (para todas as trilhas do stream).
    function desligarCamera() {
        // Se existe um stream ativo...
        if (stream) {
            // Para todas as trilhas (tracks) do stream (desliga câmera).
            stream.getTracks().forEach(track => track.stop());
        }
        // Remove a referência ao stream do elemento <video>.
        video.srcObject = null;
        // Marca internamente que a câmera não está mais ativa.
        cameraAtiva = false;
        // Volta o texto do botão para "ligar câmera".
        cameraBtn.textContent = textos.ligar;
    }

    //============================
    // 4. Tirar foto
    //============================

    // Função que captura um frame da câmera e transforma em imagem.
    function tirarFoto(videoElement, canvasElement, context, imagensArray, galleryElement) {
        // Ajusta a largura do canvas para a largura do vídeo
        // (ou usa 300 como fallback se ainda não tiver dimensões).
        canvasElement.width  = videoElement.videoWidth  || 300;
        // Ajusta a altura do canvas para a altura do vídeo
        // (ou usa 300 como fallback).
        canvasElement.height = videoElement.videoHeight || 300;

        // Desenha o frame atual do vídeo dentro do canvas.
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Converte o conteúdo do canvas em uma imagem em base64 (formato PNG).
        const imgBase64 = canvasElement.toDataURL("image/png");

        // Cria um objeto representando a foto,
        // usando Date.now() como id único baseado em timestamp.
        const foto = {
            id: Date.now(),
            src: imgBase64
        };

        // Adiciona essa foto ao array de imagens.
        imagensArray.push(foto);
        // Cria e adiciona a miniatura da foto na galeria na tela.
        adicionarMiniatura(foto, galleryElement);
    }

    //============================
    // 5. Miniaturas
    //============================

    // Função responsável por criar a miniatura de uma foto na galeria.
    function adicionarMiniatura(foto, galleryElement) {
        // Cria uma div para ser o “card” da miniatura.
        const div = document.createElement('div');
        // Define uma borda simples ao redor da miniatura.
        div.style.border = "1px solid #ccc";
        // Define um espaçamento interno na miniatura.
        div.style.padding = "5px";
        // Define uma largura fixa para o card.
        div.style.width = "120px";
        // Centraliza o conteúdo dentro da div.
        div.style.textAlign = "center";

        // Cria o elemento <img> que vai exibir a miniatura.
        const img = document.createElement('img');
        // Define a imagem a partir do base64 da foto.
        img.src = foto.src;
        // Ajusta a largura da imagem.
        img.style.width = "100px";

        // Cria um input do tipo checkbox para selecionar a foto.
        const check = document.createElement('input');
        check.type = 'checkbox';
        // O valor do checkbox é o id da foto (para futura referência).
        check.value = foto.id;

        // Adiciona a imagem dentro da div.
        div.appendChild(img);
        // Adiciona uma quebra de linha abaixo da imagem.
        div.appendChild(document.createElement('br'));
        // Adiciona o checkbox abaixo da imagem.
        div.appendChild(check);

        // Finalmente, insere essa miniatura na galeria do HTML.
        galleryElement.appendChild(div);
    }

    //============================
    // 6. Download ZIP
    //============================

    // Função assíncrona que cria um ZIP com as fotos selecionadas e faz o download.
    async function baixarZip() {
        // Verifica se a biblioteca JSZip está carregada na página.
        if (typeof JSZip === "undefined") {
            // Se não estiver, avisa no console e no alert.
            console.error("JSZip não encontrado. Certifique-se de importar a biblioteca JSZip antes.");
            alert("Erro interno: JSZip não carregado.");
            return;
        }

        // Cria uma nova instância de JSZip para montar o arquivo zipado.
        const zip = new JSZip();

        // Seleciona todos os checkboxes marcados dentro da galeria.
        const selecionadas = [...gallery.querySelectorAll('input[type="checkbox"]:checked')];

        // Se nenhuma foto foi selecionada, avisa o usuário e sai.
        if (selecionadas.length === 0) {
            alert("Selecione ao menos uma foto!");
            return;
        }

        // Percorre todas as checkboxes selecionadas.
        selecionadas.forEach((check, index) => {
            // Procura a foto correspondente no array de imagens usando o id.
            const foto = imagens.find(f => f.id == check.value);
            // Se não encontrar a foto (por algum motivo), apenas ignora.
            if (!foto) return;

            // Separa a parte base64 do dataURL (remove "data:image/png;base64,").
            const base64Data = foto.src.split(',')[1];
            // Define um nome de arquivo para cada foto dentro do ZIP.
            const fileName = `foto_${index + 1}.png`;
            // Adiciona o arquivo ao ZIP usando a string base64.
            zip.file(fileName, base64Data, { base64: true });
        });

        // Gera o ZIP final como um Blob (arquivo binário).
        const blob = await zip.generateAsync({ type: "blob" });

        // Cria um link <a> temporário para disparar o download.
        const link = document.createElement('a');
        // Cria uma URL temporária para o blob.
        link.href = URL.createObjectURL(blob);
        // Define o nome do arquivo ZIP que será baixado.
        link.download = "fotos_selecionadas.zip";
        // Simula um clique no link para iniciar o download.
        link.click();

        // Libera a URL temporária da memória.
        URL.revokeObjectURL(link.href);
    }

    //============================
    // 7. Eventos
    //============================

    // Ao iniciar, garante que o texto do botão está no modo "ligar câmera".
    cameraBtn.textContent = textos.ligar;

    // Adiciona o evento de clique ao botão da câmera.
    cameraBtn.addEventListener("click", () => {
        // Se a câmera ainda não está ativa...
        if (!cameraAtiva) {
            // Tenta ligar a câmera.
            ligarCamera(video, cameraBtn);
        } else {
            // Se a câmera já está ativa, então o clique tira uma foto.
            tirarFoto(video, canvas, ctx, imagens, gallery);
        }
    });

    // Adiciona o evento de clique ao botão de download.
    downloadBtn.addEventListener("click", baixarZip);

    //============================
    // 8. API pública
    //============================

    // Retorna um objeto com funções para interação externa com a rotina.
    return {
        // Retorna uma cópia do array de imagens (para evitar manipulação direta).
        getImagens: () => [...imagens],
        // Informa se a câmera está ativa ou não.
        isCameraAtiva: () => cameraAtiva,
        // Expõe a função que desliga a câmera para uso externo.
        desligarCamera,
        // Função que limpa o array de imagens e a galeria visual no HTML.
        limparGaleria: () => {
            // Zera o array de imagens.
            imagens = [];
            // Remove todo o conteúdo da galeria.
            gallery.innerHTML = "";
        }
    };
}
