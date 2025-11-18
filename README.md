📸 Rotina de Câmera – Captura de Fotos e Download em ZIP

A Rotina de Câmera é um pequeno módulo em JavaScript que simplifica o acesso à câmera do navegador. Com ele, você pode

Ligar/desligar a câmera (via API MediaDevices).

Capturar fotos e exibi‑las em uma galeria de miniaturas.

Baixar as fotos selecionadas em um arquivo ZIP usando a biblioteca JSZip
.

Integrar facilmente o módulo em outras páginas ou projetos como um ES Module.

Esta rotina é ideal para páginas de teste, pequenos formulários de cadastro, protótipos ou quaisquer aplicações web que precisam de uma funcionalidade básica de captura de imagens via webcam. Tudo é feito em JavaScript puro — sem frameworks externos.


🚀 Instalação

Clone ou baixe este repositório:

git clone https://github.com/luang1t/rotina-fotos-compactadas.git
cd rotina-fotos-compactadas


Abra o arquivo index.html em seu navegador preferido. Não é necessário rodar servidores ou instalar dependências; tudo funciona diretamente no navegador.

Para testar localmente, basta dar duplo clique no index.html ou usar uma extensão de Live Server no VS Code.

▶️ Como usar em outros projetos

O módulo cameraRoutine.mjs pode ser importado como um ES Module em qualquer projeto web. Siga estes passos:

Crie a estrutura HTML com os elementos que a rotina irá manipular:

<div class="container">
  <video id="video" autoplay playsinline></video>
  <canvas id="photo" style="display:none;"></canvas>
  <button id="cameraAction">Ligar Câmera</button>
  <div id="gallery"></div>
  <button id="downloadZip">⬇ Baixar fotos</button>
</div>


Inclua a biblioteca JSZip via CDN (necessária para gerar o arquivo ZIP):

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>


Importe e inicialize a rotina em um script do tipo módulo:

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

🔧 Configuração (objeto config)

A rotina recebe um objeto de configuração com as seguintes propriedades:

Propriedade	Tipo	Obrigatório	Descrição
cameraButtonId	string	✅	ID do botão que liga a câmera e tira foto.
downloadButtonId	string	✅	ID do botão que baixa o ZIP com as fotos.
videoId	string	✅	ID do elemento <video> que mostra a imagem da câmera.
canvasId	string	✅	ID do elemento <canvas> utilizado internamente para capturar a foto.
galleryId	string	✅	ID da <div> onde as miniaturas das fotos serão exibidas.
textos.ligar	string	❌	Texto exibido no botão principal quando a câmera está desligada.
textos.fotografar	string	❌	Texto exibido no botão principal quando a câmera está ligada (modo foto).

Todas as propriedades são IDs de elementos existentes no DOM. A rotina irá buscar esses elementos e lançar um erro caso algum não seja encontrado.

🛠 API pública

Após chamar initCameraRoutine(config), é retornado um objeto com métodos úteis:

getImagens(): Array<{ id: number, src: string }> – devolve um array com as fotos capturadas, cada uma contendo um id (timestamp) e o src em Base64/PNG.

isCameraAtiva(): boolean – retorna true se a câmera está ligada e false caso esteja desligada.

desligarCamera(): void – desliga a câmera, parando o MediaStream e resetando o texto do botão principal.

limparGaleria(): void – limpa o array interno de imagens e remove todas as miniaturas da galeria.

Com essa API, você pode integrar a rotina a outras lógicas da sua aplicação, como enviar as imagens para um servidor ou processá‑las de outras maneiras.

🧱 Estrutura do projeto

A estrutura padrão deste repositório é simples:

rotina-fotos-compactadas/
├── index.html        # Página de exemplo que utiliza a rotina
├── cameraRoutine.mjs # Módulo ES que implementa a lógica de captura/ZIP
├── style.css         # Estilos básicos (flexbox, tamanho de vídeo etc.)
└── README.md         # Documentação do projeto


Você pode copiar apenas o cameraRoutine.mjs para o seu projeto e criar seus próprios HTML/CSS.

🛠 Tecnologias utilizadas

JavaScript (ES Modules) – implementação da rotina e integração com a API da câmera.

HTML5 – MediaDevices API – acesso à webcam do navegador (navigator.mediaDevices.getUserMedia).

Canvas 2D API – captura de frames do vídeo para criar imagens em PNG.

JSZip – geração do arquivo ZIP contendo as fotos selecionadas.

CSS Flexbox – layout responsivo básico da página de exemplo.

🤝 Contribuindo

Contribuições são bem‑vindas! Se você encontrar problemas ou tiver sugestões de melhoria:

Abra uma Issue descrevendo o problema ou a funcionalidade desejada.

Faça um fork deste repositório e crie uma nova branch para sua funcionalidade (git checkout -b feature/nova-funcionalidade).

Envie um pull request descrevendo as mudanças e nos ajude a melhorar a rotina.

📄 Licença

Este projeto é licenciado sob a MIT License — sinta‑se livre para usá‑lo e modificá‑lo como quiser.

🔖 Sinta‑se à vontade para traduzir este README para outro idioma, adicionar imagens/gifs de demonstração e incluir mais exemplos de uso específico conforme sua necessidade.

Luan Cavalcante Dias Rodrigues