const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const userController = require('./app/controllers/userController');
const User = require('./app/models/User');

const app = express();
const PORT = 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views', 'pages'));

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/partials', express.static(path.join(__dirname, 'app', 'views', 'partials')));

// Configuração da Sessão
app.use(session({
    secret: 'segredo-rico',
    resave: false,
    saveUninitialized: true
}));

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// --- BANCO DE DADOS FICTÍCIO DE ARTIGOS (VERSÃO DETALHADA) ---
const hoje = new Date();
const diaDaSemana = hoje.getDay(); // 0 (Domingo) - 6 (Sábado)
const primeiroDia = new Date(new Date().setDate(hoje.getDate() - diaDaSemana));

const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const artigosDB = [
    { 
        id: 1, 
        titulo: "Fundamentos da Educação Financeira", 
        autor: "Ana Pereira",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate()))),
        resumo: "Construindo as bases para um futuro financeiro próspero e seguro.",
        conteudo: `
            <p class="lead text-white mb-4">A educação financeira é uma das habilidades mais importantes que podemos desenvolver. Ela nos capacita a tomar decisões informadas e a construir um futuro sólido. Não se trata de ficar rico da noite para o dia, mas de ter tranquilidade e poder de escolha.</p>
            
            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. Orçamento: O Mapa do seu Dinheiro</h2>
            <p class="text-white">O primeiro passo é saber para onde seu dinheiro está indo. Um orçamento não é uma prisão, mas uma ferramenta de liberdade. Utilize uma planilha ou um aplicativo para listar todas as suas receitas e despesas. Separe os gastos em categorias como moradia, transporte, alimentação e lazer. Ao final do mês, você terá uma visão clara da sua saúde financeira e poderá identificar pontos de economia sem sacrificar sua qualidade de vida.</p>
            
            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Dívidas: O Inimigo a ser Vencido</h2>
            <p class="text-white">Dívidas com juros altos, como as de cartão de crédito e cheque especial, corroem seu patrimônio. A prioridade deve ser quitá-las. Comece listando todas as suas dívidas, da que tem o maior juro para a menor. Concentre seus esforços em pagar a mais cara primeiro, enquanto paga o mínimo das outras. Essa estratégia, conhecida como "bola de neve de juros", é a mais eficiente para eliminar dívidas rapidamente.</p>

            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Dominar os fundamentos da educação financeira é um processo contínuo. Comece hoje, seja consistente e veja seu futuro se transformar. A paz de espírito de ter as finanças sob controle não tem preço.</p>
            </div>
        ` 
    },
    { 
        id: 2, 
        titulo: "Investimentos para Iniciantes", 
        autor: "Bruno Costa",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate() + 1))),
        resumo: "Um guia prático sobre onde começar a investir seu dinheiro com segurança.",
        conteudo: `
            <p class="lead text-white mb-4">Investir é a arte de fazer o seu dinheiro trabalhar para você. Para quem está começando, o foco deve ser em segurança e aprendizado. Esqueça promessas de ganhos rápidos; o objetivo inicial é superar a inflação e construir um patrimônio sólido ao longo do tempo.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. Reserva de Emergência: O Primeiro Investimento</h2>
            <p class="text-white">Antes de pensar em ações ou fundos imobiliários, você precisa de uma reserva de emergência. Este é um valor equivalente a 6 a 12 meses do seu custo de vida, aplicado em um investimento de baixíssimo risco e alta liquidez (que você pode resgatar a qualquer momento). O Tesouro Selic e CDBs com liquidez diária que paguem 100% do CDI são as melhores opções para isso.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Renda Fixa: Segurança e Previsibilidade</h2>
            <p class="text-white">Com a reserva montada, é hora de explorar outros títulos de renda fixa para objetivos de médio prazo. Tesouro IPCA+ protege seu dinheiro da inflação, garantindo um ganho real. LCI e LCA são isentos de Imposto de Renda, o que pode torná-los mais atrativos que CDBs com a mesma taxa. O importante é diversificar e entender o prazo de cada investimento.</p>

            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Começar a investir é mais simples do que parece. Estude, comece com pouco e seja paciente. A consistência é a chave para que os juros compostos façam sua mágica e construam seu patrimônio no longo prazo.</p>
            </div>
        `
    },
    // Adicione os outros 4 artigos aqui com a mesma estrutura...
    { 
        id: 3, 
        titulo: "Como Economizar Dinheiro", 
        autor: "Carla Dias",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate() + 2))),
        resumo: "Estratégias eficazes para cortar gastos e aumentar sua capacidade de poupança.",
        conteudo: `
            <p class="lead text-white mb-4">Economizar é o pilar que sustenta todos os outros objetivos financeiros. Sem a capacidade de poupar, não há como investir ou construir uma reserva. A boa notícia é que com método e disciplina, é possível otimizar seus gastos de forma significativa.</p>
            
            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. A Mentalidade da Economia</h2>
            <p class="text-white">Antes de qualquer planilha, a mudança precisa ser mental. Pergunte-se antes de cada compra: "Eu realmente preciso disso ou eu apenas quero isso?". Adiar a gratificação e entender a diferença entre necessidade e desejo é o primeiro passo. Evite o gatilho das promoções e do marketing, que são desenhados para fazer você gastar por impulso.</p>
            
            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Técnicas Práticas de Otimização</h2>
            <p class="text-white">Revise suas assinaturas mensais (streaming, academias, clubes). Cancele o que não usa. Pesquise preços e use comparadores online antes de compras maiores. Planeje suas refeições semanais para evitar desperdício de comida e gastos excessivos com delivery. Renegocie planos de celular e internet anualmente; a concorrência é alta e sempre há ofertas melhores.</p>

            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Economizar é um hábito. Comece com pequenas vitórias, automatize uma transferência mensal para uma conta de poupança/investimento e veja sua confiança e seu saldo crescerem juntos.</p>
            </div>
        `
    },
    { 
        id: 4, 
        titulo: "Gestão de Cartões de Crédito", 
        autor: "Daniel Martins",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate() + 3))),
        resumo: "Use o crédito a seu favor e transforme o vilão em um aliado do seu bolso.",
        conteudo: `
            <p class="lead text-white mb-4">O cartão de crédito não é uma extensão da sua renda. É uma ferramenta de pagamento com um empréstimo pré-aprovado. Usá-lo de forma inteligente pode trazer muitos benefícios, mas o descontrole pode levar a um ciclo de dívidas difícil de quebrar.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. A Regra de Ouro: Pague a Fatura Completa</h2>
            <p class="text-white">Nunca, sob nenhuma circunstância que não seja uma emergência extrema, pague apenas o mínimo da fatura. Os juros do rotativo do cartão de crédito no Brasil estão entre os mais altos do mundo. Pagar o mínimo transforma uma pequena dívida em uma bola de neve impagável em poucos meses. Se não pode pagar o total, você gastou mais do que deveria.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Maximizando os Benefícios</h2>
            <p class="text-white">Concentre seus gastos em um único cartão para acumular mais pontos ou cashback. Escolha um cartão cuja anuidade seja justificada pelos benefícios que você realmente utiliza. Aproveite seguros de viagem, garantia estendida de produtos e outros mimos que muitos cartões oferecem gratuitamente. Lembre-se: os benefícios só valem a pena se você não pagar juros.</p>

            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Trate seu cartão de crédito como um cartão de débito: só use se tiver o dinheiro na conta. Com essa mentalidade, você aproveita o melhor dos dois mundos: a conveniência e os benefícios do crédito, com a segurança e o controle do débito.</p>
            </div>
        `
    },
    { 
        id: 5, 
        titulo: "Planejamento Financeiro Pessoal", 
        autor: "Fernanda Lima",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate() + 4))),
        resumo: "Crie um mapa claro para seus objetivos, sejam eles de curto, médio ou longo prazo.",
        conteudo: `
            <p class="lead text-white mb-4">Um planejamento financeiro é o seu GPS para a vida. Ele te ajuda a sair do ponto A (sua situação atual) e chegar ao ponto B (seus sonhos e objetivos) da forma mais eficiente e segura possível, mostrando o caminho e ajudando a desviar dos obstáculos.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. Definindo Seus Objetivos</h2>
            <p class="text-white">Seus objetivos precisam ser específicos. Em vez de "quero viajar", defina "quero ir para a Europa por 15 dias em julho de 2026, com um orçamento de R$ 20.000". Separe-os por prazo: curto (até 1 ano), médio (1 a 5 anos) e longo (acima de 5 anos). Isso é crucial para definir a estratégia de investimento para cada um.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Montando a Estratégia</h2>
            <p class="text-white">Para objetivos de curto prazo, a prioridade é a segurança. Use investimentos de renda fixa com baixa volatilidade. Para o médio prazo, você pode mesclar renda fixa com um pouco de renda variável, como fundos multimercado. Já para o longo prazo, como a aposentadoria, a renda variável (ações, fundos imobiliários) tem um papel fundamental, pois o tempo dilui os riscos e potencializa os ganhos através dos juros compostos.</p>
            
            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Revise seu plano financeiro pelo menos uma vez por ano ou sempre que houver uma grande mudança na sua vida (casamento, novo emprego). Um plano não é escrito em pedra, ele é um guia vivo que evolui com você.</p>
            </div>
        `
    },
    { 
        id: 6, 
        titulo: "Educação Financeira para Jovens", 
        autor: "Gabriel Rocha",
        data: formatarData(new Date(new Date(primeiroDia).setDate(primeiroDia.getDate() + 5))),
        resumo: "Como começar a vida financeira com o pé direito e evitar os erros mais comuns.",
        conteudo: `
            <p class="lead text-white mb-4">Começar a cuidar do dinheiro cedo é o maior presente que um jovem pode dar a si mesmo. O tempo é o ingrediente mais poderoso no mundo dos investimentos, e quem começa antes tem uma vantagem incomparável para construir riqueza e ter uma vida adulta mais tranquila.</p>
            
            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">1. O Primeiro Salário ou Mesada</h2>
            <p class="text-white">A primeira lição é: "pague-se primeiro". Antes de gastar com qualquer coisa, separe uma pequena parte (10% a 20%) para seus objetivos futuros. Crie o hábito de poupar e investir antes de gastar. Esse comportamento, estabelecido na juventude, fará toda a diferença no futuro. Abra uma conta em uma corretora digital, que geralmente são gratuitas e fáceis de usar.</p>

            <h2 class="fw-bold text-white mb-3 mt-5 border-bottom border-warning pb-2">2. Evitando as Armadilhas Iniciais</h2>
            <p class="text-white">A principal armadilha para os jovens é o crédito fácil e o consumismo incentivado pelas redes sociais. Cuidado com o primeiro cartão de crédito; entenda que ele não é dinheiro extra. Evite fazer dívidas para comprar itens que se desvalorizam rapidamente, como celulares de última geração. Aprenda a pesquisar, a esperar e a valorizar o esforço necessário para ganhar cada real.</p>
            
            <div class="review-box p-4 mt-5">
                <h3 class="fw-bold text-warning mb-3">Conclusão</h3>
                <p class="text-white mb-0">Jovem, seu maior ativo é o tempo. Use-o a seu favor. Aprenda sobre juros compostos, comece a investir mesmo que seja R$ 50 por mês, e leia sobre finanças. O "eu" do futuro será imensamente grato pelas decisões inteligentes que você tomar hoje.</p>
            </div>
        `
    }
];


