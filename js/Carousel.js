export class Carousel {
    constructor() {
        this.section = document.getElementById('certificates');
        this.carousel = document.getElementById('certificates_carousel');
        this.track = this.carousel?.querySelector('.carousel-track');
        this.wrapper = this.section?.querySelector('.carousel-wrapper');
        this.prevBtn = this.section?.querySelector('.carousel-btn.prev');
        this.nextBtn = this.section?.querySelector('.carousel-btn.next');

        if (!this.section || !this.carousel || !this.track) return;

        this.offset = 0;
        this.allowScroll = true;
        this.isDown = false;
        this.startX = 0;
        this.startOffset = 0;

        this.initCarouselEvents();
        this.initModalEvents();
    }

    initCarouselEvents() {
        // Left/Right buttons
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => { if (!this.allowScroll) return; this.offset -= this.scrollByAmount(); this.applyTransform(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => { if (!this.allowScroll) return; this.offset += this.scrollByAmount(); this.applyTransform(); });
        
        // Recalculate on resize
        window.addEventListener('resize', () => this.updateScrollMode());
        requestAnimationFrame(() => this.updateScrollMode());

        // Scroll with mouse wheel (horizontal)
        this.carousel.addEventListener('wheel', (e) => {
            if (!this.allowScroll) return;
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                this.offset += e.deltaX;
                this.applyTransform();
            }
        }, { passive: false });

        // Drag & Drop
        this.carousel.addEventListener('mousedown', (e) => this.startDrag(e.clientX));
        window.addEventListener('mousemove', (e) => this.moveDrag(e.clientX));
        window.addEventListener('mouseup', () => this.endDrag());
        
        this.carousel.addEventListener('touchstart', (e) => this.startDrag(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', (e) => this.moveDrag(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchend', () => this.endDrag());

        // Update scroll mode after all images are loaded
        this.track.querySelectorAll('img').forEach(imgEl => {
            if (imgEl.complete) return;
            imgEl.addEventListener('load', () => this.updateScrollMode(), { once: true });
        });
    }

    scrollByAmount() {
        const cards = this.track.querySelectorAll('.card');
        if (!cards.length) return 300;
        
        const rect = cards[0].getBoundingClientRect();
        let gap = 16;
        
        if (cards.length > 1) {
            const rect2 = cards[1].getBoundingClientRect();
            const computedGap = Math.round(rect2.left - rect.right);
            if (!isNaN(computedGap) && computedGap >= 0) gap = computedGap;
        }
        return rect.width + gap;
    }

    applyTransform() {
        if (!this.allowScroll) return;
        const maxOffset = Math.max(0, this.track.scrollWidth - this.carousel.clientWidth);
        this.offset = Math.max(0, Math.min(this.offset, maxOffset));
        this.track.style.transform = `translateX(${-this.offset}px)`;
    }

    updateScrollMode() {
        const needScroll = this.track.scrollWidth > this.carousel.clientWidth + 10;
        this.allowScroll = needScroll;
        this.wrapper?.classList.toggle('no-scroll', !needScroll);
        
        if (!needScroll) {
            this.offset = 0;
            this.track.style.transform = '';
        } else {
            this.applyTransform();
        }
    }

    startDrag(clientX) {
        if (!this.allowScroll) return;
        this.isDown = true;
        this.startX = clientX;
        this.startOffset = this.offset;
        this.carousel.classList.add('grabbing');
    }

    moveDrag(clientX) {
        if (!this.isDown || !this.allowScroll) return;
        const dx = clientX - this.startX;
        this.offset = this.startOffset - dx;
        this.applyTransform();
    }

    endDrag() {
        this.isDown = false;
        this.carousel.classList.remove('grabbing');
    }

    // Modal window related methods
    initModalEvents() {
        const closeBtn = document.getElementById('modal_close');
        const backdrop = this.section.querySelector('.modal-backdrop');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (backdrop) backdrop.addEventListener('click', () => this.closeModal());

        this.track.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            if (img && img.dataset.src) {
                this.openModal(img.dataset.src, img.dataset.title);
            }
        });
    }

    openModal(imgUrl, title) {
        const modal = document.getElementById('certificate_modal');
        const mimg = document.getElementById('modal_image');
        if (!modal || !mimg) return;

        mimg.src = imgUrl;
        mimg.alt = title || 'Certificate';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        this.onKey = (e) => { if (e.key === 'Escape') this.closeModal(); };
        window.addEventListener('keydown', this.onKey);
        
        this.onPop = () => this.closeModal();
        window.addEventListener('popstate', this.onPop);
        history.pushState({ certModal: true }, '');
    }

    closeModal() {
        const modal = document.getElementById('certificate_modal');
        if (!modal) return;

        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        if (this.onKey) { window.removeEventListener('keydown', this.onKey); this.onKey = null; }
        if (this.onPop) { window.removeEventListener('popstate', this.onPop); this.onPop = null; }
        if (history.state && history.state.certModal) {
            history.back();
        }
    }
}