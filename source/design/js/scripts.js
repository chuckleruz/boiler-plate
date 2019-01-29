'use strict';

let Page;

Page = {

    /**
     * @type {jQuery}
     */
    $body: $('body'),

    /**
     * @type {jQuery}
     */
    $window: $(window),

    $button: $('#buttonx'),


    /**
     * Initialize page scripts.
     */
    init: function() {

        // Initialize page parts.
        Page.Contact.init();
        Page.initTel();
        Page.initGaButtons();
        Page.showContact();
        Page.hideContact();

        // Events
        Page.$window.on('load', function() { Page._onLoad(); });
        Page.$window.on('resize', function() { Page._onResize(); });
        Page.$window.on('scroll', function() { Page._onScroll(); });
        Page.$button.on('click', function() { Page.hideContent(); });
    },

    /**
     * Fires when the page is loaded.
     * @private
     */
    _onLoad: function() {  },

    /**
     * Fires when the page is resized.
     * @private
     */
    _onResize: function() {  },

    /**
     * Fires on scrolling.
     * @private
     */
    _onScroll: function() {  },

    /**
     * Send notification to Google Analytics.
     * @param {string} category
     * @param {string} action
     * @param {string} label
     * @return {[type]} [description]
     */
    ga: function(category, action, label) {
        if ("function" === typeof gtag
            && "string" === typeof category
            && "string" === typeof action) {
            var object = {
                hitType      : 'event',
                eventCategory: category,
                eventAction  : action,
                eventLabel   : label || ''
            };

            // Send to Google Analytics.
            gtag('event', category, object);

            // Print in console.
            if ("console" in window) {
                console.log(
                    'ga: [category: %s, action: %s, label: %s]',
                    object.eventCategory,
                    object.eventAction,
                    object.eventLabel
                );
            }
        }
    },

    initGaButtons: function () {
        var buttons = $('.ga-button');

        buttons.on('click', function (ev) {
            var button = $(this);

            Page.ga(
                button.data('category'),
                button.data('action'),
                button.data('label')
            );
        })
    },

    initTel: function () {
        var a = $('a[href*=tel]');

        a.on('click', function (ev) {
            var a = $(this);

            Page.ga('Teléfono','Marcar a', '');
        })
    },

    /**
     * Scroll to a section indicated by hash.
     * @param {string} hash
     * @param {number} scrollTime
     * @param {number} extraOffset
     */

    showContact: function(){
        var show = $('.block.contact');
        var clic = $('.block.contact .header');

        clic.click(function () {
           show.addClass('active');
        });
    },

    hideContact: function(){
        var hide = $('.block.contact');
        var clic = $('.close-list-btn');

        clic.click(function () {
            hide.removeClass('active');
        });
    },

    /**
     * Contact
     */
    Contact: {
        /**
         * @type jQuery
         */
        $form: null,

        /**
         * @type HTMLElement
         */
        formResponse: null,

        /**
         * Initialize page part.
         */
        init: function() {
            this.$form = $('.contact-form');

            if(this.$form.length) {
                let form  = new ContactForm(this.$form);

                // Initialize custom selects.
                this.initCustomSelect();

                this.handleSuccess    = this.handleSuccess.bind(this, form);
                this.handleError      = this.handleError.bind(this, form);
                this.handleBeforeSend = this.handleBeforeSend.bind(this, form);

                form.addHandler('success', this.handleSuccess);
                form.addHandler('error', this.handleError);
                form.addHandler('beforeSend', this.handleBeforeSend);

            }
        },

        /**
         * Get form message element.
         * @returns {HTMLElement}
         */
        getFormMessage: function () {
            if (!this.formResponse) {
                let template = `<div>
                                    <div class="icon"></div>            
                                    <div class="large-text"></div>
                                    <div class="small-text"></div>
                                </div>`;

                this.formResponse = document.createElement('div');

                this.formResponse.className = 'form-response';
                this.formResponse.innerHTML = template;

                // Points to elements where the text will be.
                this.formResponse.icon       = this.formResponse.querySelector('.icon');
                this.formResponse.largeText  = this.formResponse.querySelector('.large-text');
                this.formResponse.normalText = this.formResponse.querySelector('.small-text');

            }

            return this.formResponse;
        },

        /**
         * Handle success event.
         * @param form
         * @param res
         */
        handleSuccess: function (form, res) {
            console.log(res);
            let serverResponse = JSON.parse(res);
            let response = this.getFormMessage();

            if (serverResponse && serverResponse['success'] === true) {
                // Let close the window.
                form.letCloseWindow = true;

                response.icon.className = "icon success";
                response.largeText.innerText = 'Tu mensaje se envió correctamente.';
                response.normalText.innerText = 'En breve nos comunicaremos contigo.';

                this.removeMessage(form);

                // Reset custom selects
                let selects = form.$form.customSelects;
                for (let i = 0, el = null; el = selects[i], i < selects.length; i++) { el.reset(); }

                // Count as event in Google Analytics
                Page.ga(form.$form.data('category'), form.$form.data('action'), form.$form.data('label'));

            } else {
                this.handleError(form);
            }
        },

        /**
         * Handle error event.
         * @param form
         */
        handleError: function (form) {
            let response = this.getFormMessage();

            // Let close the window.
            form.letCloseWindow = true;

            response.icon.className = "icon error";
            response.largeText.innerText = 'Ocurrió un problema';
            response.normalText.innerText = 'Por favor intenta enviar tu mensaje nuevamente';

            this.removeMessage(form);

        },

        /**
         * Handle before send event.
         * @param form
         */
        handleBeforeSend: function (form) {
            let response = this.getFormMessage();

            response.icon.className = "icon loading";
            response.largeText.innerText = 'Enviando Mensaje';

            // Avoid close window.
            form.letCloseWindow = false;

            // Add element to DOM.
            form.$form.append(response);

            // Force browser to detect element styles.
            window.getComputedStyle(response).opacity;

            // Show element.
            response.className += ' displayed';
        },

        /**
         * Initialize custom select.
         */
        initCustomSelect: function () {
            let $selects = this.$form.find('.custom-select');

            this.$form.customSelects = [];

            $selects.each((i, select) => {
                let $select = $(select);
                let custom = new CustomSelect($select);

                this.$form.customSelects.push(custom);
            });
        },

        /**
         * Remove message from DOM.
         * @param {ContactForm|undefined} form
         */
        removeMessage: function (form) {
            let response = this.getFormMessage();
            let visibleTime = 3000;

            setTimeout(() => {

                // Hide element.
                response.className = response.className.replace(/\s?displayed/, '');

                // Rest form.
                if ("undefined" !== typeof form)
                    form.resetFormInputs();

                // Remove element.
                setTimeout(() => {
                    response.parentNode.removeChild(response);

                    // Reset last values
                    response.icon.className = "icon";
                    response.largeText.innerText = "";
                    response.normalText.innerText = "";

                }, 380)

            }, visibleTime);

        }
    },

    ModalContact: {
        /**
         * @type jQuery
         */
        $form: null,

        /**
         * @type HTMLElement
         */
        formResponse: null,

        /**
         * Initialize page part.
         */
        init: function() {
            this.$form = $('.modal-quote');

            if(this.$form.length) {
                let form  = new ContactForm(this.$form);

                // Initialize custom selects.
                this.initCustomSelect();

                this.handleSuccess    = this.handleSuccess.bind(this, form);
                this.handleError      = this.handleError.bind(this, form);
                this.handleBeforeSend = this.handleBeforeSend.bind(this, form);

                form.addHandler('success', this.handleSuccess);
                form.addHandler('error', this.handleError);
                form.addHandler('beforeSend', this.handleBeforeSend);

            }
        },

        /**
         * Get form message element.
         * @returns {HTMLElement}
         */
        getFormMessage: function () {
            if (!this.formResponse) {
                let template = `<div>
                                    <div class="icon"></div>            
                                    <div class="large-text"></div>
                                    <div class="small-text"></div>
                                </div>`;

                this.formResponse = document.createElement('div');

                this.formResponse.className = 'form-response';
                this.formResponse.innerHTML = template;

                // Points to elements where the text will be.
                this.formResponse.icon       = this.formResponse.querySelector('.icon');
                this.formResponse.largeText  = this.formResponse.querySelector('.large-text');
                this.formResponse.normalText = this.formResponse.querySelector('.small-text');

            }

            return this.formResponse;
        },

        /**
         * Handle success event.
         * @param form
         * @param res
         */
        handleSuccess: function (form, res) {
            console.log(res);
            let serverResponse = JSON.parse(res);
            let response = this.getFormMessage();

            if (serverResponse && serverResponse['success'] === true) {
                // Let close the window.
                form.letCloseWindow = true;

                response.icon.className = "icon success";
                response.largeText.innerText = 'Tu mensaje se envió correctamente';
                response.normalText.innerText = 'En breve nos comunicaremos contigo';

                this.removeMessage(form);

                // Reset custom selects
                let selects = form.$form.customSelects;
                for (let i = 0, el = null; el = selects[i], i < selects.length; i++) { el.reset(); }

                // Count as event in Google Analytics
                //Page.ga(form.$form.data('category'), form.$form.data('action'), form.$form.data('label'));

            } else {
                this.handleError(form);
            }
        },

        /**
         * Handle error event.
         * @param form
         */
        handleError: function (form) {
            let response = this.getFormMessage();

            // Let close the window.
            form.letCloseWindow = true;

            response.icon.className = "icon error";
            response.largeText.innerText = 'Ocurrió un problema';
            response.normalText.innerText = 'Por favor intenta enviar tu mensaje nuevamente';

            this.removeMessage(form);

            // Count as event in Google Analytics
            //Page.ga(form.$form.data('category'), form.$form.data('action'), 'Error');
        },

        /**
         * Handle before send event.
         * @param form
         */
        handleBeforeSend: function (form) {
            let response = this.getFormMessage();

            response.icon.className = "icon loading";
            response.largeText.innerText = 'Enviando Mensaje';

            // Avoid close window.
            form.letCloseWindow = false;

            // Add element to DOM.
            form.$form.append(response);

            // Force browser to detect element styles.
            window.getComputedStyle(response).opacity;

            // Show element.
            response.className += ' displayed';
        },

        /**
         * Initialize custom select.
         */
        initCustomSelect: function () {
            let $selects = this.$form.find('.custom-select');

            this.$form.customSelects = [];

            $selects.each((i, select) => {
                let $select = $(select);
                let custom = new CustomSelect($select);

                this.$form.customSelects.push(custom);
            });
        },

        /**
         * Remove message from DOM.
         * @param {ContactForm|undefined} form
         */
        removeMessage: function (form) {
            let response = this.getFormMessage();
            let visibleTime = 3000;

            setTimeout(() => {

                // Hide element.
                response.className = response.className.replace(/\s?displayed/, '');

                // Rest form.
                if ("undefined" !== typeof form)
                    form.resetFormInputs();

                // Remove element.
                setTimeout(() => {
                    response.parentNode.removeChild(response);

                    // Reset last values
                    response.icon.className = "icon";
                    response.largeText.innerText = "";
                    response.normalText.innerText = "";

                }, 380)

            }, visibleTime);

        }
    }

};
$(Page.init);