// --- ROTAS DA APLICAÇÃO ---

// Garantir criação das tabelas do banco de dados
User.createTable();
User.createAvaliacaoTable();

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas de Autenticação e Usuário
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'login.html')));
app.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'cadastro.html')));
app.post('/login', userController.login);
app.post('/cadastro', userController.cadastrar);

// Rota do Dashboard (protegida)
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    User.findById(req.session.userId, (err, user) => {
        if (err || !user) return res.status(500).send("Erro ao carregar o dashboard.");
        res.render('dashboard', { user });
    });
});

// Rota de Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Erro ao encerrar a sessão.');
        res.redirect('/login');
    });
});

// --- ROTAS DE ARTIGOS (DINÂMICAS) ---

// Rota para a PÁGINA DE LISTAGEM de artigos
app.get('/artigos', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'artigo.html'));
});

// Rota DINÂMICA para exibir um artigo específico
app.get('/artigos/:id', (req, res) => {
    const artigoId = parseInt(req.params.id, 10);
    const artigo = artigosDB.find(a => a.id === artigoId);

    if (artigo) {
        res.render('insideDict', { artigo }); // Passa os dados do artigo para o template
    } else {
        res.status(404).send("Artigo não encontrado");
    }
});


// --- ROTAS DE AVALIAÇÕES ---

