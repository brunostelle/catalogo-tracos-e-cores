document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
    } else {
        darkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function() {
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
    
    const bookElement = document.getElementById('book');
    const loadingState = document.getElementById('loading-state');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const elPageCurrent = document.getElementById('page-current');
    const elPageTotal = document.getElementById('page-total');

    bookElement.style.transition = 'transform 0.6s ease-in-out';

    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 320 : 450;
    const height = isMobile ? 480 : 600;

    const pageFlip = new St.PageFlip(bookElement, {
        width: width,
        height: height,
        size: 'stretch',
        minWidth: 200,
        maxWidth: 600,
        minHeight: 250,
        maxHeight: 800,
        maxShadowOpacity: 0.4,
        showCover: true,
        mobileScrollSupport: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('init', () => {
        loadingState.style.display = 'none';
        bookElement.classList.remove('hidden');
        elPageTotal.textContent = pageFlip.getPageCount();
        const currentIndex = pageFlip.getCurrentPageIndex();
        updateButtons(currentIndex);
        centerBook(currentIndex);
    });

    function centerBook(pageIndex) {
        if (pageFlip.getOrientation() === 'portrait') {
            bookElement.style.transform = 'translateX(0)';
            return;
        }

        const totalPages = pageFlip.getPageCount();

        if (pageIndex === 0) {
            bookElement.style.transform = 'translateX(-25%)';
        } else if (pageIndex === totalPages - 1) {
            bookElement.style.transform = 'translateX(25%)';
        } else {
            bookElement.style.transform = 'translateX(0)';
        }
    }

    pageFlip.on('init', () => {
        loadingState.style.display = 'none';
        bookElement.classList.remove('hidden');
        elPageTotal.textContent = pageFlip.getPageCount();
        const currentIndex = pageFlip.getCurrentPageIndex();
        updateButtons(currentIndex);
        centerBook(currentIndex);
    });

    pageFlip.on('flip', (e) => {
        const currentPage = e.data + 1;
        elPageCurrent.textContent = currentPage;
        
        updateButtons(e.data);
        centerBook(e.data); 
    });

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
