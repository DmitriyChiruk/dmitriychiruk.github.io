export class UIController {
    constructor() {
        this.minMobileWidth = 720;
        this.minMobileHeight = 500;
        this.isExpandedNavbar = false;
        this.previousScrollPosition = window.pageYOffset;

        this.backTop = document.querySelector('.go_top_btn');
        this.controls = document.querySelector('.controls');
        this.navbarLinks = document.querySelectorAll('.nav-bar-link');
        this.icon = document.getElementById("toggler_img");
        this.links = document.querySelector('.links');
        this.mainpages = document.querySelectorAll(".main_page");

        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());

        if (this.backTop) {
            this.backTop.addEventListener('click', () => {
                window.location.hash = '#greeting';
                this.navbarDefault();
            });
        }

        if (this.icon) {
            this.icon.addEventListener('click', () => this.toggleMobileNavbar());
        }

        this.navbarLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavbarClick(e.currentTarget));
        });

        this.mainpages.forEach(page => {
            page.addEventListener('click', () => {
                if (this.isExpandedNavbar) {
                    this.toggleMobileNavbar();
                }
            });
        });
    }

    handleScroll() {
        // Show "back to top" button after scrolling down 400px
        if (document.documentElement.scrollTop > 400) {
            this.backTop.style.visibility = "visible";
            this.backTop.style.opacity = "1";
        } else {
            this.backTop.style.visibility = "hidden";
            this.backTop.style.opacity = "0";
        }

        // Close menu on scroll
        if (this.isExpandedNavbar) {
            this.toggleMobileNavbar();
        }

        // Hide navbar on scroll down, show on scroll up (only for mobile)
        let controlsHeight = window.screen.height * 0.15;
        if (this.isMobileVersion()) {
            if (this.isScrollingDown()) {
                this.controls.style.top = "-70px";
            } else {
                this.controls.style.top = "0";
            }
        } else {
            this.controls.style.top = "0";
        }
    }

    navbarDefault() {
        // Reset all navbar links to default state
        this.navbarLinks.forEach(link => {
            link.className = "nav-bar-link";
        });
    }

    handleNavbarClick(elem) {
        this.navbarDefault();
        elem.className += " active";

        if (this.isExpandedNavbar) {
            this.toggleMobileNavbar();
        }
    }

    toggleMobileNavbar() {
        this.controls.classList.toggle("open");
        this.links.classList.toggle("open");

        if (this.isExpandedNavbar) {
            this.isExpandedNavbar = false;
            this.icon.src = "img/hamburger.svg";
        } else {
            this.isExpandedNavbar = true;
            this.icon.src = "img/cross.svg";
        }
    }

    isMobileVersion() {
        return (window.screen.width <= this.minMobileWidth || window.screen.height <= this.minMobileHeight);
    }

    isScrollingDown() {
        let goingDown = false;
        let scrollPosition = window.pageYOffset;

        if (scrollPosition > this.previousScrollPosition) {
            goingDown = true;
        }

        this.previousScrollPosition = scrollPosition;
        return goingDown;
    }
}