'use strict';


let q = (selector, target) => ((target || document).querySelector(selector));
let qa = (selector, target) => ((target || document).querySelectorAll(selector));
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
        Page.Navigation.init();
        Page.Contact.init();
        Page.setupScrollTo();
        Page.showPhones();
        Page.showTitle();
        Page.ModalContact.init();
        Page.scrollOn();
        Page.scrollMenu();
        Page.menuOpen();
        Page.menuView();
        Page.initTel();
        Page.initGaButtons();

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
    scrollTo: function(hash, scrollTime, extraOffset) {
        var section = $(hash);

        if(section.length){
            var st = scrollTime || 1000, eo = extraOffset || 0;
            var offset = section.offset().top - eo;

            $('html, body').stop().animate({scrollTop: offset}, st);
        }
    },

    setupScrollTo: function () {
        let buttons = qa('.scroll-to');

        if (buttons) {
            buttons.forEach(button => {
                button.addEventListener('click', ev => {
                    ev.preventDefault();
                    let href = ev.target.getAttribute('href');
                    let nav = q('.nav');
                    let offset = (nav.offsetHeight);

                    history.replaceState(null, null, href);
                    this.scrollTo(href, false, offset);
                }, false);
            });
        }
    },

    showTitle: function () {
        var data = $('.navi-left .nav li a');
        var title = document.getElementById('title');
        var header = $('.information .header.initial');
        var content = $('.information .content');
        var logo =$('.information .imgs');
        var visi = $('.information');
        var hid = $('.navi-left');

        content.hide();

        data.click(function (){
            var dat = $(this).html();
            title.innerText = dat;
            header.addClass('active');
            logo.slideUp();
            content.hide();
            hid.addClass('active');
            visi.fadeIn(1400);
            visi.css('height','100%');
            hid.css('height','1250px');
            $('#content'+ $(this).attr("id")).show();
            if(data.hasClass('active')){
                data.removeClass('active');
                $(this).addClass('active');
            }else{
                $(this).addClass('active');
            }
        });

    },
    hideContent: function(){
        var hid = $('.navi-left');
        var visi = $('.information');
        hid.removeClass('active');
        visi.fadeOut(1400);

    },
    showPhones: function() {
        var viewP = $(".view-Phone")
            , phoneC = $(".phone-cont");
        viewP.on("click", function(e) {
            if (e.preventDefault(),
                viewP.hasClass("active"))
                phoneC.css("height", "0"),
                    viewP.removeClass("active");
            else {
                phoneC.css("height", "auto");
                viewP.addClass("active");
            }
        })
    },
    scrollOn: function(){
        $(document).ready(function(){

            var altura = 40;

            $(window).scroll(function(){

                if($(window).scrollTop() >= altura){

                    $(".navigation.prue .logo").addClass('active');
                }else{

                    $(".navigation.prue .logo").removeClass('active');
                }

            });

        });
    },
    scrollMenu: function(){
        $(document).ready(function(){

            var altura = 230;

            $(window).scroll(function(){

                if($(window).scrollTop() >= altura){

                    $('.navigation.prue .menu.list').fadeIn(1600);
                    $('.anchor').fadeOut(1400);
                }else{
                    $('.navigation.prue .menu.list').fadeOut(1600);
                    $('.anchor').fadeIn(1800);
                }

            });

        });
    },
    menuOpen: function(){
        var viewM = $(".localit .anchorlocal")
            , viewL = $(".listlocal")
            , viewA = $('.listlocal a');
        viewM.on("click", function(e) {
            if (e.preventDefault(),
                viewM.hasClass("active"))
                viewL.css({"height":"0",'opacity':'0'}),
                    viewM.removeClass("active"),
                    viewA.css('z-index','-1');
            else {
                viewL.css({"height":"auto",'opacity':'1'});
                viewM.addClass("active"),
                viewA.css('z-index','1');
            }
        })
    },
    menuView: function(){
        var viewM = $("#navl")
            , viewL = $(".navl ul")
            , viewA = $('.navl ul a');
        viewM.on("click", function(e) {
            if (e.preventDefault(),
                viewM.hasClass("active"))
                viewL.css({"height":"0",'opacity':'0'}),
                viewM.removeClass("active");
            else {
                viewL.css({"height":"auto",'opacity':'1'});
                viewM.addClass("active");
            }
        })
    },

    /**
     * Navigation.
     */
    Navigation: {
        /**
         * @type jQuery
         */
        $closeListBtn: null,

        /**
         * @type jQuery
         */
        $elem: null,

        /**
         * @type jQuery
         */
        $list: null,

        /**
         * @type jQuery
         */
        $toggleBtn: null,

        /**
         * Initialize page part.
         */
        init: function() {
            this.$elem = $('.navigation');

            if(this.$elem.length) {
                this.$listWrapper = this.$elem.find('.list-wrapper');
                this.$closeListBtn = this.$elem.find('.close-list-btn');
                this.$toggleBtn = this.$elem.find('.toggle-btn');

                this.toggleCollapsed = this.toggleCollapsed.bind(this);

                this.$closeListBtn.on('click', this.toggleCollapsed);
                this.$toggleBtn.on('click', this.toggleCollapsed);
            }
        },

        /**
         * Show or hide mobile navigation.
         */
        toggleCollapsed: function() {
            if (this.$listWrapper.hasClass('list-collapsed')) {
                this.$listWrapper.removeClass('list-collapsed');
                Page.$body.removeClass('no-scroll');
            } else {
                this.$listWrapper.addClass('list-collapsed');
                Page.$body.addClass('no-scroll');
            }
        }
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
                response.largeText.innerText = 'Tu mensaje se envió correctamente';
                response.normalText.innerText = 'En breve nos comunicaremos contigo';

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


(function (d) {
    'use strict';

    // Point to needed elements.
    var buttons = d.querySelectorAll('button[data-pl-modal-effect]');
    var dummyTemplate = d.querySelector('.dummy-template');

    // Create modal instance.
    var modal = new pl.Modal({ effectName: 'pl-effect-11' });


    // Attach handlers to modal events.
    modal.opening.add(function () { console.log('modal opening');
    });
    modal.closing.add(function () { console.log('modal closing');

    });
    modal.opened.add(function() { console.log('modal opened');
    });
    modal.closed.add(function() { console.log('modal closed');
    });

    // Change modal effect.
    [].forEach.call(buttons, function(but) {
        but.addEventListener('click', function (ev) {
            ev.preventDefault();
            var effect = but.dataset['plModalEffect'];

            modal.changeEffect(effect);
            modal.open(dummyTemplate);
        }, false);
    });

})(document);

$(Page.init);
