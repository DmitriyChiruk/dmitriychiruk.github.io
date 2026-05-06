import { UIController } from './UIController.js';
import { DataLoader } from './DataLoader.js';
import { Renderer } from './Render.js';
import { Carousel } from './Carousel.js';
import { ContactForm } from './ContactForm.js';

document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UIController();
    const contactForm = new ContactForm();
    const dataLoader = new DataLoader('data/site.json');
    const renderer = new Renderer();

    if (window.location.protocol === 'file:') {
        console.error('[Portfolio] This page was opened via file://. Please run a local web server (e.g., Python http.server) or use GitHub Pages to avoid CORS/file protocol restrictions.');
    }
    
    try {
        const data = await dataLoader.fetchData();
        renderer.renderAll(data);

        const carousel = new Carousel();
    } catch (error) {
        console.error("Failed to load or render data:", error);
    }
});