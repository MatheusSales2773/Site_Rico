document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar HTML dinamicamente
    async function loadHTML(targetElementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                // Se o status for 404 (Not Found), o arquivo não foi encontrado
                if (response.status === 404) {
                    console.error(`Arquivo não encontrado: ${filePath}`);
                    const targetElement = document.getElementById(targetElementId);
                    if (targetElement) {
                        targetElement.innerHTML = `<p class="text-danger">Erro: Arquivo ${filePath} não encontrado.</p>`;
                    }
                    return
                }
                throw new Error(`Erro ao carregar ${filePath}: ${response.status} ${response.statusText}`);
            }
            const text = await response.text();
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = text;
            } else {
                console.error(`Elemento com ID '${targetElementId}' não encontrado.`);
            }
        } catch (error) {
            console.error('Falha ao executar loadHTML:', error);
            const targetElement = document.getElementById(targetElementId);
            // Mostra um erro mais genérico no placeholder se houver outra falha
            if (targetElement) {
                targetElement.innerHTML = `<p class="text-danger">Erro ao carregar conteúdo de ${filePath}. Verifique o console.</p>`;
            }
        }
    }

    // Carregar o cabeçalho
    loadHTML('main-header-placeholder', 'app/views/partials/header.html'); 

    // Função para renderizar a Home Page
    function renderHomePageContent() {
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            // Limpa qualquer conteúdo anterior
            appContainer.innerHTML = '';

            // Cria seção hero
            const heroSection = document.createElement('section');
            heroSection.className = 'hero-section'; // Aplicando a classe CSS

            heroSection.innerHTML = `
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h1>Construa <br>seu império <br>começando do <br>completo zero </h1>
                            <p class="lead">
                    
                            </p>
                            <p>
                                <a href="#" class="btn btn-success">ENTRE AGORA</a>
                                <a href="#" class="btn btn-outline-light">▷ VEJA O TRAILER</a>
                            </p>
                        </div>
                        <div class="col-md-6 text-center">
                            <img src="assets/images/porquinho_tela_inicial.png" alt="Cofrinho Rico" class="img-fluid">
                        </div>
                    </div>
                </div>
            `;
            appContainer.appendChild(heroSection);

        } else {
            console.error("Elemento #app-container não encontrado.");
        }
    }

    // Renderizar o conteúdo da página inicial
    renderHomePageContent();

    console.log("Página principal e header deveriam estar carregados.");
});