document.addEventListener("DOMContentLoaded", () => {

    // --- FUNCIONALIDAD 1: Efecto de Máquina de Escribir para Títulos ---
    const titles = document.querySelectorAll('.proj-title');

    titles.forEach(title => {
        const text = title.innerText;
        title.innerText = '';
        title.style.opacity = 1;
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                title.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        setTimeout(typeWriter, 300);
    });

    // --- FUNCIONALIDAD 2: Scroll Reveal (Aparición al bajar) ---
    const revealElements = document.querySelectorAll('section, .design-text, .design-figure, .proj-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.classList.add('hidden');
        revealObserver.observe(el);
    });

    // Ensure team cards are visible immediately if present (they may be excluded from .hidden visually by CSS)
    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        teamGrid.classList.remove('hidden');
        teamGrid.querySelectorAll('.team-card').forEach(tc => tc.classList.remove('hidden'));
    }

    // --- FUNCIONALIDAD 3: Navbar Dinámico ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- FUNCIONALIDAD 4: Efecto TILT 3D para tarjetas ---
    const cards = document.querySelectorAll('.proj-card, .team-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xRotation = -((y - rect.height / 2) / 20);
            const yRotation = (x - rect.width / 2) / 20;
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
            card.style.transition = 'transform 0.1s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // =======================================================
    // FONDO DE ESTRELLAS INTERACTIVO (STARFIELD)
    // =======================================================
    const canvas = document.getElementById('starfield');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let width = 0, height = 0;
        let mouseX = 0, mouseY = 0;
        let vanishingPointX = 0, vanishingPointY = 0;

        const numStars = 800;
        const stars = [];
        const speed = 2;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            vanishingPointX = width / 2;
            vanishingPointY = height / 2;
        }

        class Star {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = (Math.random() * width - width / 2) * 2;
                this.y = (Math.random() * height - height / 2) * 2;
                this.z = initial ? Math.random() * width : width;
                this.size = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.z -= speed;
                if (this.z <= 0) {
                    this.reset();
                    this.z = width;
                }
            }
            draw() {
                const scale = width / this.z;
                const screenX = vanishingPointX + (this.x / this.z) * width + (mouseX * scale * 0.05);
                const screenY = vanishingPointY + (this.y / this.z) * height + (mouseY * scale * 0.05);
                const finalSize = this.size * scale * 0.2;
                ctx.beginPath();
                ctx.fillStyle = "rgba(255,255,255," + Math.max(0, Math.min(1, (1 - this.z / width))) + ")";
                ctx.arc(screenX, screenY, finalSize < 0 ? 0 : finalSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // init
        resizeCanvas();
        for (let i = 0; i < numStars; i++) stars.push(new Star());

        function animate() {
            // motion blur trail
            ctx.fillStyle = "rgba(0,0,0,0.33)";
            ctx.fillRect(0, 0, width, height);
            stars.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - width / 2;
            mouseY = e.clientY - height / 2;
        });

        // Respect prefers-reduced-motion: pause heavy animation
        const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!mediaReduce || !mediaReduce.matches) {
            animate();
        } else {
            // draw static stars once for reduced-motion preference
            ctx.fillStyle = '#000';
            ctx.fillRect(0,0,width,height);
            stars.forEach(s => s.draw());
        }
    }
});
