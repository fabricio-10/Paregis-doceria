// Sistema de personalização de pedidos
class PedidoManager {
    constructor() {
        this.produtoAtual = null;
        this.ultimoPedido = null;

        this.produtos = {
            bolo: {
                nome: 'Bolo Artesanal',
                base: 45,
                prazo: '3-5 dias úteis',
                imagem: 'https://delicious.com.br/wp-content/uploads/2020/11/DSC_0323.jpg'
            },
            brigadeiro: {
                nome: 'Brigadeiros Gourmet',
                base: 3.5,
                prazo: '2-3 dias úteis',
                imagem: 'https://www.sabornamesa.com.br/media/k2/items/cache/5003d452a8da016f3ed02a6385cf54e8_XL.jpg'
            },
            cookies: {
                nome: 'Cookies Artesanais',
                base: 2.5,
                prazo: '1-2 dias úteis',
                imagem: 'https://static.giulianaflores.com.br/images/product/rs-4163-11244-1.jpg?ims=600x600'
            },
            sobremesa: {
                nome: 'Sobremesas Geladas',
                base: 8,
                prazo: '2-3 dias úteis',
                imagem: 'https://minhasreceitinhas.com.br/wp-content/uploads/2022/10/maxresdefault-2022-10-04T094903.823-730x365.jpg'
            },
            taca: {
                nome: 'Taças Gourmet',
                base: 12,
                prazo: '1-2 dias úteis',
                imagem: 'https://www.estadao.com.br/resizer/v2/K2QRSMKUOJMBDPNNH32QFWFP2E.jpg?quality=80&auth=235aa4f2617f3921d805d05ad79c80b01f8bf4e1992830456c8e346f1c7d0e29&width=380'
            },
            especial: {
                nome: 'Doces Especiais',
                base: 0,
                prazo: 'A definir conforme o projeto',
                imagem: 'https://kitfestabh.com.br/wp-content/uploads/2023/12/docinhos-gourmet-mais-vendidos10-1-1024x576.webp'
            }
        };

        this.cacheDom();
        this.bindEventosBase();
        this.configurarDataMinima();
        const entregaInicial = document.querySelector('input[name="tipoEntrega"]:checked')?.value || 'entrega';
        this.toggleEnderecoEntrega(entregaInicial);
        this.verificarProdutoPreSelecionado();
        this.loadDraft();
    }

    cacheDom() {
        this.section = document.getElementById('personalizacaoSection');
        this.containerOpcoes = document.getElementById('opcoesProduto');
        this.form = document.getElementById('formPersonalizacao');
        this.previewTitulo = document.getElementById('produtoSelecionadoTitulo');
        this.previewImagem = document.querySelector('#previewVisual img');
        this.previewImagemDefault = this.previewImagem?.getAttribute('src') || '';
        this.previewImagemDefaultAlt = this.previewImagem?.getAttribute('alt') || 'Pré-visualização do produto';
        this.previewValor = document.getElementById('valorTotal');
        this.previewPrazo = document.getElementById('prazoEntrega');
        this.resumoLista = document.getElementById('listaresumo');
        this.btnVoltar = document.getElementById('btnVoltar');
        this.btnOrcamento = document.getElementById('btnOrcamento');
        this.btnWhatsapp = document.getElementById('btnWhatsapp');
        this.btnNovoPedido = document.getElementById('btnNovoPedido');
    }

