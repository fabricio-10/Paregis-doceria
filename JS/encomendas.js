// === Sistema de gerenciamento de encomendas: filtra, cria e acompanha pedidos ===
class EncomendaManager {
    // --- Construtor: carrega dados existentes e inicializa visão ---
    constructor() {
        this.encomendas = this.carregarEncomendas();
        this.filtroAtivo = 'todos';
        this.init();
    }

    // --- Inicialização: eventos, renderização inicial e ajustes de data ---
    init() {
        this.setupEventListeners();
        this.renderizarEncomendas();
        this.configurarDataMinima();
        this.verificarProdutoSelecionado();
    }

    // --- Registra todos os ouvintes necessários para a página ---
    setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.aplicarFiltro(e.target.dataset.status);
            });
        });

        // Busca
    // --- Carrega seleção direta vindas da página principal ---
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.buscarEncomendas(e.target.value);
        });

        // Modal nova encomenda
        document.getElementById('btnNovaEncomenda').addEventListener('click', () => {
            this.abrirModalNovaEncomenda();
        });

        // Fechar modais
        document.getElementById('modalClose').addEventListener('click', () => {
            this.fecharModal('modalEncomenda');
        });

        document.getElementById('modalDetalhesClose').addEventListener('click', () => {
            this.fecharModal('modalDetalhes');
        });

        document.getElementById('btnCancel').addEventListener('click', () => {
            this.fecharModal('modalEncomenda');
        });

        // Formulário de nova encomenda
        document.getElementById('formEncomenda').addEventListener('submit', (e) => {
            e.preventDefault();
            this.criarEncomenda();
        });

        // Fechar modal clicando fora
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.fecharModal(overlay.id);
                }
            });
        });

        // Atualizar preço quando mudar o tipo de produto
        document.getElementById('produtoTipo').addEventListener('change', (e) => {
            this.atualizarPrecoEstimado(e.target.value);
        });

        document.getElementById('produtoQuantidade').addEventListener('input', (e) => {
            const tipo = document.getElementById('produtoTipo').value;
            if (tipo) {
                this.calcularPrecoTotal(tipo, e.target.value);
            }
        });
    }

    // --- Carrega seleção direta vindas da página principal ---
    verificarProdutoSelecionado() {
        const produtoSelecionado = localStorage.getItem('produtoSelecionado');
        if (produtoSelecionado) {
            const produto = JSON.parse(produtoSelecionado);
            localStorage.removeItem('produtoSelecionado');
            
            // Abrir modal e pré-preencher
            setTimeout(() => {
                this.abrirModalNovaEncomenda();
                document.getElementById('produtoTipo').value = produto.tipo;
                this.atualizarPrecoEstimado(produto.tipo);
            }, 500);
        }
    }

    // --- Define data mínima para criação de novas encomendas ---
    configurarDataMinima() {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        
        const dataMinima = amanha.toISOString().split('T')[0];
        document.getElementById('dataEntrega').min = dataMinima;
    }

    // --- Atualiza orçamento estimado conforme tipo e quantidade ---
    atualizarPrecoEstimado(tipo) {
        const precos = {
            'bolo': 45.00,
            'brigadeiro': 3.50,
            'cookies': 2.50,
            'sobremesa': 8.00,
            'taca': 12.00,
            'especial': 0
        };

        const quantidade = document.getElementById('produtoQuantidade').value || 1;
        const precoUnitario = precos[tipo] || 0;
        const total = precoUnitario * quantidade;

        document.getElementById('valorEstimado').value = total > 0 ? total.toFixed(2) : '';
    }

    // --- Wrapper para recalcular total quando quantidade muda ---
    calcularPrecoTotal(tipo, quantidade) {
        this.atualizarPrecoEstimado(tipo);
    }

    // --- Busca encomendas no storage ou usa exemplos ---
    carregarEncomendas() {
        const encomendas = localStorage.getItem('doceTermoEncomendas');
        if (encomendas) {
            return JSON.parse(encomendas);
        }
        
        // Dados de exemplo para demonstração
        return [
            {
                numero: 'ENC-001',
                cliente: {
                    nome: 'Maria Silva',
                    telefone: '(11) 99999-1234',
                    email: 'maria@email.com'
                },
                produto: {
                    tipo: 'bolo',
                    nome: 'Bolo Artesanal',
                    quantidade: 1,
                    sabor: 'Chocolate com Morango',
                    observacoes: 'Sem açúcar, para diabético'
                },
                entrega: {
                    data: '2025-10-30',
                    hora: '15:00',
                    endereco: 'Rua das Flores, 123 - Centro'
                },
                valor: 65.00,
                pagamento: 'pix',
                status: 'confirmado',
                dataCriacao: '2025-10-27T10:30:00',
                historico: [
                    {
                        status: 'pendente',
                        data: '2025-10-27T10:30:00',
                        descricao: 'Encomenda criada'
                    },
                    {
                        status: 'confirmado',
                        data: '2025-10-27T11:00:00',
                        descricao: 'Encomenda confirmada pelo cliente'
                    }
                ]
            },
            {
                id: '002',
                numero: 'ENC-002',
                cliente: {
                    nome: 'João Santos',
                    telefone: '(11) 88888-5678',
                    email: 'joao@email.com'
                },
                produto: {
                    tipo: 'brigadeiro',
                    nome: 'Brigadeiros Gourmet',
                    quantidade: 50,
                    sabor: 'Variados (chocolate, beijinho, cajuzinho)',
                    observacoes: 'Para festa de aniversário'
                },
                entrega: {
                    data: '2025-10-28',
                    hora: '18:00',
                    endereco: 'Retirada na loja'
                },
                valor: 175.00,
                pagamento: 'cartao',
                status: 'produzindo',
                dataCriacao: '2025-10-26T14:20:00',
                historico: [
                    {
                        status: 'pendente',
                        data: '2025-10-26T14:20:00',
                        descricao: 'Encomenda criada'
                    },
                    {
                        status: 'confirmado',
                        data: '2025-10-26T15:00:00',
                        descricao: 'Encomenda confirmada'
                    },
                    {
                        status: 'produzindo',
                        data: '2025-10-27T09:00:00',
                        descricao: 'Produção iniciada'
                    }
                ]
            }
        ];
    }
        // --- Busca encomendas no storage ou usa exemplos ---

    // --- Salva lista de encomendas no localStorage ---
    salvarEncomendas() {
        localStorage.setItem('doceTermoEncomendas', JSON.stringify(this.encomendas));
    }

    // --- Gera identificador incremental para novas encomendas ---
    gerarNumeroEncomenda() {
        const ultimoNumero = this.encomendas.length > 0 
            ? Math.max(...this.encomendas.map(e => parseInt(e.id))) 
            : 0;
        const novoNumero = (ultimoNumero + 1).toString().padStart(3, '0');
        return `ENC-${novoNumero}`;
    }

    // --- Constrói objeto de encomenda a partir do formulário e salva ---
    criarEncomenda() {
        const formData = new FormData(document.getElementById('formEncomenda'));
        
        // Validação básica
        const camposObrigatorios = ['clienteNome', 'clientePhone', 'produtoTipo', 'produtoQuantidade', 'dataEntrega'];
        for (let campo of camposObrigatorios) {
            if (!document.getElementById(campo).value.trim()) {
                this.mostrarNotificacao(`Por favor, preencha o campo ${this.getNomeCampo(campo)}`, 'error');
                return;
            }
        }

        const novaEncomenda = {
            id: (this.encomendas.length + 1).toString().padStart(3, '0'),
            numero: this.gerarNumeroEncomenda(),
            cliente: {
                nome: document.getElementById('clienteNome').value,
                telefone: document.getElementById('clientePhone').value,
                email: document.getElementById('clienteEmail').value
            },
            produto: {
                tipo: document.getElementById('produtoTipo').value,
                nome: this.getNomeProduto(document.getElementById('produtoTipo').value),
                quantidade: parseInt(document.getElementById('produtoQuantidade').value),
                sabor: document.getElementById('produtoSabor').value,
                observacoes: document.getElementById('produtoObservacoes').value
            },
            entrega: {
                data: document.getElementById('dataEntrega').value,
                hora: document.getElementById('horaEntrega').value,
                endereco: document.getElementById('enderecoEntrega').value || 'Retirada na loja'
            },
            valor: parseFloat(document.getElementById('valorEstimado').value) || 0,
            pagamento: document.getElementById('formaPagamento').value,
            status: 'pendente',
            dataCriacao: new Date().toISOString(),
            historico: [
                {
                    status: 'pendente',
                    data: new Date().toISOString(),
                    descricao: 'Encomenda criada'
                }
            ]
        };

        this.encomendas.unshift(novaEncomenda);
        this.salvarEncomendas();
        this.renderizarEncomendas();
        this.fecharModal('modalEncomenda');
        this.limparFormulario();
        
        this.mostrarNotificacao('Encomenda criada com sucesso!', 'success');
    }

    // --- Tradução simples de campos obrigatórios para mensagens ---
    getNomeCampo(campo) {
        const nomes = {
            'clienteNome': 'Nome do Cliente',
            'clientePhone': 'Telefone',
            'produtoTipo': 'Tipo de Produto',
            'produtoQuantidade': 'Quantidade',
            'dataEntrega': 'Data de Entrega'
        };
        return nomes[campo] || campo;
    }

    // --- Retorna nome amigável do produto pelo código ---
    getNomeProduto(tipo) {
        const produtos = {
            'bolo': 'Bolo Artesanal',
            'brigadeiro': 'Brigadeiros Gourmet',
            'cookies': 'Cookies Artesanais',
            'sobremesa': 'Sobremesas Geladas',
            'taca': 'Taças Gourmet',
            'especial': 'Doces Especiais'
        };
        return produtos[tipo] || tipo;
    }

    // --- Limpa formulário após criar encomenda ---
    limparFormulario() {
        document.getElementById('formEncomenda').reset();
    }

    // --- Aplica filtro de status e atualiza estilo dos botões ---
    aplicarFiltro(status) {
        this.filtroAtivo = status;
        
        // Atualizar botões
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.renderizarEncomendas();
    }

    // --- Busca textual nas encomendas já renderizadas ---
    buscarEncomendas(termo) {
        const cards = document.querySelectorAll('.encomenda-card');
        cards.forEach(card => {
            const numero = card.querySelector('.encomenda-numero').textContent.toLowerCase();
            const produto = card.querySelector('.produto-nome').textContent.toLowerCase();
            const termoNormalizado = termo.toLowerCase();
            if (numero.includes(termoNormalizado) || produto.includes(termoNormalizado)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        this.verificarEstadoVazio();
    }

    // --- Renderiza cards filtrados e gerencia estados vazios ---
    renderizarEncomendas() {
        const container = document.getElementById('encomendasGrid');
        let encomendasFiltradas = this.encomendas;

        if (this.filtroAtivo !== 'todos') {
            encomendasFiltradas = this.encomendas.filter(e => e.status === this.filtroAtivo);
        }

        if (encomendasFiltradas.length === 0) {
            container.innerHTML = '';
            document.getElementById('emptyState').style.display = 'block';
            return;
        }

        document.getElementById('emptyState').style.display = 'none';

        container.innerHTML = encomendasFiltradas.map(encomenda => this.criarCardEncomenda(encomenda)).join('');

        this.adicionarEventListenersCards();
    }

    // --- Monta HTML de cada card de encomenda ---
    criarCardEncomenda(encomenda) {
        const dataEntrega = new Date(encomenda.entrega.data).toLocaleDateString('pt-BR');
        const dataCriacao = new Date(encomenda.dataCriacao).toLocaleDateString('pt-BR');
        
        return `
            <div class="encomenda-card" data-id="${encomenda.id}">
                <div class="encomenda-header">
                    <div class="encomenda-numero">#${encomenda.numero}</div>
                    <span class="status-badge status-${encomenda.status}">
                        ${this.getStatusTexto(encomenda.status)}
                    </span>
                </div>
                
                <div class="encomenda-info">
                    <div class="info-row">
                        <span class="info-label">Cliente:</span>
                        <span class="info-value">${encomenda.cliente.nome}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Telefone:</span>
                        <span class="info-value">${encomenda.cliente.telefone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Data de Entrega:</span>
                        <span class="info-value">${dataEntrega} ${encomenda.entrega.hora || ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Valor:</span>
                        <span class="info-value">R$ ${encomenda.valor.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="produto-info">
                    <div class="produto-nome">${encomenda.produto.nome} (${encomenda.produto.quantidade}x)</div>
                    <div class="produto-detalhes">
                        ${encomenda.produto.sabor ? `Sabor: ${encomenda.produto.sabor}` : ''}
                    </div>
                </div>
                
                <div class="encomenda-actions">
                    <button class="btn-detalhes" onclick="encomendaManager.verDetalhes('${encomenda.id}')">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    <button class="btn-status" onclick="encomendaManager.atualizarStatus('${encomenda.id}')">
                        <i class="fas fa-edit"></i> Status
                    </button>
                </div>
            </div>
        `;
    }

    // --- Converte status interno em texto legível ---
    getStatusTexto(status) {
        const textos = {
            'pendente': 'Pendente',
            'confirmado': 'Confirmado',
            'produzindo': 'Produzindo',
            'pronto': 'Pronto',
            'entregue': 'Entregue'
        };
        return textos[status] || status;
    }

    // --- Placeholder para listeners adicionais nos cards ---
    adicionarEventListenersCards() {
        // Os event listeners são adicionados inline no HTML para simplicidade
        // Em uma aplicação real, seria melhor usar event delegation
    }
    
    // --- Abre modal com detalhes completos da encomenda ---
    verDetalhes(id) {
        const encomenda = this.encomendas.find(e => e.id === id);
        if (!encomenda) {
            this.mostrarNotificacao('Não foi possível carregar os detalhes da encomenda.', 'error');
            return;
        }

        const conteudo = this.criarConteudoDetalhes(encomenda);
        document.getElementById('detalhesContent').innerHTML = conteudo;
        this.abrirModal('modalDetalhes');
    }

    // --- Gera conteúdo HTML da modal de detalhes ---
    criarConteudoDetalhes(encomenda) {
        const dataEntrega = new Date(encomenda.entrega.data).toLocaleDateString('pt-BR');
        const dataCriacao = new Date(encomenda.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="detalhes-section">
                <h4><i class="fas fa-user"></i> Dados do Cliente</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <span class="detalhe-label">Nome:</span>
                        <span class="detalhe-value">${encomenda.cliente.nome}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Telefone:</span>
                        <span class="detalhe-value">${encomenda.cliente.telefone}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">E-mail:</span>
                        <span class="detalhe-value">${encomenda.cliente.email || 'Não informado'}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Status:</span>
                        <span class="detalhe-value">
                            <span class="status-badge status-${encomenda.status}">
                                ${this.getStatusTexto(encomenda.status)}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="detalhes-section">
                <h4><i class="fas fa-cake-candles"></i> Produto</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <span class="detalhe-label">Produto:</span>
                        <span class="detalhe-value">${encomenda.produto.nome}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Quantidade:</span>
                        <span class="detalhe-value">${encomenda.produto.quantidade}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Sabor:</span>
                        <span class="detalhe-value">${encomenda.produto.sabor || 'Não especificado'}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Valor:</span>
                        <span class="detalhe-value">R$ ${encomenda.valor.toFixed(2)}</span>
                    </div>
                </div>
                ${encomenda.produto.observacoes ? `
                    <div style="margin-top: 1rem;">
                        <span class="detalhe-label">Observações:</span>
                        <p style="margin-top: 0.5rem; padding: 1rem; background: var(--light-gray); border-radius: 8px;">
                            ${encomenda.produto.observacoes}
                        </p>
                    </div>
                ` : ''}
            </div>

            <div class="detalhes-section">
                <h4><i class="fas fa-truck"></i> Entrega</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <span class="detalhe-label">Data:</span>
                        <span class="detalhe-value">${dataEntrega}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Horário:</span>
                        <span class="detalhe-value">${encomenda.entrega.hora || 'Não especificado'}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Pagamento:</span>
                        <span class="detalhe-value">${this.getFormaPagamento(encomenda.pagamento)}</span>
                    </div>
                    <div class="detalhe-item">
                        <span class="detalhe-label">Criado em:</span>
                        <span class="detalhe-value">${dataCriacao}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <span class="detalhe-label">Endereço:</span>
                    <p style="margin-top: 0.5rem; padding: 1rem; background: var(--light-gray); border-radius: 8px;">
                        ${encomenda.entrega.endereco}
                    </p>
                </div>
            </div>

            <div class="detalhes-section">
                <h4><i class="fas fa-history"></i> Histórico</h4>
                <div class="timeline">
                    ${encomenda.historico.map(item => `
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="fas ${this.getIconeStatus(item.status)}"></i>
                            </div>
                            <div class="timeline-content">
                                <h5>${item.descricao}</h5>
                                <span>${new Date(item.data).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button class="btn-save" onclick="encomendaManager.atualizarStatus('${encomenda.id}')">
                    <i class="fas fa-edit"></i> Atualizar Status
                </button>
                <button class="btn-cancel" onclick="encomendaManager.contatarCliente('${encomenda.cliente.telefone}', '${encomenda.numero}')">
                    <i class="fab fa-whatsapp"></i> Contatar Cliente
                </button>
            </div>
        `;
    }

    // --- Descreve forma de pagamento em texto ---
    getFormaPagamento(forma) {
        const formas = {
            'dinheiro': 'Dinheiro',
            'cartao': 'Cartão',
            'pix': 'PIX',
            'transferencia': 'Transferência'
        };
        return formas[forma] || 'A definir';
    }

    // --- Ícones visuais representando status ---
    getIconeStatus(status) {
        const icones = {
            'pendente': 'fa-clock',
            'confirmado': 'fa-check',
            'produzindo': 'fa-cog',
            'pronto': 'fa-check-double',
            'entregue': 'fa-truck'
        };
        return icones[status] || 'fa-circle';
    }

    // --- Lógica para avançar status da encomenda ---
    atualizarStatus(id) {
        const encomenda = this.encomendas.find(e => e.id === id);
        if (!encomenda) return;

        const statusAtual = encomenda.status;
        const proximosStatus = this.getProximosStatus(statusAtual);

        if (proximosStatus.length === 0) {
            this.mostrarNotificacao('Esta encomenda já foi entregue!', 'info');
            return;
        }

        // Criar modal simples para seleção de status
        const opcoes = proximosStatus.map(status => 
            `<option value="${status}">${this.getStatusTexto(status)}</option>`
        ).join('');

        const conteudo = `
            <div style="padding: 2rem;">
                <h3 style="margin-bottom: 1rem;">Atualizar Status - #${encomenda.numero}</h3>
                <p style="margin-bottom: 1rem; color: var(--text-light);">
                    Status atual: <strong>${this.getStatusTexto(statusAtual)}</strong>
                </p>
                <div class="form-group">
                    <label for="novoStatus">Novo Status:</label>
                    <select id="novoStatus" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                        ${opcoes}
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button class="btn-cancel" onclick="encomendaManager.fecharModal('modalDetalhes')">Cancelar</button>
                    <button class="btn-save" onclick="encomendaManager.confirmarAtualizacaoStatus('${id}')">Confirmar</button>
                </div>
            </div>
        `;

        document.getElementById('detalhesContent').innerHTML = conteudo;
    }

    // --- Retorna possíveis próximos status do fluxo ---
    getProximosStatus(statusAtual) {
        const fluxo = {
            'pendente': ['confirmado'],
            'confirmado': ['produzindo'],
            'produzindo': ['pronto'],
            'pronto': ['entregue'],
            'entregue': []
        };
        return fluxo[statusAtual] || [];
    }

    // --- Modal de confirmação para mudança de status ---
    confirmarAtualizacaoStatus(id) {
        const novoStatus = document.getElementById('novoStatus').value;
        const encomenda = this.encomendas.find(e => e.id === id);
        
        if (!encomenda) return;

        // Atualizar status
        encomenda.status = novoStatus;
        
        // Adicionar ao histórico
        encomenda.historico.push({
            status: novoStatus,
            data: new Date().toISOString(),
            descricao: `Status alterado para ${this.getStatusTexto(novoStatus)}`
        });

        this.salvarEncomendas();
        this.renderizarEncomendas();
        this.fecharModal('modalDetalhes');
        
        this.mostrarNotificacao(`Status atualizado para ${this.getStatusTexto(novoStatus)}!`, 'success');
    }

    // --- Abre conversa com cliente via WhatsApp ---
    contatarCliente(telefone, numeroEncomenda) {
        const mensagem = `Olá! Aqui é da Doce Termo. Sobre sua encomenda ${numeroEncomenda}...`;
        const url = `https://wa.me/55${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }

    // --- Mostra estado vazio quando não há cards correspondentes ---
    verificarEstadoVazio() {
        const cards = document.querySelectorAll('.encomenda-card[style*="block"], .encomenda-card:not([style*="none"])');
        const emptyState = document.getElementById('emptyState');
        
        if (cards.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    // --- Utilitário genérico para abrir modal ---
    abrirModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // --- Fecha modal e restaura rolagem ---
    fecharModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // --- Abre modal da nova encomenda já preparando contexto ---
    abrirModalNovaEncomenda() {
        this.limparFormulario();
        this.abrirModal('modalEncomenda');
    }

    // --- Exibe notificações reaproveitando função global quando possível ---
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Usar a função do script.js
        if (typeof showNotification === 'function') {
            showNotification(mensagem, tipo);
        } else {
            alert(mensagem);
        }
    }
}

// --- Inicializa o gerenciador de encomendas ao carregar o DOM ---
document.addEventListener('DOMContentLoaded', () => {
    window.encomendaManager = new EncomendaManager();
});

// --- Integração com página principal: permite criar nova encomenda rapidamente ---
function adicionarEncomendaRapida(produtoTipo, produtoNome) {
    if (window.encomendaManager) {
        window.encomendaManager.abrirModalNovaEncomenda();
        
        // Pré-preencher o tipo de produto
        setTimeout(() => {
            document.getElementById('produtoTipo').value = produtoTipo;
            window.encomendaManager.atualizarPrecoEstimado(produtoTipo);
        }, 100);
    }
}

// --- Log informativo para depuração ---
console.log('🍰 Sistema de Encomendas - Doce Termo carregado!');