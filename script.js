document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DO MODO CLARO / ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    // Verifica a preferência salva ou a configuração de sistema do usuário
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
    } else {
        darkIcon.classList.remove('hidden');
    }

    // Ação de clique no botão
    themeToggleBtn.addEventListener('click', function() {
        // Troca os ícones
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');

        // Alterna as classes e salva na memória do navegador
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
    // --- FIM DA LÓGICA DO MODO ESCURO ---
    
    const bookElement = document.getElementById('book');
    const loadingState = document.getElementById('loading-state');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const elPageCurrent = document.getElementById('page-current');
    const elPageTotal = document.getElementById('page-total');

    // Suaviza o movimento de translação do livro (efeito de centralização)
    bookElement.style.transition = 'transform 0.6s ease-in-out';

    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 320 : 450;
    const height = isMobile ? 480 : 600;

    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,
        height: 600,
        size: 'stretch',   // Modo mais seguro, nunca bloqueia o carregamento
        minWidth: 200,
        maxWidth: 600,
        minHeight: 250,
        maxHeight: 800,
        maxShadowOpacity: 0.4,
        showCover: true,
        mobileScrollSupport: false
    });

    // Restauramos a forma simples e direta de carregar as páginas (sem setTimeouts complicados)
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('init', () => {
        document.getElementById('loading-state').style.display = 'none';
        bookElement.classList.remove('hidden');
        
        document.getElementById('page-total').textContent = pageFlip.getPageCount();
        const currentIndex = pageFlip.getCurrentPageIndex();
        updateButtons(currentIndex);

        requestAnimationFrame(() => {
            centerBook(currentIndex);
        });
    });

    // --- NOVA FUNÇÃO: Centraliza o livro dependendo da página ---
    function centerBook(pageIndex) {
        if (window.innerWidth < 768 || pageFlip.getOrientation() === 'portrait') {
            bookElement.style.transform = 'translateX(0px)';
            return;
        }

        const totalPages = pageFlip.getPageCount();
        const bounds = pageFlip.getBoundsRect();
        const shift = bounds.pageWidth / 2; // Medida exata de meia página no monitor atual

        if (pageIndex === 0) {
            // Centraliza a capa frontal
            bookElement.style.transform = `translateX(-${shift}px)`;
        } else if (pageIndex === totalPages - 1 && totalPages % 2 === 0) {
            // Centraliza a contracapa
            bookElement.style.transform = `translateX(${shift}px)`;
        } else {
            // Livro aberto no meio da tela
            bookElement.style.transform = 'translateX(0px)';
        }
    }

    // Recalcula o centro automaticamente se o utilizador redimensionar a janela ou mudar de monitor
    window.addEventListener('resize', () => {
        setTimeout(() => {
            centerBook(pageFlip.getCurrentPageIndex());
        }, 100);
    });

    // Inicialização
    pageFlip.on('init', () => {
        loadingState.style.display = 'none';
        bookElement.classList.remove('hidden'); // Remove o hidden original
        elPageTotal.textContent = pageFlip.getPageCount();
        const currentIndex = pageFlip.getCurrentPageIndex();
        updateButtons(currentIndex);
        centerBook(currentIndex);
    });

    // Evento disparado sempre que a página vira
    pageFlip.on('flip', (e) => {
        const currentPage = e.data + 1;
        elPageCurrent.textContent = currentPage;
        
        updateButtons(e.data);
        centerBook(e.data); // Desliza o livro se chegar nas pontas
    });

    // Recalcula o centro se o usuário redimensionar a janela do navegador
    window.addEventListener('resize', () => {
        centerBook(pageFlip.getCurrentPageIndex());
    });

    function updateButtons(pageIndex) {
        btnPrev.disabled = pageIndex === 0;
        btnNext.disabled = pageIndex === pageFlip.getPageCount() - 1;
    }

    btnPrev.addEventListener('click', () => pageFlip.flipPrev());
    btnNext.addEventListener('click', () => pageFlip.flipNext());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') pageFlip.flipNext();
        else if (e.key === 'ArrowLeft') pageFlip.flipPrev();
    });

    window.flipToPage = function(pageIndexZeroBased) {
        pageFlip.flip(pageIndexZeroBased);
    };
});