    bindEventosBase() {
        document.querySelectorAll('.btn-selecionar').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const card = event.target.closest('.produto-item');
                if (!card) return;
                this.selecionarProduto(card.dataset.produto);
            });
        });

        const carousel = document.querySelector('.produtos-carousel');
        if (carousel) {
            carousel.addEventListener('click', (event) => {
                const card = event.target.closest('.produto-item');
                if (!card || event.target.closest('.btn-selecionar')) {
                    return;
                }
                this.selecionarProduto(card.dataset.produto);
            });
        }

        if (this.btnVoltar) {
            this.btnVoltar.addEventListener('click', () => this.voltarSelecao());
        }

        document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                this.toggleEnderecoEntrega(event.target.value);
            });
        });

        if (this.form) {
            this.form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.finalizarPedido();
            });
        }

        if (this.btnOrcamento) {
            this.btnOrcamento.addEventListener('click', () => this.solicitarOrcamento());
        }

        if (this.btnWhatsapp) {
            this.btnWhatsapp.addEventListener('click', () => this.enviarWhatsApp());
        }

        if (this.btnNovoPedido) {
            this.btnNovoPedido.addEventListener('click', () => this.novoPedido());
        }
    }

    configurarDataMinima() {
        const dataEntrega = document.getElementById('dataEntregaPedido');
        if (!dataEntrega) return;

        const hoje = new Date();
        const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2);
        const iso = limite.toISOString().split('T')[0];
        dataEntrega.min = iso;
        dataEntrega.value = iso;
    }

    verificarProdutoPreSelecionado() {
        const params = new URLSearchParams(window.location.search);
        const produto = params.get('produto');
        if (produto && this.produtos[produto]) {
            setTimeout(() => this.selecionarProduto(produto), 60);
        }
    }

    selecionarProduto(tipo) {
        if (!this.produtos[tipo]) return;
        this.produtoAtual = tipo;

        document.querySelectorAll('.produto-item').forEach(item => item.classList.remove('selected'));
        const card = document.querySelector(`.produto-item[data-produto="${tipo}"]`);
        if (card) {
            card.classList.add('selected');
        }

        this.renderFormulario(tipo);
        // Após renderizar o formulário, tentar restaurar um rascunho salvo
        this.restoreDraftIfExists();
        this.mostrarSection();
        this.atualizarPreview();
        this.atualizarResumo();
    }

    mostrarSection() {
        if (!this.section) return;
        this.section.style.display = 'block';
        this.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (location.hash !== '#personalizacaoSection') {
            history.replaceState(null, '', '#personalizacaoSection');
        }
        const primeiroInput = this.section.querySelector('#opcoesProduto input');
        if (primeiroInput) {
            try { primeiroInput.focus({ preventScroll: true }); } catch (err) { primeiroInput.focus(); }
        }
    }

    renderFormulario(tipo) {
        if (!this.containerOpcoes) return;
        const html = this.getFormularioPorTipo(tipo);
        this.containerOpcoes.innerHTML = html;
        this.configurarEventosFormulario(tipo);
    }

    getFormularioPorTipo(tipo) {
        switch (tipo) {
            case 'bolo':
                return this.getFormularioBolo();
            case 'brigadeiro':
                return this.getFormularioBrigadeiro();
            case 'cookies':
                return this.getFormularioCookies();
            case 'sobremesa':
                return this.getFormularioSobremesa();
            case 'taca':
                return this.getFormularioTaca();
            case 'especial':
                return this.getFormularioEspecial();
            default:
                return '<p>Selecione um produto para personalizar.</p>';
        }
    }

    getFormularioBolo() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-birthday-cake"></i> Personalização do Bolo</h3>

                <div class="form-group">
                    <label>Tamanho do Bolo</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="tamanho" value="pequeno" checked>
                            <div class="opcao-nome">Pequeno</div>
                            <div class="opcao-preco">Serve 8 pessoas</div>
                        </div>
                        <div class="opcao-item" data-preco="20">
                            <input type="radio" name="tamanho" value="medio">
                            <div class="opcao-nome">Médio</div>
                            <div class="opcao-preco">+R$ 20,00 (Serve 15 pessoas)</div>
                        </div>
                        <div class="opcao-item" data-preco="40">
                            <input type="radio" name="tamanho" value="grande">
                            <div class="opcao-nome">Grande</div>
                            <div class="opcao-preco">+R$ 40,00 (Serve 25 pessoas)</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Sabor Principal</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="sabor" value="chocolate" checked>
                            <div class="opcao-nome">Chocolate</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="5">
                            <input type="radio" name="sabor" value="morango">
                            <div class="opcao-nome">Morango</div>
                            <div class="opcao-preco">+R$ 5,00</div>
                        </div>
                        <div class="opcao-item" data-preco="3">
                            <input type="radio" name="sabor" value="doceDeLeite">
                            <div class="opcao-nome">Doce de Leite</div>
                            <div class="opcao-preco">+R$ 3,00</div>
                        </div>
                        <div class="opcao-item" data-preco="2">
                            <input type="radio" name="sabor" value="limao">
                            <div class="opcao-nome">Limão</div>
                            <div class="opcao-preco">+R$ 2,00</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Opcionais</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item" data-preco="8">
                            <input type="checkbox" name="opcionais" value="recheio">
                            <div class="opcao-nome">Recheio Extra</div>
                            <div class="opcao-preco">+R$ 8,00</div>
                        </div>
                        <div class="opcao-item" data-preco="15">
                            <input type="checkbox" name="opcionais" value="decoracao">
                            <div class="opcao-nome">Decoração Especial</div>
                            <div class="opcao-preco">+R$ 15,00</div>
                        </div>
                        <div class="opcao-item" data-preco="5">
                            <input type="checkbox" name="opcionais" value="escrita">
                            <div class="opcao-nome">Escrita Personalizada</div>
                            <div class="opcao-preco">+R$ 5,00</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="mensagemBolo">Mensagem no Bolo</label>
                    <input type="text" id="mensagemBolo" placeholder="Ex: Feliz Aniversário João!">
                </div>

                <div class="form-group">
                    <label for="observacoesBolo">Instruções Especiais</label>
                    <textarea id="observacoesBolo" rows="3" placeholder="Cores preferidas, tema, alergias..."></textarea>
                </div>
            </div>
        `;
    }

    getFormularioBrigadeiro() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-candy-cane"></i> Personalização de Brigadeiros</h3>

                <div class="form-group">
                    <label>Quantidade</label>
                    <div class="quantidade-control">
                        <button type="button" class="quantidade-btn" data-control="diminuir" data-target="quantidadeBrigadeiro">-</button>
                        <span class="quantidade-display" id="quantidadeBrigadeiro" data-min="12">12</span>
                        <button type="button" class="quantidade-btn" data-control="aumentar" data-target="quantidadeBrigadeiro">+</button>
                    </div>
                    <small>Mínimo 12 unidades</small>
                </div>

                <div class="form-group">
                    <label>Sabores (escolha quantos quiser)</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="checkbox" name="sabores" value="tradicional" checked>
                            <div class="opcao-nome">Tradicional</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="0">
                            <input type="checkbox" name="sabores" value="beijinho">
                            <div class="opcao-nome">Beijinho</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="0.5">
                            <input type="checkbox" name="sabores" value="cajuzinho">
                            <div class="opcao-nome">Cajuzinho</div>
                            <div class="opcao-preco">+R$ 0,50 cada</div>
                        </div>
                        <div class="opcao-item" data-preco="1">
                            <input type="checkbox" name="sabores" value="ninho">
                            <div class="opcao-nome">Ninho</div>
                            <div class="opcao-preco">+R$ 1,00 cada</div>
                        </div>
                        <div class="opcao-item" data-preco="1.5">
                            <input type="checkbox" name="sabores" value="nutella">
                            <div class="opcao-nome">Nutella</div>
                            <div class="opcao-preco">+R$ 1,50 cada</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Embalagem</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="embalagem" value="simples" checked>
                            <div class="opcao-nome">Simples</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="8">
                            <input type="radio" name="embalagem" value="presenteavel">
                            <div class="opcao-nome">Presenteável</div>
                            <div class="opcao-preco">+R$ 8,00</div>
                        </div>
                        <div class="opcao-item" data-preco="15">
                            <input type="radio" name="embalagem" value="festa">
                            <div class="opcao-nome">Para Festa</div>
                            <div class="opcao-preco">+R$ 15,00</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFormularioCookies() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-cookie-bite"></i> Personalização de Cookies</h3>

                <div class="form-group">
                    <label>Quantidade</label>
                    <div class="quantidade-control">
                        <button type="button" class="quantidade-btn" data-control="diminuir" data-target="quantidadeCookies">-</button>
                        <span class="quantidade-display" id="quantidadeCookies" data-min="6">6</span>
                        <button type="button" class="quantidade-btn" data-control="aumentar" data-target="quantidadeCookies">+</button>
                    </div>
                    <small>Mínimo 6 unidades</small>
                </div>

                <div class="form-group">
                    <label>Sabor</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="sabor" value="chocolate" checked>
                            <div class="opcao-nome">Gotas de Chocolate</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="0">
                            <input type="radio" name="sabor" value="baunilha">
                            <div class="opcao-nome">Baunilha</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="0.5">
                            <input type="radio" name="sabor" value="aveia">
                            <div class="opcao-nome">Aveia e Canela</div>
                            <div class="opcao-preco">+R$ 0,50 cada</div>
                        </div>
                        <div class="opcao-item" data-preco="1">
                            <input type="radio" name="sabor" value="nuts">
                            <div class="opcao-nome">Nuts</div>
                            <div class="opcao-preco">+R$ 1,00 cada</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFormularioSobremesa() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-ice-cream"></i> Personalização da Sobremesa</h3>

                <div class="form-group">
                    <label>Tipo</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="tipo" value="mousse" checked>
                            <div class="opcao-nome">Mousse</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="2">
                            <input type="radio" name="tipo" value="pave">
                            <div class="opcao-nome">Pavê</div>
                            <div class="opcao-preco">+R$ 2,00</div>
                        </div>
                        <div class="opcao-item" data-preco="5">
                            <input type="radio" name="tipo" value="tiramisu">
                            <div class="opcao-nome">Tiramisù</div>
                            <div class="opcao-preco">+R$ 5,00</div>
                        </div>
                        <div class="opcao-item" data-preco="6">
                            <input type="radio" name="tipo" value="cheesecake">
                            <div class="opcao-nome">Cheesecake</div>
                            <div class="opcao-preco">+R$ 6,00</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Tamanho</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="tamanho" value="individual" checked>
                            <div class="opcao-nome">Individual</div>
                            <div class="opcao-preco">1 pessoa</div>
                        </div>
                        <div class="opcao-item" data-preco="12">
                            <input type="radio" name="tamanho" value="familia">
                            <div class="opcao-nome">Família</div>
                            <div class="opcao-preco">+R$ 12,00 (4-6 pessoas)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFormularioTaca() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-wine-glass"></i> Personalização da Taça</h3>

                <div class="form-group">
                    <label>Quantidade</label>
                    <div class="quantidade-control">
                        <button type="button" class="quantidade-btn" data-control="diminuir" data-target="quantidadeTaca">-</button>
                        <span class="quantidade-display" id="quantidadeTaca" data-min="1">1</span>
                        <button type="button" class="quantidade-btn" data-control="aumentar" data-target="quantidadeTaca">+</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Sabor</label>
                    <div class="opcoes-grid">
                        <div class="opcao-item selected" data-preco="0">
                            <input type="radio" name="sabor" value="frutas" checked>
                            <div class="opcao-nome">Frutas Vermelhas</div>
                            <div class="opcao-preco">Incluído</div>
                        </div>
                        <div class="opcao-item" data-preco="2">
                            <input type="radio" name="sabor" value="chocolate">
                            <div class="opcao-nome">Chocolate</div>
                            <div class="opcao-preco">+R$ 2,00</div>
                        </div>
                        <div class="opcao-item" data-preco="3">
                            <input type="radio" name="sabor" value="caramelo">
                            <div class="opcao-nome">Caramelo</div>
                            <div class="opcao-preco">+R$ 3,00</div>
                        </div>
                        <div class="opcao-item" data-preco="4">
                            <input type="radio" name="sabor" value="ninho">
                            <div class="opcao-nome">Ninho</div>
                            <div class="opcao-preco">+R$ 4,00</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFormularioEspecial() {
        return `
            <div class="form-section">
                <h3><i class="fas fa-heart"></i> Doce Especial Personalizado</h3>

                <div class="form-group">
                    <label for="descricaoEspecial">Descreva o que você deseja *</label>
                    <textarea id="descricaoEspecial" rows="4" placeholder="Conte todos os detalhes do doce dos sonhos" required></textarea>
                </div>

                <div class="form-group">
                    <label for="ocasiaoEspecial">Ocasião</label>
                    <select id="ocasiaoEspecial">
                        <option value="">Selecione...</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="casamento">Casamento</option>
                        <option value="batizado">Batizado</option>
                        <option value="formatura">Formatura</option>
                        <option value="corporativo">Evento corporativo</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="orcamentoEspecial">Orçamento aproximado</label>
                    <select id="orcamentoEspecial">
                        <option value="">Sem preferência</option>
                        <option value="100">Até R$ 100</option>
                        <option value="200">R$ 100 - R$ 200</option>
                        <option value="300">R$ 200 - R$ 300</option>
                        <option value="500">R$ 300 - R$ 500</option>
                        <option value="1000">Acima de R$ 500</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="referenciaEspecial">Referência visual (link opcional)</label>
                    <input type="url" id="referenciaEspecial" placeholder="Cole o link de uma imagem inspiracional">
                </div>
            </div>
        `;
    }

    configurarEventosFormulario(tipo) {
        if (!this.containerOpcoes) return;

        this.containerOpcoes.querySelectorAll('.opcao-item').forEach(item => {
            const input = item.querySelector('input');
            if (!input) return;

            item.addEventListener('click', (event) => {
                if (event.target === input) return;
                if (input.type === 'radio') {
                    this.containerOpcoes.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                        const pai = radio.closest('.opcao-item');
                        if (pai) pai.classList.remove('selected');
                    });
                    input.checked = true;
                    item.classList.add('selected');
                } else {
                    input.checked = !input.checked;
                    item.classList.toggle('selected', input.checked);
                }
                this.atualizarPreview();
                this.atualizarResumo();
            });

            input.addEventListener('change', () => {
                if (input.type === 'radio') {
                    this.containerOpcoes.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                        const pai = radio.closest('.opcao-item');
                        if (pai) pai.classList.toggle('selected', radio.checked);
                    });
                } else {
                    item.classList.toggle('selected', input.checked);
                }
                this.atualizarPreview();
                this.atualizarResumo();
            });
        });

        this.containerOpcoes.querySelectorAll('.quantidade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const display = this.containerOpcoes.querySelector(`#${targetId}`);
                if (!display) return;

                const minimo = parseInt(display.dataset.min || '1', 10);
                let valor = parseInt(display.textContent, 10) || minimo;
                if (btn.dataset.control === 'diminuir') {
                    valor = Math.max(minimo, valor - 1);
                } else {
                    valor += 1;
                }
                display.textContent = valor;
                this.atualizarPreview();
                this.atualizarResumo();
            });
        });

        this.containerOpcoes.querySelectorAll('input[type="text"], textarea, select').forEach(campo => {
            campo.addEventListener('input', () => {
                this.atualizarResumo();
                this.saveDraft();
            });
        });
        // Salvar rascunho também quando quantidade muda
        this.containerOpcoes.querySelectorAll('.quantidade-btn').forEach(btn => {
            btn.addEventListener('click', () => this.saveDraft());
        });
    }

    atualizarPreview() {
        if (!this.previewTitulo || !this.previewValor || !this.previewPrazo || !this.previewImagem) {
            return;
        }

        if (!this.produtoAtual) {
            this.previewTitulo.textContent = 'Selecione um produto';
            this.previewPrazo.textContent = 'Escolha uma opção';
            this.previewValor.textContent = this.formatarMoeda(0);
            if (this.previewImagemDefault) {
                this.previewImagem.src = this.previewImagemDefault;
            }
            this.previewImagem.alt = this.previewImagemDefaultAlt;
            return;
        }

        const produto = this.produtos[this.produtoAtual];
        if (!produto) {
            return;
        }

        this.previewTitulo.textContent = produto.nome;
        this.previewPrazo.textContent = produto.prazo;
        if (produto.imagem) {
            this.previewImagem.src = produto.imagem;
        }
        this.previewImagem.alt = produto.nome;

        const total = this.calcularTotal();
        this.previewValor.textContent = total > 0 ? this.formatarMoeda(total) : 'Sob consulta';
    }

    atualizarResumo() {
        if (!this.resumoLista) return;
        this.resumoLista.innerHTML = '';

        if (!this.produtoAtual) {
            const li = document.createElement('li');
            li.textContent = 'Nenhum item selecionado';
            this.resumoLista.appendChild(li);
            return;
        }

        const produto = this.produtos[this.produtoAtual];
        const resumo = [];
        resumo.push({ descricao: 'Produto', valor: produto.nome });

        const configuracoes = this.coletarConfiguracoes();
        Object.keys(configuracoes).forEach(chave => {
            const valor = configuracoes[chave];
            if (!valor || (Array.isArray(valor) && valor.length === 0)) return;

            const label = this.getLabelAmigavel(chave);
            if (Array.isArray(valor)) {
                resumo.push({ descricao: label, valor: valor.join(', ') });
            } else {
                resumo.push({ descricao: label, valor });
            }
        });

        const total = this.calcularTotal();
        resumo.push({ descricao: 'Total', valor: total > 0 ? this.formatarMoeda(total) : 'Sob consulta' });

        resumo.forEach(item => {
            const li = document.createElement('li');
            const spanDesc = document.createElement('span');
            spanDesc.textContent = item.descricao;
            const spanVal = document.createElement('span');
            spanVal.textContent = item.valor;
            li.appendChild(spanDesc);
            li.appendChild(spanVal);
            this.resumoLista.appendChild(li);
        });
    }

    getLabelAmigavel(chave) {
        const mapa = {
            tamanho: 'Tamanho',
            sabor: 'Sabor',
            sabores: 'Sabores',
            opcionais: 'Opcionais',
            embalagem: 'Embalagem',
            tipo: 'Tipo',
            quantidade: 'Quantidade',
            mensagemBolo: 'Mensagem',
            observacoesBolo: 'Instruções',
            descricaoEspecial: 'Descrição',
            referenciaEspecial: 'Referência',
            ocasiaoEspecial: 'Ocasião',
            orcamentoEspecial: 'Orçamento'
        };
        return mapa[chave] || chave.charAt(0).toUpperCase() + chave.slice(1);
    }

    coletarConfiguracoes() {
        const config = {};
        if (!this.containerOpcoes) return config;

        this.containerOpcoes.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            const nome = input.name;
            const item = input.closest('.opcao-item');
            const label = item?.querySelector('.opcao-nome')?.textContent?.trim() || input.value;
            config[nome] = label;
        });

        this.containerOpcoes.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            const nome = input.name || 'opcoes';
            const item = input.closest('.opcao-item');
            const label = item?.querySelector('.opcao-nome')?.textContent?.trim() || input.value;
            if (!config[nome]) config[nome] = [];
            config[nome].push(label);
        });

        const quantidade = this.containerOpcoes.querySelector('.quantidade-display');
        if (quantidade) {
            config.quantidade = `${quantidade.textContent.trim()} unidades`;
        }

        const camposTexto = [
            'mensagemBolo',
            'observacoesBolo',
            'descricaoEspecial',
            'referenciaEspecial',
            'ocasiaoEspecial',
            'orcamentoEspecial'
        ];

        camposTexto.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const valor = el.value.trim();
            if (!valor) return;
            config[id] = valor;
        });

        return config;
    }

    calcularTotal() {
        if (!this.produtoAtual) return 0;

        switch (this.produtoAtual) {
            case 'bolo':
                return this.calcularTotalBolo();
            case 'brigadeiro':
                return this.calcularTotalBrigadeiro();
            case 'cookies':
                return this.calcularTotalCookies();
            case 'sobremesa':
                return this.calcularTotalSobremesa();
            case 'taca':
                return this.calcularTotalTaca();
            case 'especial':
                return 0;
            default:
                return this.produtos[this.produtoAtual]?.base || 0;
        }
    }

    calcularTotalBolo() {
        let total = this.produtos.bolo.base;
        if (!this.containerOpcoes) return total;
        this.containerOpcoes.querySelectorAll('input:checked').forEach(input => {
            const item = input.closest('.opcao-item');
            const preco = parseFloat(item?.dataset.preco || '0');
            if (!Number.isNaN(preco)) total += preco;
        });
        return total;
    }

    calcularTotalBrigadeiro() {
        const produto = this.produtos.brigadeiro;
        if (!this.containerOpcoes) return produto.base * 12;

        const qtdEl = this.containerOpcoes.querySelector('#quantidadeBrigadeiro');
        const quantidade = parseInt(qtdEl?.textContent || '12', 10);
        let precoUnitario = produto.base;

        const sabores = this.containerOpcoes.querySelectorAll('input[name="sabores"]:checked');
        let adicionalSabores = 0;
        sabores.forEach(sabor => {
            const item = sabor.closest('.opcao-item');
            const preco = parseFloat(item?.dataset.preco || '0');
            if (!Number.isNaN(preco)) adicionalSabores += preco;
        });
        if (sabores.length > 0) {
            precoUnitario += adicionalSabores / sabores.length;
        }

        let total = precoUnitario * quantidade;

        const embalagem = this.containerOpcoes.querySelector('input[name="embalagem"]:checked');
        if (embalagem) {
            const precoEmb = parseFloat(embalagem.closest('.opcao-item')?.dataset.preco || '0');
            if (!Number.isNaN(precoEmb)) total += precoEmb;
        }

        return total;
    }

    calcularTotalCookies() {
        const produto = this.produtos.cookies;
        if (!this.containerOpcoes) return produto.base * 6;

        const qtdEl = this.containerOpcoes.querySelector('#quantidadeCookies');
        const quantidade = parseInt(qtdEl?.textContent || '6', 10);

        const sabor = this.containerOpcoes.querySelector('input[name="sabor"]:checked');
        const adicional = parseFloat(sabor?.closest('.opcao-item')?.dataset.preco || '0');

        const precoUnitario = produto.base + (Number.isNaN(adicional) ? 0 : adicional);
        return precoUnitario * quantidade;
    }

    calcularTotalSobremesa() {
        let total = this.produtos.sobremesa.base;
        if (!this.containerOpcoes) return total;

        ['tipo', 'tamanho'].forEach(nome => {
            const input = this.containerOpcoes.querySelector(`input[name="${nome}"]:checked`);
            const adicional = parseFloat(input?.closest('.opcao-item')?.dataset.preco || '0');
            if (!Number.isNaN(adicional)) total += adicional;
        });

        return total;
    }

    calcularTotalTaca() {
        const produto = this.produtos.taca;
        if (!this.containerOpcoes) return produto.base;

        const qtdEl = this.containerOpcoes.querySelector('#quantidadeTaca');
        const quantidade = parseInt(qtdEl?.textContent || '1', 10);

        const sabor = this.containerOpcoes.querySelector('input[name="sabor"]:checked');
        const adicional = parseFloat(sabor?.closest('.opcao-item')?.dataset.preco || '0');

        const precoUnitario = produto.base + (Number.isNaN(adicional) ? 0 : adicional);
        return precoUnitario * quantidade;
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    toggleEnderecoEntrega(tipo) {
        const grupo = document.getElementById('enderecoGroup');
        const campo = document.getElementById('enderecoEntregaPedido');
        if (!grupo || !campo) return;

        if (tipo === 'retirada') {
            grupo.style.display = 'none';
            campo.required = false;
        } else {
            grupo.style.display = 'block';
            campo.required = true;
        }
    }

    voltarSelecao() {
        if (this.section) {
            this.section.style.display = 'none';
        }
        document.querySelectorAll('.produto-item').forEach(item => item.classList.remove('selected'));
        this.produtoAtual = null;
        if (this.resumoLista) {
            this.resumoLista.innerHTML = '<li>Nenhum item selecionado</li>';
        }
        if (this.previewTitulo) this.previewTitulo.textContent = 'Selecione um produto';
        if (this.previewValor) this.previewValor.textContent = this.formatarMoeda(0);
        if (this.previewPrazo) this.previewPrazo.textContent = 'Escolha uma opção';
        if (this.previewImagem) {
            if (this.previewImagemDefault) {
                this.previewImagem.src = this.previewImagemDefault;
            }
            this.previewImagem.alt = this.previewImagemDefaultAlt;
        }
    }

    coletarDadosPedido() {
        const dados = {
            produto: this.produtoAtual,
            nomeProduto: this.produtos[this.produtoAtual]?.nome || '',
            configuracoes: this.coletarConfiguracoes(),
            cliente: {
                nome: document.getElementById('clienteNomePedido')?.value.trim() || '',
                telefone: document.getElementById('clientePhonePedido')?.value.trim() || '',
                email: document.getElementById('clienteEmailPedido')?.value.trim() || ''
            },
            entrega: {
                data: document.getElementById('dataEntregaPedido')?.value || '',
                hora: document.getElementById('horaEntregaPedido')?.value || '',
                tipo: document.querySelector('input[name="tipoEntrega"]:checked')?.value || 'entrega',
                endereco: document.getElementById('enderecoEntregaPedido')?.value.trim() || ''
            },
            observacoes: document.getElementById('observacoesPedido')?.value.trim() || '',
            valor: this.calcularTotal(),
            criadoEm: new Date().toISOString()
        };

        return dados;
    }

    validarDados(dados) {
        if (!dados.produto) {
            this.mostrarNotificacao('Selecione um produto para personalizar.', 'error');
            return false;
        }

        if (!dados.cliente.nome) {
            this.mostrarNotificacao('Informe seu nome.', 'error');
            return false;
        }

        if (!dados.cliente.telefone) {
            this.mostrarNotificacao('Informe um telefone para contato.', 'error');
            return false;
        }

        if (!dados.entrega.data) {
            this.mostrarNotificacao('Escolha a data de entrega.', 'error');
            return false;
        }

        if (dados.entrega.tipo === 'entrega' && !dados.entrega.endereco) {
            this.mostrarNotificacao('Preencha o endereço de entrega.', 'error');
            return false;
        }

        if (dados.produto === 'especial') {
            const descricao = dados.configuracoes.descricaoEspecial;
            if (!descricao) {
                this.mostrarNotificacao('Conte os detalhes do doce especial para montarmos o orçamento.', 'error');
                return false;
            }
        }

        return true;
    }

    salvarPedido(dados) {
        const chave = 'doceTermoPedidos';
        const pedidos = JSON.parse(localStorage.getItem(chave) || '[]');

        const id = Date.now().toString();
        dados.id = id;
        dados.numero = `PED-${id.slice(-6)}`;

        pedidos.unshift(dados);
        localStorage.setItem(chave, JSON.stringify(pedidos));
        this.ultimoPedido = dados;
        // Limpar rascunho ao salvar o pedido
        localStorage.removeItem('doceTermoDraftPedido');
    }

    criarMensagemWhatsApp(dados) {
        const linhas = [];
        linhas.push('🍰 *NOVO PEDIDO - Doce Termo*');
        linhas.push('');
        linhas.push(`📝 *Produto:* ${dados.nomeProduto}`);
        if (dados.numero) {
            linhas.push(`🔢 *Número:* ${dados.numero}`);
        }
        linhas.push(`👤 *Cliente:* ${dados.cliente.nome}`);
        linhas.push(`📞 *Telefone:* ${dados.cliente.telefone}`);
        if (dados.cliente.email) {
            linhas.push(`📧 *Email:* ${dados.cliente.email}`);
        }

        linhas.push('');
        linhas.push('*Personalizações:*');
        const configuracoes = this.coletarConfiguracoes();
        Object.keys(configuracoes).forEach(chave => {
            const valor = configuracoes[chave];
            if (!valor || (Array.isArray(valor) && valor.length === 0)) return;
            const label = this.getLabelAmigavel(chave);
            if (Array.isArray(valor)) {
                linhas.push(`• ${label}: ${valor.join(', ')}`);
            } else {
                linhas.push(`• ${label}: ${valor}`);
            }
        });

        linhas.push('');
        linhas.push(`📅 *Entrega:* ${dados.entrega.data} ${dados.entrega.hora ? `às ${dados.entrega.hora}` : ''}`.trim());
        linhas.push(`🚚 *Tipo:* ${dados.entrega.tipo === 'retirada' ? 'Retirada na loja' : 'Entrega no endereço'}`);
        if (dados.entrega.tipo === 'entrega' && dados.entrega.endereco) {
            linhas.push(`📍 *Endereço:* ${dados.entrega.endereco}`);
        }

        if (dados.observacoes) {
            linhas.push('');
            linhas.push(`💬 *Observações:* ${dados.observacoes}`);
        }

        if (dados.valor > 0) {
            linhas.push('');
            linhas.push(`💰 *Valor estimado:* ${this.formatarMoeda(dados.valor)}`);
        } else {
            linhas.push('');
            linhas.push('💰 *Valor:* Sob consulta');
        }

        linhas.push('');
        linhas.push('Obrigada por escolher a Doce Termo! 💜');
        return linhas.join('\n');
    }

    solicitarOrcamento() {
        const dados = this.coletarDadosPedido();
        if (!this.validarDados(dados)) return;

        const mensagem = this.criarMensagemWhatsApp(dados);
        const url = `https://wa.me/5511980927318?text=Quero%20saber%20sobre%20seus%20produtos...=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }

    finalizarPedido() {
        const dados = this.coletarDadosPedido();
        if (!this.validarDados(dados)) return;

        this.salvarPedido(dados);
        this.mostrarNotificacao('Pedido salvo com sucesso! Vamos entrar em contato para confirmar os detalhes.', 'success');
    }

    enviarWhatsApp() {
        if (!this.ultimoPedido) {
            this.mostrarNotificacao('Finalize um pedido antes de enviar pelo WhatsApp.', 'error');
            return;
        }
        const mensagem = this.criarMensagemWhatsApp(this.ultimoPedido);
        const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }

    novoPedido() {
        this.ultimoPedido = null;
        if (this.form) this.form.reset();
        if (this.containerOpcoes) this.containerOpcoes.innerHTML = '';
        this.voltarSelecao();
        this.mostrarNotificacao('Pronto! Pode iniciar um novo pedido.', 'info');
        // Remover rascunho ao iniciar novo pedido
        localStorage.removeItem('doceTermoDraftPedido');
    }

    // --- Rascunho: salvar e restaurar formulário para evitar perda acidental ---
    saveDraft() {
        try {
            const dados = this.coletarDadosPedido();
            localStorage.setItem('doceTermoDraftPedido', JSON.stringify(dados));
        } catch (err) {
            // não bloquear a experiência se ocorrer erro
            console.warn('Não foi possível salvar rascunho do pedido', err);
        }
    }

    loadDraft() {
        try {
            const raw = localStorage.getItem('doceTermoDraftPedido');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (err) {
            console.warn('Erro ao ler rascunho do pedido', err);
            return null;
        }
    }

    restoreDraftIfExists() {
        const draft = this.loadDraft();
        if (!draft) return;

        // Restaurar campos do cliente
        if (draft.cliente) {
            if (this.form) {
                const nome = this.form.querySelector('#clienteNomePedido');
                const tel = this.form.querySelector('#clientePhonePedido');
                const email = this.form.querySelector('#clienteEmailPedido');
                if (nome && draft.cliente.nome) nome.value = draft.cliente.nome;
                if (tel && draft.cliente.telefone) tel.value = draft.cliente.telefone;
                if (email && draft.cliente.email) email.value = draft.cliente.email;
            }
        }

        // Restaurar entrega
        if (draft.entrega) {
            const data = this.form?.querySelector('#dataEntregaPedido');
            const hora = this.form?.querySelector('#horaEntregaPedido');
            const tipo = draft.entrega.tipo;
            if (data && draft.entrega.data) data.value = draft.entrega.data;
            if (hora && draft.entrega.hora) hora.value = draft.entrega.hora;
            if (tipo) {
                const radio = document.querySelector(`input[name="tipoEntrega"][value="${tipo}"]`);
                if (radio) radio.checked = true;
                this.toggleEnderecoEntrega(tipo);
            }
            if (this.form && draft.entrega.endereco) {
                const endereco = this.form.querySelector('#enderecoEntregaPedido');
                if (endereco) endereco.value = draft.entrega.endereco;
            }
        }

        // Restaurar configurações do produto quando o formulário estiver presente
        if (draft.configuracoes && this.containerOpcoes) {
            const cfg = draft.configuracoes;
            Object.keys(cfg).forEach(chave => {
                const valor = cfg[chave];
                if (!valor) return;

                // Para arrays (checkboxes), marcar opções cujo texto combine
                if (Array.isArray(valor)) {
                    valor.forEach(v => {
                        this.containerOpcoes.querySelectorAll('.opcao-item').forEach(item => {
                            const nomeEl = item.querySelector('.opcao-nome');
                            const input = item.querySelector('input');
                            if (nomeEl && input && nomeEl.textContent.trim() === v) {
                                input.checked = true;
                                item.classList.add('selected');
                            }
                        });
                    });
                } else {
                    // Para radios ou textos, tentar encontrar opção que tenha mesmo texto
                    this.containerOpcoes.querySelectorAll('.opcao-item').forEach(item => {
                        const nomeEl = item.querySelector('.opcao-nome');
                        const input = item.querySelector('input');
                        if (nomeEl && input && nomeEl.textContent.trim() === valor) {
                            if (input.type === 'radio' || input.type === 'checkbox') {
                                input.checked = true;
                                item.classList.add('selected');
                            }
                        }
                    });

                    // Campos de texto específicos
                    const textFields = ['mensagemBolo','observacoesBolo','descricaoEspecial','referenciaEspecial','ocasiaoEspecial','orcamentoEspecial'];
                    if (textFields.includes(chave)) {
                        const el = document.getElementById(chave);
                        if (el) el.value = valor;
                    }
                }
            });

            // Restaurar quantidades se presentes
            const qtdMap = { 'quantidadeBrigadeiro':'quantidadeBrigadeiro', 'quantidadeCookies':'quantidadeCookies', 'quantidadeTaca':'quantidadeTaca' };
            Object.keys(qtdMap).forEach(id => {
                const display = this.containerOpcoes.querySelector(`#${id}`);
                if (display && draft.configuracoes.quantidade) {
                    // tenta extrair número
                    const m = draft.configuracoes.quantidade.match(/(\d+)/);
                    if (m) display.textContent = m[1];
                }
            });
        }

        // Atualizar preview/resumo após restaurar
        this.atualizarPreview();
        this.atualizarResumo();
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(mensagem, tipo);
        } else {
            alert(mensagem);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pedidoManager = new PedidoManager();
});