app.get('/avaliacoes', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    User.findAvaliacaoByUsuario(req.session.userId, (err, minhaAvaliacao) => {
        User.findAllAvaliacoes((err, todas) => {
            if (err) return res.status(500).send("Erro ao carregar avaliações.");
            const outras = todas.filter(a => a.email !== req.session.email);
            res.render('avaliacoes', { minhaAvaliacao, outras });
        });
    });
});

app.post('/avaliacao', (req, res) => {
    if (!req.session.userId) return res.status(401).send('Você precisa estar logado.');
    const { nota, texto } = req.body;
    User.findAvaliacaoByUsuario(req.session.userId, (err, avaliacaoExistente) => {
        if (err) return res.status(500).send("Erro interno.");
        if (avaliacaoExistente) {
            User.updateAvaliacao(req.session.userId, nota, texto, (err) => {
                if (err) return res.status(500).send("Erro ao atualizar.");
                res.redirect('/avaliacoes');
            });
        } else {
            User.createAvaliacao(req.session.userId, nota, texto, (err) => {
                if (err) return res.status(500).send("Erro ao criar.");
                res.redirect('/avaliacoes');
            });
        }
    });
});

app.post('/avaliacao/deletar', (req, res) => {
    if (!req.session.userId) return res.status(401).send("Você precisa estar logado.");
    User.deleteAvaliacao(req.session.userId, (err) => {
        if (err) return res.status(500).send("Erro ao remover avaliação.");
        res.redirect('/avaliacoes');
    });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});