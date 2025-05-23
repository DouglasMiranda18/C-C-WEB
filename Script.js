// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeAnimations();
    initializePortfolioFilter();
    initializeContactForm();
});

// Inicialização da Navbar e Menu Mobile
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-button');

    // Toggle do menu mobile
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Event listeners
    mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Fecha o menu ao clicar em um link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Previne o fechamento ao clicar dentro do menu
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Ajusta a navbar ao rolar
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona classe quando rolar
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scroll para links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicialização das Animações
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Adiciona classe de animação aos elementos
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        el.classList.add('animate');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove a classe de animação e adiciona visible
                entry.target.classList.remove('animate');
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Inicialização do Filtro do Portfólio
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-card');

    // Mostra todos os itens inicialmente
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Atualiza botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtra os itens
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Inicialização do Formulário de Contato
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validação básica
        let isValid = true;
        let errorMessage = '';
        
        if (!data.name || data.name.trim().length < 2) {
            isValid = false;
            errorMessage = 'Por favor, insira um nome válido.';
        } else if (!data.email || !data.email.includes('@')) {
            isValid = false;
            errorMessage = 'Por favor, insira um e-mail válido.';
        } else if (!data.message || data.message.trim().length < 10) {
            isValid = false;
            errorMessage = 'Por favor, insira uma mensagem com pelo menos 10 caracteres.';
        }
        
        if (!isValid) {
            showFormMessage(errorMessage, 'error');
            return;
        }
        
        try {
            // Aqui você pode adicionar a lógica para enviar o formulário
            // Por exemplo, usando fetch para uma API
            
            // Simulando envio bem-sucedido
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            form.reset();
        } catch (error) {
            showFormMessage('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.', 'error');
        }
    });

    // Limpar erros ao digitar
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
}

// Funções auxiliares
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'Este campo é obrigatório');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value.trim())) {
            showError(input, 'Email inválido');
            isValid = false;
        }
    });

    return isValid;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showFormMessage(message, type) {
    const formMessage = document.querySelector('.form-message');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Efeito de hover nos cards
document.querySelectorAll('.glassmorphism').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
}); 
