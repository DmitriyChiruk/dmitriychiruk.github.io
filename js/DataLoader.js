export class DataLoader {
    constructor(url) {
        this.url = url;
    }

    async fetchData() {
        try {
            const response = await fetch(this.url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to load site json data:', error);
            throw error;
        }
    }
}