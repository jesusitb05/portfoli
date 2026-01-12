document.addEventListener("DOMContentLoaded", () => {

    // --- FUNCIONALIDAD 1: Efecto de Máquina de Escribir para Títulos ---
    const titles = document.querySelectorAll('.proj-title');

    titles.forEach(title => {
        const text = title.innerText;
        title.innerText = ''; // Borramos el texto inicial
        title.style.opacity = 1; // Lo hacemos visible para empezar a escribir

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                title.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100); // Velocidad de escritura (ms)
            }
        }
        // Iniciamos con un pequeño retraso
        setTimeout(typeWriter, 500);
    });

    // --- FUNCIONALIDAD 2: Scroll Reveal (Aparición al bajar) ---
    // Seleccionamos todas las secciones y tarjetas que queremos animar
    const revealElements = document.querySelectorAll('section, .team-card, .design-text, .design-figure');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    });

    revealElements.forEach(el => {
        el.classList.add('hidden'); // Añadimos la clase oculta inicialmente
        revealObserver.observe(el);
    });

    // --- FUNCIONALIDAD 3: Navbar Dinámico ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
