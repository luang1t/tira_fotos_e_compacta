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

2. **Abra o arquivo** index.html em seu navegador preferido. Não é necessário rodar servidores ou instalar dependências; tudo funciona diretamente no navegador.
-   **Para testar localmente**, basta dar duplo clique no index html ou usar uma extensão de Live Server no VS Code