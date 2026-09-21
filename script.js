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
        width: width,
        height: height,
        size: 'stretch',
        minWidth: 280,
        maxWidth: 600,
        minHeight: 400,
        maxHeight: 800,
        maxShadowOpacity: 0.4,
        showCover: true,
        mobileScrollSupport: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // --- NOVA FUNÇÃO: Centraliza o livro dependendo da página ---
    function centerBook(pageIndex) {
        // No celular é sempre uma página por vez, não precisa deslizar
        if (pageFlip.getOrientation() === 'portrait') {
            bookElement.style.transform = 'translateX(0)';
            return;
        }

        const totalPages = pageFlip.getPageCount();

        if (pageIndex === 0) {
            // Capa (primeira página): move 25% para a esquerda para centralizar a banda direita
            bookElement.style.transform = 'translateX(-25%)';
        } else if (pageIndex === totalPages - 1) {
            // Contracapa (última página): move 25% para a direita para centralizar a banda esquerda
            bookElement.style.transform = 'translateX(25%)';
        } else {
            // Livro aberto (páginas internas): volta ao centro normal
            bookElement.style.transform = 'translateX(0)';
        }
    }

    // Inicialização
    pageFlip.on('init', () => {
        loadingState.style.display = 'none';
        bookElement.classList.remove('hidden');
        elPageTotal.textContent = pageFlip.getPageCount();
        
        const currentIndex = pageFlip.getCurrentPageIndex();
        updateButtons(currentIndex);
        centerBook(currentIndex); // Centraliza a capa assim que carregar
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