// Sistema de Transporte Público Santa Terezinha - Lógica Principal

// Estado global da aplicação
let usuarioAtual = null;
let telaAtual = 'login';
let chamadoAtual = null; // Para resolver chamados
let statusLinha = 'parado'; // Para controle de linha do motorista

// Configuração da API
const API_BASE_URL = 'php/api.php';

// ===== MÓDULO DE API =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Erro na requisição');
        }
        
        return result.data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Funções de API específicas
async function carregarRotas() {
    return await apiRequest('rotas');
}

async function carregarAvisos() {
    return await apiRequest('avisos');
}

async function carregarChamados() {
    return await apiRequest('chamados');
}

async function carregarEscalas() {
    return await apiRequest('escalas');
}

async function carregarMensagens() {
    return await apiRequest('mensagens');
}

async function fazerLoginAPI(username, password) {
    return await apiRequest('login', 'POST', { username, password });
}

async function criarChamadoAPI(data) {
    return await apiRequest('chamados', 'POST', data);
}

async function atualizarChamadoAPI(id, data) {
    return await apiRequest(`chamados/${id}`, 'PUT', data);
}

async function enviarMensagemAPI(data) {
    return await apiRequest('mensagens', 'POST', data);
}

async function carregarDashboard() {
    return await apiRequest('dashboard');
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    configurarEventListeners();
});

function inicializarApp() {
    // Mostrar tela de login por padrão
    mostrarTela('loginScreen');
    
    // Carregar dados iniciais
    carregarDadosIniciais();
}

function configurarEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulário de problemas
    const problemaForm = document.getElementById('problemaForm');
    if (problemaForm) {
        problemaForm.addEventListener('submit', handleProblemaSubmit);
    }
    
    // Input de mensagem do chat
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Busca de rotas
    const routeSearch = document.getElementById('routeSearch');
    if (routeSearch) {
        routeSearch.addEventListener('input', function() {
            const termo = this.value;
            if (termo.length >= 2) {
                buscarERenderizarRotas(termo);
            } else if (termo.length === 0) {
                carregarInterfacePassageiro();
            }
        });
    }
}

// Sistema de Login
async function handleLogin(e) {
    e.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!userType || !username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    try {
        const response = await fazerLoginAPI(username, password);
        
        // Verificar se o tipo de usuário corresponde
        if (response.user.tipo !== userType) {
            alert('Tipo de usuário incorreto. Selecione o tipo correto.');
            return;
        }
        
        usuarioAtual = response.user;
        fazerLogin(response.user.tipo);
    } catch (error) {
        alert('Usuário, senha ou tipo incorretos. Verifique os dados e tente novamente.');
        console.error('Erro no login:', error);
    }
}

function fazerLogin(tipoUsuario) {
    // Limpar formulário
    document.getElementById('loginForm').reset();
    
    // Mostrar interface correspondente
    switch(tipoUsuario) {
        case 'passageiro':
            mostrarTela('passageiroScreen');
            carregarInterfacePassageiro();
            break;
        case 'motorista':
            mostrarTela('motoristaScreen');
            carregarInterfaceMotorista();
            break;
        case 'mecanico':
            mostrarTela('mecanicoScreen');
            carregarInterfaceMecanico();
            break;
        case 'gestor':
            mostrarTela('gestorScreen');
            carregarInterfaceGestor();
            break;
    }
    
    telaAtual = tipoUsuario + 'Screen';
}

function mostrarTela(telaId) {
    // Esconder todas as telas
    const telas = document.querySelectorAll('.screen');
    telas.forEach(tela => tela.classList.remove('active'));
    
    // Mostrar tela selecionada
    const tela = document.getElementById(telaId);
    if (tela) {
        tela.classList.add('active');
    }
}

function showLogin() {
    usuarioAtual = null;
    telaAtual = 'login';
    mostrarTela('loginScreen');
}

// Sistema de Navegação
function toggleMenu() {
    // Implementar menu mobile se necessário
    console.log('Menu toggle');
}

// Interface do Passageiro
async function carregarInterfacePassageiro() {
    try {
        const rotas = await carregarRotas();
        renderizarRotas(rotas);
        await renderizarAvisos();
        await renderizarMensagensChat();
        showPassageiroSection('horarios');
    } catch (error) {
        console.error('Erro ao carregar interface do passageiro:', error);
        alert('Erro ao carregar dados. Tente novamente.');
    }
}

