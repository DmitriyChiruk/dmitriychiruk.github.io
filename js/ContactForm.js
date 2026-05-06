export class ContactForm {
    constructor() {
        this.nameInput = document.getElementById('Name');
        this.emailInput = document.getElementById('Email');
        this.subjectInput = document.getElementById('Subject');
        this.messageInput = document.getElementById('Message');
        this.sendBtn = document.getElementById('send_msg_btn');

        this.debounce_wait = 300; // ms

        if (this.sendBtn) {
            this.initEventListeners();
        }
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    initEventListeners() {
        const debouncedName = this.debounce(() => this.validateName(false), this.debounce_wait);
        const debouncedEmail = this.debounce(() => this.validateEmail(false), this.debounce_wait);
        const debouncedSubject = this.debounce(() => this.validateSubject(false), this.debounce_wait);
        const debouncedMessage = this.debounce(() => this.validateMessage(false), this.debounce_wait);

        this.nameInput.addEventListener('input', debouncedName);
        this.emailInput.addEventListener('input', debouncedEmail);
        this.subjectInput.addEventListener('input', debouncedSubject);
        this.messageInput.addEventListener('input', debouncedMessage);
        
        this.sendBtn.addEventListener('click', (e) => this.submitForm(e));
    }

    containsSpecialChars(str) {
        return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);
    }

    containsDigits(str) {
        return /\d/.test(str);
    }


    validateName(isSubmit = false) {
        const value = this.nameInput.value.trim();
        let isValid = true;
        let errorMsg = "";

        if (value.length === 0) {
            if (isSubmit) {
                isValid = false;
                errorMsg = "Please enter your name.";
            }
        } else if (this.containsSpecialChars(value) || this.containsDigits(value)) {
            isValid = false;
            errorMsg = "Use only letters in your name!";
        } else if (value[0] !== value[0].toUpperCase()) {
            isValid = false;
            errorMsg = "Respect yourself, type Your name starting with a capital letter!";
        } else if (value.split(" ").length > 2) {
            isValid = false;
            errorMsg = "Your first and last name would be enough)";
        }

        this.toggleError(this.nameInput, !isValid, errorMsg);
        return isValid;
    }

    validateEmail(isSubmit = false) {
        const value = this.emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let isValid = true;
        let errorMsg = "";

        if (value.length === 0) {
            if (isSubmit) {
                isValid = false;
                errorMsg = "Please enter your email address.";
            }
        } else if (!emailRegex.test(value)) {
            isValid = false;
            errorMsg = "Please enter a valid email address (e.g., name@example.com).";
        }

        this.toggleError(this.emailInput, !isValid, errorMsg);
        return isValid;
    }

    validateSubject(isSubmit = false) {
        const value = this.subjectInput.value.trim();
        let isValid = true;
        let errorMsg = "";

        if (value.length === 0 && isSubmit) {
            isValid = false;
            errorMsg = "Please enter a subject.";
        }
        
        this.toggleError(this.subjectInput, !isValid, errorMsg);
        return isValid;
    }

    validateMessage(isSubmit = false) {
        const value = this.messageInput.value.trim();
        let isValid = true;
        let errorMsg = "";

        if (value.length === 0 && isSubmit) {
            isValid = false;
            errorMsg = "Please enter your message.";
        }

        this.toggleError(this.messageInput, !isValid, errorMsg);
        return isValid;
    }

    toggleError(element, hasError, errorMsg = "") {
        let errorNode = element.nextElementSibling;
        
        if (!errorNode || !errorNode.classList.contains('error-text')) {
            errorNode = document.createElement('span');
            errorNode.className = 'error-text';
            element.parentNode.insertBefore(errorNode, element.nextSibling);
        }

        if (hasError) {
            element.classList.add("wronginput");
            errorNode.textContent = errorMsg;
            errorNode.classList.remove("hide");
            errorNode.classList.add("show");
        } else if (errorNode.classList.contains("show")) {
            element.classList.remove("wronginput");
            errorNode.classList.remove("show");
            errorNode.classList.add("hide");
            
            setTimeout(() => {
                if (errorNode.classList.contains("hide")) {
                    errorNode.classList.remove("hide");
                    errorNode.textContent = "";
                }
            }, 300);
        }
    }

    submitForm(e) {
        e.preventDefault();

        const isNameValid = this.validateName(true);
        const isEmailValid = this.validateEmail(true);
        const isSubjValid = this.validateSubject(true);
        const isMsgValid = this.validateMessage(true);

        if (isNameValid && isEmailValid && isSubjValid && isMsgValid) {
            alert("Message sent successfully! (This is a demo, no actual email will be sent.)");
            this.resetFields();
        } else {
            console.warn("Please fix the errors in the highlighted fields.");
        }
    }

    resetFields() {
        this.nameInput.value = "";
        this.emailInput.value = "";
        this.subjectInput.value = "";
        this.messageInput.value = "";
        
        [this.nameInput, this.emailInput, this.subjectInput, this.messageInput].forEach(input => {
            this.toggleError(input, false);
        });
    }
}