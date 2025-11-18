# 📸 Rotina de Câmera – Captura de Fotos e Download em ZIP

A **Rotina de Câmera** é um pequeno módulo em JavaScript que simplifica o acesso à câmera do navegador. Com ele, você pode

- **Ligar/desligar a câmera** (via API `MediaDevices`).
- **Capturar fotos** e exibi‑las em uma galeria de miniaturas.
- **Baixar as fotos selecionadas** em um arquivo ZIP usando a biblioteca [JSZip](https://stuk.github.io/jszip/).
- **Integrar facilmente** o módulo em outras páginas ou projetos como um *ES Module*.

Esta rotina é ideal para *páginas de teste, pequenos formulários de cadastro, protótipos ou quaisquer aplicações web* que precisam de uma funcionalidade básica de captura de imagens via webcam. Tudo é feito em JavaScript puro — sem frameworks externos.

s
## 🚀 Instalação

1. **Clone ou baixe** este repositório:

   ```bash
   git clone https://github.com/luang1t/rotina-fotos-compactadas.git
   cd rotina-fotos-compactadas

2. **Abra o arquivo** ***index.html*** em seu navegador preferido. Não é necessário rodar servidores ou instalar dependências; tudo funciona diretamente no navegador.
  - **Para testar localmente**, basta dar duplo clique no index html ou usar uma extensão de Live Server no VS Code


# Como usar em outros projetos:

O módulo ***cameraRoutine.mjs*** pode ser importado como um ES Module em qualquer projeto web. Siga estes passos:

1. **Crie a estrutura HTML com os elementos que a rotina irá manipular:**
```
<div class="container">
  <video id="video" autoplay playsinline></video>
  <canvas id="photo" style="display:none;"></canvas>
  <button id="cameraAction">Ligar Câmera</button>
  <div id="gallery"></div>
  <button id="downloadZip">⬇ Baixar fotos</button>
</div>
```  

2. **Inclua a biblioteca JSZip via CDN (necessária para gerar o arquivo ZIP):**

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

```

3. **Importe e inicialize a rotina em um script do tipo módulo:**

```
<script type="module">
  import { initCameraRoutine } from './cameraRoutine.mjs';

  // Inicialize a rotina **após** os elementos acima existirem no DOM
  const camera = initCameraRoutine({
    cameraButtonId:   'cameraAction', // ID do botão principal (liga/tira foto)
    downloadButtonId: 'downloadZip',  // ID do botão de download ZIP
    videoId:          'video',        // ID do elemento <video>
    canvasId:         'photo',        // ID do elemento <canvas>
    galleryId:        'gallery',      // ID da div da galeria
    textos: {                         // (opcional) textos do botão principal
      ligar: 'Ligar Câmera',
      fotografar: 'Tirar Foto'
    }
  });

  // Exemplo de uso da API pública
  console.log(camera.getImagens());    // retorna array com as fotos
</script>

```
# Usando API retornada:
**O objeto retornado por initCameraRoutine fornece funções que permitem controlar a câmera e acessar as fotos:**
- **camera.getImagens();** - retorna uma cópia do array de imagens capturadas. Cada item possui um ***id*** (timestamp) e um ***src*** em Base64.
- **camera.isCameraAtiva();** - informa se a câmera está ligada.
- **camera.desligarCamera();** -  desliga a câmera está ligada.
- **camera.limparGaleria();** -  limpa o array de imagens e remove as miniaturas da galeria.

```

// Obter a lista de imagens
const fotos = camera.getImagens();
console.log(fotos);

// Verificar se a câmera está ligada
if (camera.isCameraAtiva()) {
  console.log('A câmera está ativa!');
}

// Desligar a câmera manualmente
camera.desligarCamera();

// Limpar a galeria
camera.limparGaleria();


```

