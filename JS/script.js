// === Script principal da página inicial: controla navegação, animações e interações ===

// --- Navegação mobile: abre/fecha menu hambúrguer ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// --- Fecha menu mobile ao clicar em qualquer link ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- Rolagem suave para âncoras internas ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Ajusta estilo do cabeçalho conforme rolagem ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// --- Botão CTA: rola até a seção de produtos, caso não tenha onclick próprio ---
const ctaBtn = document.querySelector('.cta-button');
if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        // Se o botão tem onclick inline, não fazer nada aqui
        if (ctaBtn.getAttribute('onclick')) {
            return;
        }
        const produtos = document.getElementById('produtos');
        if (produtos) {
            produtos.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// --- Formulário de contato: validação simples e feedback ---
const contatoForm = document.querySelector('.contato-form');
if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const nome = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const telefone = this.querySelector('input[type="tel"]').value;
        const mensagem = this.querySelector('textarea').value;
        
        // Simple validation
        if (!nome || !email || !mensagem) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        this.reset();
    });
}

// --- Botões de produto: redireciona ou cria encomenda rápida ---
document.querySelectorAll('.btn-produto').forEach(button => {
    button.addEventListener('click', function() {
        const produtoCard = this.closest('.produto-card');
        const produtoNome = produtoCard.querySelector('h3').textContent;
        
        // Verificar se estamos na página principal ou de encomendas
        if (window.location.pathname.includes('encomendas.html')) {
            // Se estivermos na página de encomendas, abrir modal
            if (window.encomendaManager) {
                const tipoMap = {
                    'Bolos Artesanais': 'bolo',
                    'Brigadeiros Gourmet': 'brigadeiro',
                    'Cookies Artesanais': 'cookies',
                    'Sobremesas Geladas': 'sobremesa',
                    'Taças Gourmet': 'taca',
                    'Doces Especiais': 'especial'
                };
                
                const tipo = tipoMap[produtoNome] || 'especial';
                adicionarEncomendaRapida(tipo, produtoNome);
            }
        } else {
            // Redirecionar para página de pedidos personalizados
            const tipoMap = {
                'Bolos Artesanais': 'bolo',
                'Brigadeiros Gourmet': 'brigadeiro',
                'Cookies Artesanais': 'cookies',
                'Sobremesas Geladas': 'sobremesa',
                'Taças Gourmet': 'taca',
                'Doces Especiais': 'especial'
            };
            
            const tipo = tipoMap[produtoNome] || 'especial';
            window.location.href = `pedidos.html?produto=${tipo}`;
        }
    });
});

// --- Conversor de nome para tipo usado nos scripts ---
function getTipoProduto(nomeProduto) {
    const tipoMap = {
        'Bolos Artesanais': 'bolo',
        'Brigadeiros Gourmet': 'brigadeiro',
        'Cookies Artesanais': 'cookies',
        'Sobremesas Geladas': 'sobremesa',
        'Taças Gourmet': 'taca',
        'Doces Especiais': 'especial'
    };
    return tipoMap[nomeProduto] || 'especial';
}

// --- Observador de interseção: ativa animações suaves ao rolar ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// --- Prepara elementos animados ao carregar o DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to animated elements
    const animatedElements = document.querySelectorAll('.produto-card, .diferencial, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// --- Sistema de notificações toast reutilizável ---
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// --- Links sociais: abre redes em nova aba ---
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className;
        
        let url = '';
        if (platform.includes('instagram')) {
            url = 'https://instagram.com/docetermo';
        } else if (platform.includes('facebook')) {
            url = 'https://facebook.com/docetermo';
        } else if (platform.includes('whatsapp')) {
            url = 'https://wa.me/5511999999999';
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    });
});

// --- Efeito parallax na imagem da hero ---
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const rate = scrolled * -0.5;
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// --- Animação incremental para contadores numéricos ---
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- Protótipo de carrinho local usando localStorage ---
let cart = JSON.parse(localStorage.getItem('doceTermoCart')) || [];

function addToCart(produto) {
    cart.push(produto);
    localStorage.setItem('doceTermoCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${produto.nome} adicionado ao carrinho!`, 'success');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// --- Atualiza contador do carrinho ao iniciar a página ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// --- Lazy loading para imagens com IntersectionObserver ---
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }
});

// --- Máscara simples para campos de telefone (formato BR) ---
function maskPhoneInput(input) {
    if (!input) return;
    input.addEventListener('input', () => {
        let v = input.value.replace(/\D/g, ''); // remove tudo que não é dígito
        if (v.length > 11) v = v.slice(0, 11);
        // Formata: (00) 00000-0000 ou (00) 0000-0000
        if (v.length > 10) {
            v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (v.length > 6) {
            v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (v.length > 2) {
            v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        input.value = v;
    });
}

// Aplica máscara a todos os inputs tipo telefone ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"], #clientePhone, #clientePhonePedido');
    phoneInputs.forEach(inp => maskPhoneInput(inp));

    // Validação simples adicional: impede envio do contato se telefone curto
    const contatoForm = document.querySelector('.contato-form');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            const tel = this.querySelector('input[type="tel"]')?.value.replace(/\D/g, '') || '';
            if (tel && tel.length < 10) {
                e.preventDefault();
                showNotification('Telefone inválido. Verifique o número informado.', 'error');
            }
        });
    }
});

// --- Utilitário de formatação monetária em BRL ---
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// --- Busca simples nos cards de produto ---
function searchProducts(query) {
    const products = document.querySelectorAll('.produto-card');
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// --- Pré-carregamento de imagens críticas (placeholder) ---
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical images
    const criticalImages = [
        // Add your critical image URLs here when you have them
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// --- Log informativo para auxiliar em depuração ---
console.log('🍰 Doce Termo - Site carregado com sucesso!');