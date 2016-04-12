function CorreiosRestriction(element) {
    'use-strict';

    this.constructor(element);
    this.init();
}

CorreiosRestriction.prototype.constructor = function (element) {
    this.element = element;
    this.service = '00000';
    this.origin = '70002900';
    this.destiny = '00000000';

    this.messageError = null;
};

CorreiosRestriction.prototype.init = function () {
    this.createMsgLocal();
    this.createMsgTooltip();
    this.toggleTooltip();
    this.setService();
    this.setOrigin();
    this.setDestiny();
    this.consult();
};

CorreiosRestriction.prototype.consult = function () {
    var self = this;

    jQuery.ajax({
        method: 'GET',
        url: '/correios-restriction/index/response',
        data: {
            service: this.service,
            origin: this.origin,
            destiny: this.destiny
        },
        dataType: 'xml',
        beforeSend: function () {
            self.setMsgLocal('Verificando...');
        },
        success: function (response) {
            var xmlResponse = jQuery(response);

            self.setMessageError(xmlResponse.find('MsgErro').text());

            if (!self.haveRestriction()) {
                self.setMsgLocal('Disponível');
                self.element.addClass('green');
                self.setMsgTooltip('Processamento com sucesso!');
            }
            else {
                self.setMsgLocal('Indisponível');
                self.element.addClass('red');
                self.setMsgTooltip(self.messageError);
            }

            console.log(self);
        }
    });
};

CorreiosRestriction.prototype.setService = function () {
    this.service = this.element.text().replace(/[^0-9]/g, '');
};

CorreiosRestriction.prototype.setOrigin = function () {
    this.origin = jQuery('.head-shipping-address').parents('.box-right').find('address').text().split('\n')[6].replace(/[^0-9]/g, '');
};

CorreiosRestriction.prototype.setDestiny = function () {
    this.destiny = jQuery('.head-shipping-address').parents('.box-right').find('address').text().split('\n')[6].replace(/[^0-9]/g, '');
};

CorreiosRestriction.prototype.setMessageError = function (txt) {
    this.messageError = txt;
};

CorreiosRestriction.prototype.haveRestriction = function () {
    $reply = false;

    if (this.messageError.length > 0) {
        return true;
    }

    return $reply;
};

CorreiosRestriction.prototype.createMsgLocal = function () {
    this.element.append('<span>');
};

CorreiosRestriction.prototype.setMsgLocal = function (txt) {
    this.element.find('span').text(' - ' + txt);
};

CorreiosRestriction.prototype.createMsgTooltip = function () {
    this.element.append('<div class="msg">');
};

CorreiosRestriction.prototype.setMsgTooltip = function (txt) {
    this.element.find('.msg').text(txt);
};

CorreiosRestriction.prototype.toggleTooltip = function () {
    this.element.parents('li').bind('mouseenter', function () {
        jQuery(this).find('.msg').addClass('active');
    });

    this.element.parents('li').bind('mouseleave', function () {
        jQuery(this).find('.msg').removeClass('active');
    })
};

setTimeout(function () {
    jQuery('#alterar-metodo').bind('click', function () {
        jQuery('#metodos ul li span a').each(function () {
            new CorreiosRestriction(jQuery(this));
        });
    });
}, 100);
