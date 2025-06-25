document.addEventListener('DOMContentLoaded', function() {
    const appContainer = document.getElementById('app-container');
    const mainHeaderPlaceholder = document.getElementById('main-header-placeholder');

    if (mainHeaderPlaceholder) {
        fetch('/partials/header.html')
            .then(response => response.text())
            .then(data => {
            mainHeaderPlaceholder.innerHTML = data;
            });
        }

    // Função para carregar HTML dinamicamente COM CALLBACK
    async function loadHTML(targetElementId, filePath, callback) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                const targetElement = document.getElementById(targetElementId);
                // Silenciosamente não faz nada ou exibe mensagem no UI se necessário
                return;
            }
            const text = await response.text();
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = text;
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        } catch (error) {
            // Tratar erro silenciosamente ou exibir mensagem no UI
        }
    }

    // Função para renderizar a Home Page
    function renderHomePageContent() {
        // Garante que o header esteja visível e o body não tenha a classe de login
        if (mainHeaderPlaceholder) {
            mainHeaderPlaceholder.style.display = ''; // Garante que o placeholder do header seja visível
        }
        document.body.classList.remove('login-active');

        if (appContainer) {
            appContainer.innerHTML = ''; // Limpa o conteúdo anterior

            const mainPageWrapper = document.createElement('section');
            mainPageWrapper.className = 'main-page-wrapper';

            const heroSection = document.createElement('section');
            heroSection.className = 'hero-section';
            heroSection.innerHTML = `
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h1>Construa <br>seu império <br>começando do <br>completo zero </h1>
                            <p class="lead">
                                O lugar ideal para você aprender a investir e multiplicar seu dinheiro de forma divertida e prática.
                            </p>
                            <p>
                                <a href="#" class="btn btn-custom-primary">ENTRE AGORA</a>
                                <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0" class="btn btn-custom-secondary" target="_blank">▷ VEJA O TRAILER</a>
                            </p>
                        </div>
                        <div class="col-md-6 text-center">
                            <img src="assets/images/porquinho_tela_inicial.png" alt="Cofrinho Rico" class="img-fluid">
                        </div>
                    </div>
                </div>
            `;
            mainPageWrapper.appendChild(heroSection);

            const verMaisBtnContainer = document.createElement('div');
            verMaisBtnContainer.className = 'ver-mais-container-wrapper text-center py-3';
            verMaisBtnContainer.innerHTML = `<a href="#proxima-secao" class="btn btn-ver-mais-standalone">Ver Mais</a>`;
            mainPageWrapper.appendChild(verMaisBtnContainer);

            appContainer.appendChild(mainPageWrapper);
        }
    }

    // Função para renderizar a Página de Login
    async function renderLoginPage() {
        // Esconde o header e adiciona a classe de login ao body
        if (mainHeaderPlaceholder) {
            mainHeaderPlaceholder.style.display = 'none'; // Esconde o placeholder do header
        }
        document.body.classList.add('login-active');

        if (appContainer) {
            try {
                const response = await fetch('app/views/pages/login.html');
                if (!response.ok) {
                    // Tratar erro, talvez reverter as classes/estilos
                    if (mainHeaderPlaceholder) mainHeaderPlaceholder.style.display = '';
                    document.body.classList.remove('login-active');
                    if (response.status === 404) throw new Error('Arquivo login.html não encontrado.');
                    throw new Error('Falha ao carregar a página de login.');
                }
                const html = await response.text();
                appContainer.innerHTML = html; // Carrega o HTML do login
            } catch (error) {
                // console.error('Erro ao renderizar página de login:', error); // Pode reativar para depuração
                // Reverte o estado em caso de erro ao carregar o HTML do login
                if (mainHeaderPlaceholder) mainHeaderPlaceholder.style.display = '';
                document.body.classList.remove('login-active');
                // Poderia exibir uma mensagem de erro no UI
                // appContainer.innerHTML = `<p class="text-danger text-center">Ocorreu um erro ao carregar a página de login.</p>`;
            }
        }
    }

    // Função para adicionar listeners de navegação (DEPOIS que o header for carregado)
    function addNavigationListeners() {
        if (!mainHeaderPlaceholder) {
            return;
        }
        // console.log("Adicionando listeners de navegação...");

        const loginButton = mainHeaderPlaceholder.querySelector('.btn-outline-light');
        if (loginButton) {
            // console.log("Botão de login encontrado pela classe .btn-outline-light");
            loginButton.addEventListener('click', function(event) {
                event.preventDefault();
                // console.log("Botão de login clicado!");
                renderLoginPage();
            });
        } else {
            // console.log("Botão de login NÃO encontrado por .btn-outline-light, tentando por texto...");
            const navLinks = mainHeaderPlaceholder.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn');
            let foundLoginByText = false;
            navLinks.forEach(link => {
                if (link.textContent && link.textContent.trim().toLowerCase() === 'login') {
                    // console.log("Botão de login encontrado por texto:", link);
                    foundLoginByText = true;
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        // console.log("Botão de login (encontrado por texto) clicado!");
                        renderLoginPage();
                    });
                }
            });
            // if (!foundLoginByText) { // console.error("Botão de login não encontrado no header."); }
        }

        const brandLink = mainHeaderPlaceholder.querySelector('.navbar-brand');
        if (brandLink) {
            // console.log("Link da marca (logo) encontrado.");
            brandLink.addEventListener('click', function(event) {
                event.preventDefault();
                // console.log("Logo clicada!");
                renderHomePageContent();
            });
        } // else { // console.error("Link da marca (logo) não encontrado no header."); }
    }

    // --- Inicialização ---
    if (mainHeaderPlaceholder) {
    loadHTML('main-header-placeholder', '/partials/header.html', addNavigationListeners);
    }
    renderHomePageContent();

});