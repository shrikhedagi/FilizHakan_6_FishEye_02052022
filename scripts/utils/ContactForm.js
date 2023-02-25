export default class ContactForm 
{    
    constructor(photographer) 
    {
        this.photographer = photographer;
        this.form = document.querySelector("form");
        this.dom = document.getElementById('contact-form');
        this.body = document.body;
        this.openFormBtn = document.getElementById('contact-button');
        this.mainWrapper = document.getElementById('main');
        this.formTitle = document.getElementById('modal-title');
        this.formCloseBtn = document.querySelector('.form-header__close');

        this.firstName = document.getElementById("firstName-input");
        this.lastName = document.getElementById("lastName-input");
        this.email = document.getElementById("email-input");
        this.message = document.getElementById("message-input");

        this.errorFirst = document.getElementById("first_error");
        this.errorLast = document.getElementById("last_error");
        this.errorEmail = document.getElementById("email_error");
        this.errorMessage = document.getElementById("message_error");
        
        this.modalOverlay = document.querySelector(".overlay");
        this.submitForm = document.getElementById('submit');
    } 
    hide() 
    {
        this.mainWrapper.setAttribute('aria-hidden', 'false');
        this.dom.setAttribute('aria-hidden', 'true');
        this.body.classList.remove('no-scroll');
        this.dom.style.display = 'none';
        this.openFormBtn.focus()
    }
    displayPhotographerName()
    {
        const displayName = document.getElementById('form-photographer-name');
        displayName.innerHTML = this.photographer.name;
    }
    show()
    {
        this.mainWrapper.setAttribute('aria-hidden', 'true');
        this.dom.setAttribute('aria-hidden', 'false');
        this.body.classList.add('no-scroll');
        this.dom.style.display = 'block';
        this.formCloseBtn.focus()
    }
    listenForSubmission()
    {
        this.submitForm.addEventListener('click', (event) => 
        {   
            
            event.stopPropagation();
            event.preventDefault();
            if(!this.validate()) 
            {
                return;
            }
            const payload = 
            {
                prenom: this.firstName.value,
                nom: this.lastName.value,
                email: this.email.value,
                message: this.message.value
            }
            console.log(payload);
            this.hide();
        });
    }

    // Events
    start()
    {   
        this.listenForSubmission(); // Close by submitting the contact form by clicking to "envoyer"

        // Launch Contact Form - Event (by button click)
        this.openFormBtn.addEventListener('click', () =>
        {
            this.show();
            this.displayPhotographerName();
        });
        
        // Close Contact Form - Event - Cross button in form
        this.formCloseBtn.addEventListener('click', event => 
        {
            event.stopPropagation();
            event.preventDefault();
            this.hide();
        });

        // Close Contact Form with "Escape" - Keydown (Accessibility)
        this.body.addEventListener('keydown', event => 
        {
        if (event.key === 'Escape')
        {
            event.stopPropagation();
            event.preventDefault();
            this.hide();
        }
        });

        // Focus on accessibility
        this.form.addEventListener("keyup", event =>
        {
            switch (event.key) 
            {
                case "Tab":
                    document.querySelector("#form-photographer-name").focus();
                    break;
                case "Escape":
                    this.hide();
                    break;
            }
        });

        // close Contact Form by clicking on 'main'
        this.modalOverlay.addEventListener("click", event => 
        {
        if (event.target === this.modalOverlay) 
        {
            event.stopPropagation();
            event.preventDefault();
            this.hide();
        }
        });
    }

    // Fields Validations
    validate() 
    {
        // Set variable error check to false
        let errorCheck = false;

        // FIRST NAME VALIDATION CHECK: 
        if ((this.firstName.value === '') || (this.firstName.value == null)) {
            this.errorFirst.innerHTML = 'First Name should not be empty';
            this.firstName.focus();
            this.firstName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else if (!this.firstName.value.match(/^[a-zA-Z-\s]+$/)) { // Add a new condition to alert the users of the non-validation of special caracters in his/her first name
            this.errorFirst.innerHTML = 'No special characters allowed';
            this.firstName.focus();
            this.firstName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else if ((this.firstName.value.length < 2) || (this.firstName.value.length > 20)) {
            this.errorFirst.innerHTML = "Length should minimum 2 characters";
            this.firstName.focus();
            this.firstName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else {
            this.errorFirst.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.firstName.style.border = '2px solid rgb(4, 198, 4)';

        }

        // LAST NAME VALIDATION CHECK: 
        if ((this.lastName.value === null) || (this.lastName.value === '')) {
            this.errorLast.innerHTML = 'Last Name should not be empty';
            this.lastName.focus();
            this.lastName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else if (!this.lastName.value.match(/^[a-zA-Z-\s]+$/)) { // Add a new condition to alert the users of the non-validation of special caracters in his/her last name
            this.errorLast.innerHTML = 'No special characters allowed';
            this.lastName.focus();
            this.lastName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else if ((this.lastName.value.length < 2) || (this.lastName.value.length > 20)) {
            this.errorLast.innerHTML = "Length should minimum 2 characters";
            this.lastName.focus();
            this.lastName.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else {
            this.errorLast.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.lastName.style.border = '2px solid rgb(4, 198, 4)';
        }

        // EMAIL ADDRESS VALIDATION CHECK: 
        if ((this.email.value === null) || (this.email.value === '')) {
            this.errorEmail.innerHTML = "Cannot be empty";
            this.email.focus();
            this.email.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else if ((!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email.value))) {
            this.errorEmail.innerHTML = 'Wrong format';
            this.email.focus();
            this.email.style.border = '2px solid #fe142f';

            errorCheck = true;
        } else {
            this.email.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.email.style.border = '2px solid rgb(4, 198, 4)';
        }

        // MESSAGE VALIDATION CHECK:
        if ((this.message.value === null) || (this.message.value === '')) {
            this.errorMessage.innerHTML = 'Cannot be empty';
            this.message.focus();
            this.message.style.border = '2px solid #fe142f';

            errorCheck= true;
    
        } else {
            this.errorMessage.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.message.style.border = '2px solid rgb(4, 198, 4)';
        }

        // VALIDATION CHECK : BLOCK SUBMIT & SHOW ERROR MESSAGES
        return !errorCheck;
    }

}

 