function showPassageiroSection(secao) {
    // Atualizar navegação
    const navItems = document.querySelectorAll('#passageiroNav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Encontrar o item correto baseado no onclick
    const targetItem = Array.from(navItems).find(item => 
        item.getAttribute('onclick') && item.getAttribute('onclick').includes(secao)
    );
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // Mostrar seção
    const sections = document.querySelectorAll('#passageiroScreen .section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(secao + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function renderizarRotas(rotas) {
    const container = document.getElementById('routesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!rotas || rotas.length === 0) {
        container.innerHTML = '<p>Nenhuma rota disponível no momento.</p>';
        return;
    }
    
    rotas.forEach(rota => {
        const rotaElement = document.createElement('div');
        rotaElement.className = 'route-item';
        
        // Processar horários da API (estrutura pode ser diferente)
        const horarios = rota.horarios || [];
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        let diaAtual = 'diasUteis';
        if (diaSemana === 0) diaAtual = 'domingo';
        else if (diaSemana === 6) diaAtual = 'sabado';
        
        const horariosHoje = horarios.filter(h => h.dia_semana === diaAtual || !h.dia_semana);
        const proximosHorarios = horariosHoje
            .map(h => {
                const horaAtual = hoje.getHours().toString().padStart(2, '0') + ':' + hoje.getMinutes().toString().padStart(2, '0');
                return h.horario > horaAtual ? h : null;
            })
            .filter(h => h !== null)
            .slice(0, 6);
        
        rotaElement.innerHTML = `
            <div class="route-header">
                <h3>Linha ${rota.numero || rota.id} - ${rota.nome}</h3>
                <span class="status-badge status-${rota.status || 'operando'}">${rota.status || 'operando'}</span>
            </div>
            <div class="route-info">
                <p><strong>Nome:</strong> ${rota.nome}</p>
                ${rota.duracao ? `<p><strong>Duração:</strong> ${rota.duracao}</p>` : ''}
                ${rota.tarifa ? `<p><strong>Tarifa:</strong> ${rota.tarifa}</p>` : ''}
            </div>
            <div class="horarios-container">
                ${proximosHorarios.length > 0 ? `
                    <div class="horarios-section">
                        <h4><i class="fas fa-clock"></i> Próximos Horários de Hoje</h4>
                        <div class="horarios-grid">
                            ${proximosHorarios.map(horario => 
                                `<div class="horario-item">
                                    <span class="horario">${horario.horario}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="no-schedules">
                        <p><i class="fas fa-info-circle"></i> Nenhum horário disponível para hoje</p>
                    </div>
                `}
            </div>
        `;
        container.appendChild(rotaElement);
    });
}

async function buscarERenderizarRotas(termo) {
    try {
        const rotas = await carregarRotas();
        const rotasFiltradas = rotas.filter(rota => 
            rota.nome.toLowerCase().includes(termo.toLowerCase()) ||
            (rota.numero && rota.numero.toString().includes(termo))
        );
        renderizarRotas(rotasFiltradas);
    } catch (error) {
        console.error('Erro ao buscar rotas:', error);
    }
}

function searchRoutes() {
    const termo = document.getElementById('routeSearch').value;
    buscarERenderizarRotas(termo);
}

async function renderizarAvisos() {
    const container = document.getElementById('noticesContainer');
    if (!container) return;
    
    try {
        const avisos = await carregarAvisos();
        container.innerHTML = '';
        
        if (!avisos || avisos.length === 0) {
            container.innerHTML = '<p>Nenhum aviso no momento.</p>';
            return;
        }
        
        avisos.forEach(aviso => {
            const avisoElement = document.createElement('div');
            avisoElement.className = 'notice-item';
            avisoElement.innerHTML = `
                <h3>${aviso.titulo || aviso.titulo_aviso}</h3>
                <p>${aviso.conteudo || aviso.mensagem}</p>
                <div class="aviso-meta">
                    <span class="data">${formatarData(aviso.data_publicacao || aviso.data)}</span>
                    ${aviso.prioridade ? `<span class="status-badge status-${aviso.prioridade}">${aviso.prioridade}</span>` : ''}
                </div>
            `;
            container.appendChild(avisoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar avisos:', error);
        container.innerHTML = '<p>Erro ao carregar avisos.</p>';
    }
}

async function renderizarMensagensChat() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    try {
        const mensagens = await carregarMensagens();
        container.innerHTML = '';
        
        if (!mensagens || mensagens.length === 0) {
            container.innerHTML = '<p>Nenhuma mensagem ainda.</p>';
            return;
        }
        
        mensagens.forEach(mensagem => {
            const mensagemElement = document.createElement('div');
            mensagemElement.className = `message ${mensagem.tipo || 'user'}`;
            mensagemElement.innerHTML = `
                <div class="message-content">
                    <strong>${mensagem.usuario_nome || mensagem.usuario}:</strong> ${mensagem.mensagem}
                </div>
                <div class="message-time">${formatarData(mensagem.data_envio || mensagem.data)}</div>
            `;
            container.appendChild(mensagemElement);
        });
        
        // Scroll para a última mensagem
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        container.innerHTML = '<p>Erro ao carregar mensagens.</p>';
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const mensagem = input.value.trim();
    
    if (!mensagem || !usuarioAtual) return;
    
    try {
        // Enviar mensagem para a API
        await enviarMensagemAPI({
            usuario_id: usuarioAtual.id,
            mensagem: mensagem,
            tipo: 'user'
        });
        
        // Limpar input
        input.value = '';
        
        // Re-renderizar chat
        await renderizarMensagensChat();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Tente novamente.');
    }
}

// Interface do Motorista
function carregarInterfaceMotorista() {
    showMotoristaSection('problemas');
}

async function showMotoristaSection(secao) {
    // Atualizar navegação
    const navItems = document.querySelectorAll('#motoristaNav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Encontrar o item correto baseado no onclick
    const targetItem = Array.from(navItems).find(item => 
        item.getAttribute('onclick') && item.getAttribute('onclick').includes(secao)
    );
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // Mostrar seção
    const sections = document.querySelectorAll('#motoristaScreen .section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(secao + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (secao === 'escala') {
        await renderizarEscala();
    } else if (secao === 'controle') {
        await renderizarControleLinha();
    }
}

async function handleProblemaSubmit(e) {
    e.preventDefault();
    
    const tipoProblema = document.getElementById('tipoProblema').value;
    const descricao = document.getElementById('descricaoProblema').value;
    const urgencia = document.getElementById('urgencia').value;
    
    if (!tipoProblema || !descricao || !urgencia || !usuarioAtual) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    try {
        // Buscar veículo do motorista (pode ser da escala atual)
        const veiculoId = 1; // TODO: obter do contexto/escala atual
        
        await criarChamadoAPI({
            motorista_id: usuarioAtual.id,
            veiculo_id: veiculoId,
            tipo: tipoProblema,
            descricao: descricao,
            urgencia: urgencia
        });
        
        alert('Chamado enviado com sucesso! Nossa equipe técnica será notificada.');
        
        // Limpar formulário
        document.getElementById('problemaForm').reset();
        
        // Recarregar chamados se estiver na tela de mecânico
        if (telaAtual === 'mecanicoScreen') {
            await renderizarChamados();
        }
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        alert('Erro ao enviar chamado. Tente novamente.');
    }
}

async function renderizarEscala() {
    const container = document.getElementById('scheduleContainer');
    if (!container || !usuarioAtual) return;
    
    try {
        const escalas = await carregarEscalas();
        const escalasMotorista = escalas.filter(e => e.motorista_id === usuarioAtual.id);
        container.innerHTML = '';
        
        if (escalasMotorista.length === 0) {
            container.innerHTML = '<p>Nenhuma escala encontrada.</p>';
            return;
        }
        
        const hoje = new Date().toISOString().split('T')[0];
        
        escalasMotorista.forEach(item => {
            const isHoje = item.data === hoje || item.data === hoje.split('T')[0];
            
            const itemElement = document.createElement('div');
            itemElement.className = `escala-item ${isHoje ? 'hoje' : ''}`;
            itemElement.innerHTML = `
                <h3>${item.data} - ${item.turno || 'N/A'}</h3>
                <div class="escala-info">
                    <p><strong>Horário:</strong> ${item.horario_inicio || item.horario} - ${item.horario_fim || ''}</p>
                    <p><strong>Linha:</strong> ${item.rota_nome || item.linha}</p>
                    <p><strong>Veículo:</strong> ${item.veiculo_numero || item.veiculo}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${item.status}">${item.status}</span></p>
                </div>
                ${isHoje ? '<div class="escala-hoje-indicator">📅 Escala de Hoje</div>' : ''}
            `;
            container.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Erro ao carregar escalas:', error);
        container.innerHTML = '<p>Erro ao carregar escalas.</p>';
    }
}

// Interface do Mecânico
async function carregarInterfaceMecanico() {
    try {
        await renderizarChamados();
        renderizarChecklist();
        showMecanicoSection('chamados');
    } catch (error) {
        console.error('Erro ao carregar interface do mecânico:', error);
        alert('Erro ao carregar dados. Tente novamente.');
    }
}

function showMecanicoSection(secao) {
    // Atualizar navegação
    const navItems = document.querySelectorAll('#mecanicoNav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar seção
    const sections = document.querySelectorAll('#mecanicoScreen .section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(secao + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

async function renderizarChamados() {
    const container = document.getElementById('chamadosContainer');
    if (!container) return;
    
    try {
        const chamados = await carregarChamados();
        container.innerHTML = '';
        
        if (!chamados || chamados.length === 0) {
            container.innerHTML = '<p>Nenhum chamado encontrado.</p>';
            return;
        }
        
        chamados.forEach(chamado => {
            const chamadoElement = document.createElement('div');
            chamadoElement.className = 'chamado-item';
            
            let solucaoHtml = '';
            if (chamado.data_resolucao || chamado.observacoes) {
                solucaoHtml = `
                    <div class="solucao-chamado">
                        <h4>Solução Aplicada:</h4>
                        ${chamado.observacoes ? `<p><strong>Observações:</strong> ${chamado.observacoes}</p>` : ''}
                        ${chamado.data_resolucao ? `<p><strong>Data da Solução:</strong> ${formatarData(chamado.data_resolucao)}</p>` : ''}
                    </div>
                `;
            }
            
            chamadoElement.innerHTML = `
                <h3>Chamado #${chamado.id}</h3>
                <p><strong>Motorista:</strong> ${chamado.motorista_nome || chamado.motorista}</p>
                <p><strong>Veículo:</strong> ${chamado.veiculo_numero || chamado.veiculo}</p>
                <p><strong>Tipo:</strong> ${chamado.tipo}</p>
                <p><strong>Descrição:</strong> ${chamado.descricao}</p>
                <p><strong>Urgência:</strong> <span class="status-badge status-${chamado.urgencia}">${chamado.urgencia}</span></p>
                <p><strong>Status:</strong> <span class="status-badge status-${chamado.status}">${chamado.status}</span></p>
                <p><strong>Data:</strong> ${formatarData(chamado.data_abertura || chamado.data)}</p>
                ${solucaoHtml}
                <div class="chamado-actions">
                    ${chamado.status === 'aberto' ? 
                        `<button class="btn-primary" onclick="assumirChamado(${chamado.id})">
                            <i class="fas fa-tools"></i> Assumir Chamado
                        </button>` : ''
                    }
                    ${chamado.status === 'em_andamento' ? 
                        `<button class="btn-primary" onclick="resolverChamado(${chamado.id})">
                            <i class="fas fa-check"></i> Marcar como Resolvido
                        </button>` : ''
                    }
                </div>
            `;
            container.appendChild(chamadoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        container.innerHTML = '<p>Erro ao carregar chamados.</p>';
    }
}

async function assumirChamado(id) {
    if (!usuarioAtual) return;
    
    try {
        await atualizarChamadoAPI(id, {
            status: 'em_andamento',
            mecanico_id: usuarioAtual.id
        });
        await renderizarChamados();
        alert('Chamado assumido com sucesso!');
    } catch (error) {
        console.error('Erro ao assumir chamado:', error);
        alert('Erro ao assumir chamado. Tente novamente.');
    }
}

async function resolverChamado(id) {
    if (!usuarioAtual) return;
    
    try {
        await atualizarChamadoAPI(id, {
            status: 'resolvido',
            mecanico_id: usuarioAtual.id
        });
        await renderizarChamados();
        alert('Chamado marcado como resolvido!');
    } catch (error) {
        console.error('Erro ao resolver chamado:', error);
        alert('Erro ao resolver chamado. Tente novamente.');
    }
}

function renderizarChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    // Checklist padrão (pode ser carregado da API no futuro)
    const checklistPadrao = [
        { id: 1, item: 'Verificar nível de óleo do motor', concluido: false },
        { id: 2, item: 'Verificar nível de água do radiador', concluido: false },
        { id: 3, item: 'Verificar pressão dos pneus', concluido: false },
        { id: 4, item: 'Testar sistema de freios', concluido: false },
        { id: 5, item: 'Verificar funcionamento das luzes', concluido: false },
        { id: 6, item: 'Verificar sistema de ar condicionado', concluido: false },
        { id: 7, item: 'Verificar funcionamento das portas', concluido: false },
        { id: 8, item: 'Verificar limpeza interna e externa', concluido: false }
    ];
    
    container.innerHTML = '';
    
    checklistPadrao.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checklist-item';
        itemElement.innerHTML = `
            <input type="checkbox" id="checklist-${item.id}" ${item.concluido ? 'checked' : ''} 
                   onchange="atualizarItemChecklist(${item.id}, this.checked)">
            <label for="checklist-${item.id}">${item.item}</label>
        `;
        container.appendChild(itemElement);
    });
}

async function atualizarItemChecklist(itemId, concluido) {
    if (!usuarioAtual) return;
    
    try {
        await apiRequest('checklist', 'POST', {
            item_id: itemId,
            concluido: concluido,
            mecanico_id: usuarioAtual.id
        });
    } catch (error) {
        console.error('Erro ao atualizar checklist:', error);
    }
}

// Interface do Gestor
async function carregarInterfaceGestor() {
    try {
        await renderizarDashboard();
        showGestorSection('dashboard');
    } catch (error) {
        console.error('Erro ao carregar interface do gestor:', error);
        alert('Erro ao carregar dados. Tente novamente.');
    }
}

async function showGestorSection(secao) {
    // Atualizar navegação
    const navItems = document.querySelectorAll('#gestorNav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Mostrar seção
    const sections = document.querySelectorAll('#gestorScreen .section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(secao + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (secao === 'chamados') {
        await renderizarChamadosGestao();
    } else if (secao === 'mensagens') {
        await renderizarMensagensGestao();
    }
}

async function renderizarDashboard() {
    try {
        const dashboard = await carregarDashboard();
        
        // Atualizar números
        const chamadosAbertosEl = document.getElementById('chamadosAbertos');
        const mensagensPendentesEl = document.getElementById('mensagensPendentes');
        
        if (chamadosAbertosEl) {
            chamadosAbertosEl.textContent = dashboard.chamados_abertos || 0;
        }
        if (mensagensPendentesEl) {
            mensagensPendentesEl.textContent = dashboard.mensagens_pendentes || 0;
        }
        
        // Renderizar gráficos
        renderizarGraficoFrota(dashboard.frota);
        renderizarGraficoMotoristas(dashboard.motoristas);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

function renderizarGraficoFrota(dados) {
    const ctx = document.getElementById('frotaChart');
    if (!ctx || !dados) return;
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não está carregado');
        return;
    }
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Disponíveis', 'Em Manutenção', 'Fora de Serviço'],
            datasets: [{
                data: [dados.disponiveis || dados.disponiveis || 0, dados.em_manutencao || dados.emManutencao || 0, dados.fora_servico || dados.foraDeServico || 0],
                backgroundColor: ['#27ae60', '#f39c12', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderizarGraficoMotoristas(dados) {
    const ctx = document.getElementById('motoristasChart');
    if (!ctx || !dados) return;
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não está carregado');
        return;
    }
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dirigindo', 'Fora de Escala'],
            datasets: [{
                data: [dados.dirigindo || 0, dados.fora_escala || dados.foraDeEscala || 0],
                backgroundColor: ['#3498db', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function renderizarChamadosGestao() {
    const container = document.getElementById('chamadosGestao');
    if (!container) return;
    
    try {
        const chamados = await carregarChamados();
        container.innerHTML = '';
        
        if (!chamados || chamados.length === 0) {
            container.innerHTML = '<p>Nenhum chamado encontrado.</p>';
            return;
        }
        
        chamados.forEach(chamado => {
            const chamadoElement = document.createElement('div');
            chamadoElement.className = 'chamado-item';
            chamadoElement.innerHTML = `
                <h3>Chamado #${chamado.id}</h3>
                <p><strong>Motorista:</strong> ${chamado.motorista_nome || chamado.motorista}</p>
                <p><strong>Veículo:</strong> ${chamado.veiculo_numero || chamado.veiculo}</p>
                <p><strong>Tipo:</strong> ${chamado.tipo}</p>
                <p><strong>Descrição:</strong> ${chamado.descricao}</p>
                <p><strong>Urgência:</strong> <span class="status-badge status-${chamado.urgencia}">${chamado.urgencia}</span></p>
                <p><strong>Status:</strong> <span class="status-badge status-${chamado.status}">${chamado.status}</span></p>
                <p><strong>Mecânico:</strong> ${chamado.mecanico_nome || chamado.mecanico || 'Não atribuído'}</p>
                <p><strong>Data:</strong> ${formatarData(chamado.data_abertura || chamado.data)}</p>
            `;
            container.appendChild(chamadoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        container.innerHTML = '<p>Erro ao carregar chamados.</p>';
    }
}

async function renderizarMensagensGestao() {
    const container = document.getElementById('mensagensGestao');
    if (!container) return;
    
    try {
        const mensagens = await carregarMensagens();
        const mensagensUsuario = mensagens.filter(m => m.tipo === 'user' || !m.tipo);
        container.innerHTML = '';
        
        if (!mensagensUsuario || mensagensUsuario.length === 0) {
            container.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
            return;
        }
        
        mensagensUsuario.forEach(mensagem => {
            const mensagemElement = document.createElement('div');
            mensagemElement.className = 'message-item';
            mensagemElement.innerHTML = `
                <h3>${mensagem.usuario_nome || mensagem.usuario}</h3>
                <p>${mensagem.mensagem}</p>
                <p class="message-time">${formatarData(mensagem.data_envio || mensagem.data)}</p>
                <div class="message-actions">
                    <button class="btn-primary" onclick="responderMensagem(${mensagem.id})">
                        <i class="fas fa-reply"></i> Responder
                    </button>
                    ${!mensagem.respondida ? `
                        <button class="btn-secondary" onclick="marcarComoRespondida(${mensagem.id})">
                            <i class="fas fa-check"></i> Marcar como Respondida
                        </button>
                    ` : ''}
                </div>
            `;
            container.appendChild(mensagemElement);
        });
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        container.innerHTML = '<p>Erro ao carregar mensagens.</p>';
    }
}

async function responderMensagem(mensagemId) {
    const resposta = prompt('Digite sua resposta:');
    if (resposta && resposta.trim() && usuarioAtual) {
        try {
            await enviarMensagemAPI({
                usuario_id: usuarioAtual.id,
                mensagem: resposta,
                tipo: 'system'
            });
            alert('Resposta enviada com sucesso!');
            await renderizarMensagensGestao();
        } catch (error) {
            console.error('Erro ao responder mensagem:', error);
            alert('Erro ao enviar resposta. Tente novamente.');
        }
    }
}

async function marcarComoRespondida(mensagemId) {
    try {
        // TODO: Implementar endpoint PUT /mensagens/{id} na API
        // Por enquanto, apenas mostra mensagem
        alert('Funcionalidade será implementada na próxima versão da API.');
    } catch (error) {
        console.error('Erro ao marcar mensagem como respondida:', error);
        alert('Erro ao marcar mensagem. Tente novamente.');
    }
}

function generateReport(tipo) {
    alert(`Relatório ${tipo} será gerado em breve! Esta funcionalidade será implementada na próxima fase do projeto.`);
}

// Funções utilitárias
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
}

function carregarDadosIniciais() {
    // Dados serão carregados via API quando necessário
    console.log('Sistema Santa Terezinha carregado com sucesso!');
}

// ===== NOVAS FUNCIONALIDADES =====

// Controle de Linha para Motorista
async function renderizarControleLinha() {
    const container = document.getElementById('controleLinhaContainer');
    if (!container || !usuarioAtual) return;
    
    try {
        const escalas = await carregarEscalas();
        const hoje = new Date().toISOString().split('T')[0];
        const escala = escalas.find(e => e.motorista_id === usuarioAtual.id && (e.data === hoje || e.data === hoje.split('T')[0]));
        
        if (!escala) {
            container.innerHTML = '<p>Nenhuma escala encontrada para hoje.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="status-linha ${statusLinha}">
                <h3>Status da Linha</h3>
                <p><strong>Linha:</strong> ${escala.rota_nome || escala.linha}</p>
                <p><strong>Veículo:</strong> ${escala.veiculo_numero || escala.veiculo}</p>
                <p><strong>Horário:</strong> ${escala.horario_inicio || escala.horario} - ${escala.horario_fim || ''}</p>
                <p><strong>Status:</strong> ${statusLinha === 'parado' ? 'Parado' : 'Em Operação'}</p>
            </div>
            <div class="controle-buttons">
                ${statusLinha === 'parado' ? 
                    `<button class="btn-iniciar" onclick="iniciarLinha()">
                        <i class="fas fa-play"></i> Iniciar Linha
                    </button>` :
                    `<button class="btn-finalizar" onclick="finalizarLinha()">
                        <i class="fas fa-stop"></i> Finalizar Linha
                    </button>`
                }
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar escala:', error);
        container.innerHTML = '<p>Erro ao carregar escala.</p>';
    }
}

function iniciarLinha() {
    statusLinha = 'rodando';
    renderizarControleLinha();
    alert('Linha iniciada com sucesso!');
}

function finalizarLinha() {
    statusLinha = 'parado';
    renderizarControleLinha();
    alert('Linha finalizada com sucesso!');
}

// Gestão para Gestor
async function showGestorSection(secao) {
    // Atualizar navegação
    const navItems = document.querySelectorAll('#gestorNav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Encontrar o item correto baseado no onclick
    const targetItem = Array.from(navItems).find(item => 
        item.getAttribute('onclick') && item.getAttribute('onclick').includes(secao)
    );
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // Mostrar seção
    const sections = document.querySelectorAll('#gestorScreen .section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(secao + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (secao === 'gestao') {
        showGestaoTab('avisos');
        await carregarAvisosGestao();
    } else if (secao === 'chamados') {
        await renderizarChamadosGestao();
    } else if (secao === 'mensagens') {
        await renderizarMensagensGestao();
    }
}

function showGestaoTab(tab) {
    // Atualizar botões de tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar conteúdo
    const contents = document.querySelectorAll('.gestao-content');
    contents.forEach(content => content.classList.remove('active'));
    
    const targetContent = document.getElementById(tab + 'Gestao');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Carregar dados específicos
    if (tab === 'avisos') {
        carregarAvisosGestao();
    } else if (tab === 'horarios') {
        carregarHorariosGestao();
    } else if (tab === 'escalas') {
        carregarEscalasGestao();
    }
}

// Gestão de Avisos
async function carregarAvisosGestao() {
    const container = document.getElementById('avisosLista');
    if (!container) return;
    
    try {
        const avisos = await carregarAvisos();
        container.innerHTML = '';
        
        if (!avisos || avisos.length === 0) {
            container.innerHTML = '<p>Nenhum aviso encontrado.</p>';
            return;
        }
        
        avisos.forEach(aviso => {
            const avisoElement = document.createElement('div');
            avisoElement.className = 'notice-item';
            avisoElement.innerHTML = `
                <h3>${aviso.titulo || aviso.titulo_aviso}</h3>
                <p>${aviso.conteudo || aviso.mensagem}</p>
                <div class="aviso-meta">
                    <span class="data">${formatarData(aviso.data_publicacao || aviso.data)}</span>
                    ${aviso.prioridade ? `<span class="status-badge status-${aviso.prioridade}">${aviso.prioridade}</span>` : ''}
                    <button class="btn-primary" onclick="editarAviso(${aviso.id})" style="margin-left: 10px;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary" onclick="excluirAviso(${aviso.id})" style="margin-left: 5px;">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            container.appendChild(avisoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar avisos:', error);
        container.innerHTML = '<p>Erro ao carregar avisos.</p>';
    }
}

function abrirModalAviso() {
    document.getElementById('modalAviso').style.display = 'block';
}

function fecharModalAviso() {
    document.getElementById('modalAviso').style.display = 'none';
    document.getElementById('formAviso').reset();
}

async function salvarAviso() {
    const titulo = document.getElementById('avisoTitulo').value;
    const conteudo = document.getElementById('avisoConteudo').value;
    const tipo = document.getElementById('avisoTipo').value;
    const prioridade = document.getElementById('avisoPrioridade').value;
    const expiracao = document.getElementById('avisoExpiracao').value;
    
    if (!titulo || !conteudo || !tipo || !prioridade || !usuarioAtual) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    try {
        // TODO: Implementar endpoint POST /avisos na API
        alert('Funcionalidade será implementada na próxima versão da API.');
        // await apiRequest('avisos', 'POST', {
        //     titulo: titulo,
        //     conteudo: conteudo,
        //     tipo: tipo,
        //     prioridade: prioridade,
        //     autor_id: usuarioAtual.id
        // });
        // await carregarAvisosGestao();
        // fecharModalAviso();
        // alert('Aviso criado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar aviso:', error);
        alert('Erro ao salvar aviso. Tente novamente.');
    }
}

// Gestão de Horários
async function carregarHorariosGestao() {
    const container = document.getElementById('horariosGestaoContainer');
    if (!container) return;
    
    try {
        const rotas = await carregarRotas();
        container.innerHTML = '';
        
        if (!rotas || rotas.length === 0) {
            container.innerHTML = '<p>Nenhuma rota encontrada.</p>';
            return;
        }
        
        rotas.forEach(rota => {
            const rotaElement = document.createElement('div');
            rotaElement.className = 'route-item';
            const horarios = rota.horarios || [];
            rotaElement.innerHTML = `
                <h3>${rota.nome}</h3>
                <p><strong>Status:</strong> <span class="status-badge status-${rota.status || 'operando'}">${rota.status || 'operando'}</span></p>
                <div class="horarios-gestao">
                    <h4>Horários:</h4>
                    <div class="horarios-grid">
                        ${horarios.slice(0, 10).map(horario => 
                            `<span class="horario-item">${horario.horario || horario}</span>`
                        ).join('')}
                        ${horarios.length > 10 ? `<span class="horario-item">... e mais ${horarios.length - 10}</span>` : ''}
                    </div>
                </div>
                <div class="route-actions">
                    <button class="btn-primary" onclick="editarRota(${rota.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary" onclick="alterarStatusRota(${rota.id})">
                        <i class="fas fa-toggle-on"></i> Alterar Status
                    </button>
                </div>
            `;
            container.appendChild(rotaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar horários:', error);
        container.innerHTML = '<p>Erro ao carregar horários.</p>';
    }
}

// Gestão de Escalas
async function carregarEscalasGestao() {
    const container = document.getElementById('escalasLista');
    if (!container) return;
    
    try {
        const escalas = await carregarEscalas();
        container.innerHTML = '';
        
        if (!escalas || escalas.length === 0) {
            container.innerHTML = '<p>Nenhuma escala encontrada.</p>';
            return;
        }
        
        escalas.forEach(escala => {
            const escalaElement = document.createElement('div');
            escalaElement.className = 'escala-item';
            escalaElement.innerHTML = `
                <h3>${escala.data} - ${escala.turno || 'N/A'}</h3>
                <div class="escala-info">
                    <p><strong>Motorista:</strong> ${escala.motorista_nome || escala.motorista || 'N/A'}</p>
                    <p><strong>Horário:</strong> ${escala.horario_inicio || escala.horario} - ${escala.horario_fim || ''}</p>
                    <p><strong>Linha:</strong> ${escala.rota_nome || escala.linha}</p>
                    <p><strong>Veículo:</strong> ${escala.veiculo_numero || escala.veiculo}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${escala.status}">${escala.status}</span></p>
                </div>
                <div class="escala-actions">
                    <button class="btn-primary" onclick="editarEscala(${escala.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary" onclick="excluirEscala(${escala.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            container.appendChild(escalaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar escalas:', error);
        container.innerHTML = '<p>Erro ao carregar escalas.</p>';
    }
}

function abrirModalEscala() {
    // Preencher selects
    preencherSelectMotoristas();
    preencherSelectRotas();
    preencherSelectVeiculos();
    
    document.getElementById('modalEscala').style.display = 'block';
}

function fecharModalEscala() {
    document.getElementById('modalEscala').style.display = 'none';
    document.getElementById('formEscala').reset();
}

async function preencherSelectMotoristas() {
    const select = document.getElementById('escalaMotorista');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione o motorista</option>';
    
    try {
        // TODO: Implementar endpoint GET /usuarios?tipo=motorista na API
        // Por enquanto, deixar vazio ou usar dados locais se necessário
        console.warn('Endpoint de usuários não implementado na API');
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
    }
}

async function preencherSelectRotas() {
    const select = document.getElementById('escalaRota');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione a rota</option>';
    
    try {
        const rotas = await carregarRotas();
        rotas.forEach(rota => {
            const option = document.createElement('option');
            option.value = rota.id;
            option.textContent = rota.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar rotas:', error);
    }
}

function preencherSelectVeiculos() {
    const select = document.getElementById('escalaVeiculo');
    select.innerHTML = '<option value="">Selecione o veículo</option>';
    
    // Simular veículos
    const veiculos = [
        { numero: '001', placa: 'ABC-1234' },
        { numero: '002', placa: 'DEF-5678' },
        { numero: '003', placa: 'GHI-9012' },
        { numero: '004', placa: 'JKL-3456' },
        { numero: '005', placa: 'MNO-7890' }
    ];
    
    veiculos.forEach(veiculo => {
        const option = document.createElement('option');
        option.value = veiculo.numero;
        option.textContent = `Ônibus ${veiculo.numero} - ${veiculo.placa}`;
        select.appendChild(option);
    });
}

async function salvarEscala() {
    const motorista = document.getElementById('escalaMotorista').value;
    const data = document.getElementById('escalaData').value;
    const turno = document.getElementById('escalaTurno').value;
    const horarioInicio = document.getElementById('escalaHorarioInicio').value;
    const horarioFim = document.getElementById('escalaHorarioFim').value;
    const rota = document.getElementById('escalaRota').value;
    const veiculo = document.getElementById('escalaVeiculo').value;
    
    if (!motorista || !data || !turno || !horarioInicio || !horarioFim || !rota || !veiculo) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    try {
        // TODO: Implementar endpoint POST /escalas na API
        alert('Funcionalidade será implementada na próxima versão da API.');
        // await apiRequest('escalas', 'POST', {
        //     motorista_id: motorista,
        //     rota_id: rota,
        //     veiculo_id: veiculo,
        //     data: data,
        //     turno: turno,
        //     horario_inicio: horarioInicio,
        //     horario_fim: horarioFim,
        //     status: 'pendente'
        // });
        // await carregarEscalasGestao();
        // fecharModalEscala();
        // alert('Escala criada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar escala:', error);
        alert('Erro ao salvar escala. Tente novamente.');
    }
}

// Resolver Chamado com Descrição
function resolverChamado(id) {
    chamadoAtual = id;
    document.getElementById('modalResolverChamado').style.display = 'block';
}

function fecharModalResolverChamado() {
    document.getElementById('modalResolverChamado').style.display = 'none';
    document.getElementById('formResolverChamado').reset();
    chamadoAtual = null;
}

async function confirmarResolucaoChamado() {
    const descricao = document.getElementById('solucaoDescricao').value;
    const pecas = document.getElementById('solucaoPecas').value;
    const custo = document.getElementById('solucaoCusto').value;
    const observacoes = document.getElementById('solucaoObservacoes').value;
    
    if (!descricao || !usuarioAtual || !chamadoAtual) {
        alert('A descrição da solução é obrigatória.');
        return;
    }
    
    try {
        await atualizarChamadoAPI(chamadoAtual, {
            status: 'resolvido',
            mecanico_id: usuarioAtual.id,
            observacoes: `${descricao}\nPeças: ${pecas || 'N/A'}\nCusto: ${custo || 'N/A'}\n${observacoes || ''}`
        });
        
        await renderizarChamados();
        fecharModalResolverChamado();
        alert('Chamado resolvido com sucesso!');
    } catch (error) {
        console.error('Erro ao resolver chamado:', error);
        alert('Erro ao resolver chamado. Tente novamente.');
    }
}

// Relatórios Funcionais
async function gerarRelatorioOperacional() {
    try {
        const stats = await carregarDashboard();
        const relatorio = `
            <div class="relatorio-content">
                <div class="relatorio-header">
                    <h2>RELATÓRIO OPERACIONAL</h2>
                    <p>Santa Terezinha Transporte - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="relatorio-section">
                    <h4>Status da Frota</h4>
                    <table class="relatorio-table">
                        <tr><th>Total de Veículos</th><td>${stats.frota.total || 0}</td></tr>
                        <tr><th>Disponíveis</th><td>${stats.frota.disponiveis || stats.frota.disponiveis || 0}</td></tr>
                        <tr><th>Em Manutenção</th><td>${stats.frota.em_manutencao || stats.frota.emManutencao || 0}</td></tr>
                        <tr><th>Fora de Serviço</th><td>${stats.frota.fora_servico || stats.frota.foraDeServico || 0}</td></tr>
                    </table>
                </div>
                
                <div class="relatorio-section">
                    <h4>Status dos Motoristas</h4>
                    <table class="relatorio-table">
                        <tr><th>Total de Motoristas</th><td>${stats.motoristas.total || 0}</td></tr>
                        <tr><th>Dirigindo</th><td>${stats.motoristas.dirigindo || 0}</td></tr>
                        <tr><th>Fora de Escala</th><td>${stats.motoristas.fora_escala || stats.motoristas.foraDeEscala || 0}</td></tr>
                    </table>
                </div>
                
                <div class="relatorio-section">
                    <h4>Indicadores Gerais</h4>
                    <table class="relatorio-table">
                        <tr><th>Chamados Abertos</th><td>${stats.chamados_abertos || stats.chamadosAbertos || 0}</td></tr>
                        <tr><th>Mensagens Pendentes</th><td>${stats.mensagens_pendentes || stats.mensagensPendentes || 0}</td></tr>
                    </table>
                </div>
            </div>
        `;
        
        mostrarRelatorio(relatorio);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

async function gerarRelatorioManutencao() {
    try {
        const chamados = await carregarChamados();
        const chamadosResolvidos = chamados.filter(c => c.status === 'resolvido' && (c.observacoes || c.data_resolucao));
        
        let tabelaChamados = '';
        chamadosResolvidos.forEach(chamado => {
            tabelaChamados += `
                <tr>
                    <td>#${chamado.id}</td>
                    <td>${chamado.motorista_nome || chamado.motorista}</td>
                    <td>${chamado.veiculo_numero || chamado.veiculo}</td>
                    <td>${chamado.tipo}</td>
                    <td>${chamado.observacoes || 'N/A'}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>${formatarData(chamado.data_resolucao || chamado.data)}</td>
                </tr>
            `;
        });
        
        const relatorio = `
            <div class="relatorio-content">
                <div class="relatorio-header">
                    <h2>RELATÓRIO DE MANUTENÇÃO</h2>
                    <p>Santa Terezinha Transporte - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="relatorio-section">
                    <h4>Chamados Resolvidos</h4>
                    <table class="relatorio-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Motorista</th>
                                <th>Veículo</th>
                                <th>Tipo</th>
                                <th>Solução</th>
                                <th>Peças</th>
                                <th>Custo</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabelaChamados}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        mostrarRelatorio(relatorio);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

async function gerarRelatorioPassageiros() {
    try {
        const mensagens = await carregarMensagens();
        const mensagensUsuario = mensagens.filter(m => m.tipo === 'user' || !m.tipo);
        
        let tabelaMensagens = '';
        mensagensUsuario.forEach(msg => {
            tabelaMensagens += `
                <tr>
                    <td>${msg.usuario_nome || msg.usuario}</td>
                    <td>${msg.mensagem}</td>
                    <td>${formatarData(msg.data_envio || msg.data)}</td>
                </tr>
            `;
        });
        
        const relatorio = `
            <div class="relatorio-content">
                <div class="relatorio-header">
                    <h2>RELATÓRIO DE PASSAGEIROS</h2>
                    <p>Santa Terezinha Transporte - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="relatorio-section">
                    <h4>Mensagens dos Passageiros</h4>
                    <table class="relatorio-table">
                        <thead>
                            <tr>
                                <th>Passageiro</th>
                                <th>Mensagem</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabelaMensagens}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        mostrarRelatorio(relatorio);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

async function gerarRelatorioChamados() {
    try {
        const chamados = await carregarChamados();
        
        let tabelaChamados = '';
        chamados.forEach(chamado => {
            tabelaChamados += `
                <tr>
                    <td>#${chamado.id}</td>
                    <td>${chamado.motorista_nome || chamado.motorista}</td>
                    <td>${chamado.veiculo_numero || chamado.veiculo}</td>
                    <td>${chamado.tipo}</td>
                    <td>${chamado.descricao}</td>
                    <td><span class="status-badge status-${chamado.urgencia}">${chamado.urgencia}</span></td>
                    <td><span class="status-badge status-${chamado.status}">${chamado.status}</span></td>
                    <td>${formatarData(chamado.data_abertura || chamado.data)}</td>
                </tr>
            `;
        });
        
        const relatorio = `
            <div class="relatorio-content">
                <div class="relatorio-header">
                    <h2>RELATÓRIO DE CHAMADOS</h2>
                    <p>Santa Terezinha Transporte - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="relatorio-section">
                    <h4>Todos os Chamados</h4>
                    <table class="relatorio-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Motorista</th>
                                <th>Veículo</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>Urgência</th>
                                <th>Status</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabelaChamados}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        mostrarRelatorio(relatorio);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

function mostrarRelatorio(conteudo) {
    const preview = document.getElementById('relatorioPreview');
    preview.innerHTML = conteudo;
    preview.classList.add('active');
}

// Funções globais para uso no HTML
window.showPassageiroSection = showPassageiroSection;
window.showMotoristaSection = showMotoristaSection;
window.showMecanicoSection = showMecanicoSection;
window.showGestorSection = showGestorSection;
window.showLogin = showLogin;
window.toggleMenu = toggleMenu;
window.searchRoutes = searchRoutes;
window.sendMessage = sendMessage;
window.assumirChamado = assumirChamado;
window.resolverChamado = resolverChamado;
window.atualizarItemChecklist = atualizarItemChecklist;
window.generateReport = generateReport;

// Novas funções
window.showGestaoTab = showGestaoTab;
window.abrirModalAviso = abrirModalAviso;
window.fecharModalAviso = fecharModalAviso;
window.salvarAviso = salvarAviso;
window.abrirModalEscala = abrirModalEscala;
window.fecharModalEscala = fecharModalEscala;
window.salvarEscala = salvarEscala;
window.fecharModalResolverChamado = fecharModalResolverChamado;
window.confirmarResolucaoChamado = confirmarResolucaoChamado;
window.gerarRelatorioOperacional = gerarRelatorioOperacional;
window.gerarRelatorioManutencao = gerarRelatorioManutencao;
window.gerarRelatorioPassageiros = gerarRelatorioPassageiros;
window.gerarRelatorioChamados = gerarRelatorioChamados;
window.responderMensagem = responderMensagem;
window.marcarComoRespondida = marcarComoRespondida;

