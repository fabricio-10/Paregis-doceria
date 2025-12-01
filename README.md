# 🍰 Doce Termo - Site de Doceria

Um site moderno e atraente para uma doceria artesanal, desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 🎨 Design

- **Cores principais**: Tons de rosa (#ff6b9d) e roxo (#8b5cf6)
- **Estilo**: Moderno, clean e atraente
- **Tipografia**: Poppins (Google Fonts)
- **Ícones**: Font Awesome 6

## �️ Imagens

O site agora utiliza imagens de alta qualidade do Unsplash para uma aparência mais profissional e atraente. As imagens são carregadas usando a técnica de "lazy loading" para otimizar o desempenho.

### Funcionalidades
- **Imagens de Produtos**: Cada produto agora tem uma imagem representativa.
- **Lazy Loading**: As imagens são carregadas apenas quando aparecem na tela, economizando banda e acelerando o carregamento inicial da página.
- **Design Integrado**: As imagens são estilizadas para se encaixar perfeitamente no design do site.

## �🚀 Características

### Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu hambúrguer para dispositivos móveis
- Grid responsivo para produtos

### Animações
- Animações suaves de entrada
- Efeitos hover nos cards e botões
- Animação de bounce no hero
- Transições CSS3

### Funcionalidades
- Navegação suave entre seções
- Formulário de contato funcional
- Integração com WhatsApp para pedidos
- Sistema de notificações
- **Sistema completo de encomendas**
- **Gestão de status de pedidos**
- **Filtros e busca de encomendas**
- **Histórico detalhado de cada pedido**
- **Sistema de personalização de produtos**
- **Calculadora de preços automática**
- **Formulários específicos por produto**
- **Imagens de produtos com lazy loading**

### Seções
1. **Header** - Navegação fixa com logo
2. **Hero** - Seção principal com call-to-action
3. **Produtos** - Grid com os produtos da doceria
4. **Sobre** - Informações da empresa
5. **Contato** - Formulário e informações de contato
6. **Footer** - Informações finais
7. **Encomendas** - Sistema completo de gestão de pedidos (nova página)
8. **Fazer Pedido** - Sistema de personalização de produtos (nova página)

## 📁 Estrutura do Projeto

```
Doceria - Termo/
├── index.html          # Página principal
├── encomendas.html     # Página de gestão de encomendas
├── pedidos.html        # Página de personalização de pedidos
├── styles.css          # Estilos CSS principais
├── encomendas.css      # Estilos específicos para encomendas
├── pedidos.css         # Estilos específicos para pedidos
├── script.js           # JavaScript principal
├── encomendas.js       # JavaScript do sistema de encomendas
├── pedidos.js          # JavaScript do sistema de pedidos
└── README.md           # Este arquivo
```

## 🛠️ Como Usar

1. **Personalize as informações**:
   - Altere o nome da doceria no HTML
   - Modifique telefone, e-mail e endereço
   - Ajuste os produtos e preços

2. **Imagens**:
   - As imagens são do Unsplash. Para usar suas próprias imagens, substitua os links nos arquivos `index.html` e `pedidos.html`.
   - Para o lazy loading, mantenha o atributo `data-src` nas imagens da seção de produtos em `index.html`.

3. **Configure o WhatsApp**:
   - No arquivo `script.js`, linha 65, altere o número do WhatsApp
   - Formato: `5511999999999` (código do país + DDD + número)

4. **Personalize as cores** (opcional):
   - Edite as variáveis CSS no início do `styles.css`
   - Ajuste o `--primary-pink` e `--primary-purple`

## 📱 Integração WhatsApp

Os botões "Encomendar" redirecionam automaticamente para o WhatsApp com uma mensagem pré-formatada incluindo o nome do produto.

## 🎯 Produtos Incluídos

- **Bolos Artesanais** - A partir de R$ 45,00
- **Brigadeiros Gourmet** - R$ 3,50 cada
- **Cookies Artesanais** - R$ 2,50 cada
- **Sobremesas Geladas** - A partir de R$ 8,00
- **Taças Gourmet** - R$ 12,00 cada
- **Doces Especiais** - Sob consulta

## � Sistema de Encomendas

### Funcionalidades do Sistema
- **Criação de Encomendas**: Formulário completo com dados do cliente, produto e entrega
- **Gestão de Status**: Fluxo de status (Pendente → Confirmado → Produzindo → Pronto → Entregue)
- **Filtros Avançados**: Filtrar por status e buscar por número ou produto
- **Detalhes Completos**: Visualização detalhada de cada encomenda
- **Histórico**: Rastreamento completo de mudanças de status
- **Integração WhatsApp**: Contato direto com clientes
- **Armazenamento Local**: Dados salvos no navegador

### Como Usar o Sistema
1. **Criar Nova Encomenda**: Clique em "Nova Encomenda" e preencha o formulário
2. **Filtrar Encomendas**: Use os botões de filtro para ver encomendas por status
3. **Buscar**: Digite número do pedido ou nome do produto na busca
4. **Ver Detalhes**: Clique em "Detalhes" para ver informações completas
5. **Atualizar Status**: Use "Status" para avançar o pedido no fluxo
5. **Contatar Cliente**: Integração direta com WhatsApp

## 🛍️ Sistema de Pedidos Personalizados

### Funcionalidades do Sistema de Pedidos
- **Seleção Visual de Produtos**: Interface intuitiva para escolher produtos
- **Personalização Completa**: Formulários específicos para cada tipo de produto
- **Calculadora de Preços**: Atualização automática de preços conforme personalização
- **Preview em Tempo Real**: Visualização do pedido e resumo
- **Validação Inteligente**: Campos obrigatórios e validações específicas
- **Integração WhatsApp**: Envio direto do pedido formatado

### Produtos Disponíveis para Personalização

**🎂 Bolos Artesanais:**
- Tamanhos: Pequeno (8 pessoas), Médio (15 pessoas), Grande (25 pessoas)
- Sabores: Chocolate, Morango, Doce de Leite, Limão
- Opcionais: Recheio extra, Decoração especial, Escrita personalizada
- Personalização: Mensagem no bolo, cores, tema

**🍫 Brigadeiros Gourmet:**
- Quantidade: Mínimo 12 unidades (controlador de quantidade)
- Sabores: Tradicional, Beijinho, Cajuzinho, Ninho, Nutella
- Embalagens: Simples, Presenteável, Para Festa
- Seleção múltipla de sabores

**🍪 Cookies Artesanais:**
- Quantidade: Mínimo 6 unidades
- Sabores: Gotas de chocolate, Baunilha, Aveia e canela, Nuts
- Cálculo automático por unidade

**🍮 Sobremesas Geladas:**
- Tipos: Mousse, Pavê, Tiramisù, Cheesecake
- Tamanhos: Individual ou Família (4-6 pessoas)
- Preços diferenciados por tipo

**🥂 Taças Gourmet:**
- Quantidade personalizável
- Sabores: Frutas vermelhas, Chocolate, Caramelo, Ninho
- Apresentação elegante

**💖 Doces Especiais:**
- Descrição livre do produto desejado
- Seleção de ocasião (aniversário, casamento, etc.)
- Orçamento aproximado
- Campo para referência visual

### Como Funciona o Sistema de Pedidos

1. **Seleção**: Escolha o produto desejado na galeria visual
2. **Personalização**: Use os formulários específicos para customizar
3. **Preview**: Veja o resumo e preço em tempo real
4. **Dados**: Preencha informações de entrega e contato
5. **Confirmação**: Revise o pedido no modal de confirmação
6. **Finalização**: Envie via WhatsApp ou solicite orçamento

### Recursos Técnicos

**💰 Calculadora de Preços:**
- Preços base por produto
- Adicionais por personalização
- Taxa de entrega (grátis acima de R$ 100)
- Atualização em tempo real

**📅 Sistema de Datas:**
- Data mínima: 2 dias úteis
- Exclusão de finais de semana
- Horários de entrega pré-definidos

**📱 Responsividade Total:**
- Design adaptável para todos os dispositivos
- Interface touch-friendly
- Formulários otimizados para mobile

## � Melhorias Futuras

### Funcionalidades Sugeridas
- [x] Galeria de fotos dos produtos
- [ ] Sistema de carrinho de compras
- [ ] Blog com receitas
- [ ] Sistema de avaliações
- [ ] Integração com redes sociais
- [ ] Chat online
- [ ] Sistema de delivery

### SEO e Performance
- [ ] Adicionar meta tags otimizadas
- [ ] Implementar Schema.org
- [ ] Otimizar imagens
- [ ] Adicionar sitemap.xml
- [ ] Configurar Google Analytics

### Acessibilidade
- [ ] Melhorar contraste de cores
- [ ] Adicionar alt text nas imagens
- [ ] Navegação por teclado
- [ ] Screen reader compatibility

## 🌐 Redes Sociais

Configure os links das redes sociais no JavaScript:
- Instagram: `https://instagram.com/suadoceria`
- Facebook: `https://facebook.com/suadoceria`
- WhatsApp: `https://wa.me/5511999999999`

## 📞 Contato de Desenvolvimento

Para dúvidas sobre o código ou personalizações adicionais, entre em contato.

---

**Desenvolvido com 💜 para adoçar vidas!**