(function($){
$.widget( "hb.slds_autocomplete", {

    // Default options.
    options: {
        source          : null,
        add_item        : null,
        add_item_text   : null
    },
 
    _create: function() {

        _this = this;

        //  Initialisation de l'autocomplete
        this._init_selected_template();
        this._init_list_template();

        //  onclick -> verifier s il faut cacher l autocomplete
        $(document).click(event, function(){
            if(! $(event.target).is(_this.element)){
                if(_this.element.next().find(event.target).length == 0){
                    _this.element.next().addClass("slds-hide");
                }
            }
        });
        
        jqxhr = null;
        this.element.keyup(function(){
            var q = $(this).val();
            if(_this.options.source != null){
                if(_this.options.source instanceof Array){
                    var result = [];
                    for (var i = 0; i < _this.options.source.length; i++) {
                        if(_this.options.source[i].value.toUpperCase().indexOf(q.toUpperCase()) != -1){
                            result.push(_this.options.source[i]);
                        }
                    };
                    _this._refresh_template(result);
                }
                else if(typeof _this.options.source == 'string'){
                    if(jqxhr != null){
                        jqxhr.abort();
                    }
                    _this.element.addClass("slds_autocomplete_loading");
                    jqxhr = jQuery.getJSON(_this.options.source, {
                        "q" : q
                    }, function(data) {
                        _this.element.removeClass("slds_autocomplete_loading");
                        _this._refresh_template(data);
                    });
                }
            }
        });

    },

    _setOption: function( key, value ) {
        this.options[ key ] = value;
    },

    _refresh_template : function(result){
        var autocomplete_container = this.element.next();
        var autocomplete_list = autocomplete_container.find('ul');
        autocomplete_list.empty();
        if(result.length > 0){
            autocomplete_container.removeClass("slds-hide");
            for (var i = 0; i < result.length; i++) {
                var autocomplete_item = $("<li class='slds-lookup__item'>");
                var autocomplete_item_content = $("<a id='" + result[i].id + "' href='#''>" + result[i].value + "</a>");
                var _this = this;
                autocomplete_item_content.bind("click", function(){
                    _this.select($(this).text(), $(this).attr("id"));
                    return false;
                });
                autocomplete_item.append(autocomplete_item_content);
                autocomplete_list.append(autocomplete_item);
            };
        }
    },

    _init_selected_template : function(){
        var selected_container = $("<div class='slds-pill_container slds-input-has-icon slds-input-has-icon--right slds-hide' style='padding: 1px; border: 1px solid #d8dde6; border-radius: .25rem; min-height: calc(2.125rem + 2px);'>");
        var selected_link = $("<a href='javascript:void(0);' class='slds-pill' style='width:100%'>");
        var selected_text = $("<span class='slds-pill__label slds-m-left--xx-small'>Pied Piper</span>");
        var selected_btn = $("<button class='slds-button slds-button--icon-bare slds-pill__remove' style='position: absolute; right: .75rem; top: 50%; margin-top: -.5rem;'>&#10006;</button>");
        var _this = this;
        selected_btn.bind("click", function(){
            _this.unselect();
            return false;
        });
        selected_link.append(selected_text).append(selected_btn);
        selected_container.append(selected_link);
        this.element.before(selected_container);
    },

    _init_list_template : function(){
        var autocomplete_container = $("<div class='slds-lookup__menu slds-hide'>");
        var autocomplete_list = $("<ul class='slds-lookup__list'>");
        autocomplete_container.append(autocomplete_list);
        if(this.options.add_item != null){
            var autocomplete_add = $("<div class='slds-lookup__item'>");
            var autocomplete_add_btn = $("<button class='slds-button'>" + this.options.add_item_text + "</button>");
            autocomplete_add.append(autocomplete_add_btn);
            autocomplete_container.append(autocomplete_add);
        }
        this.element.after(autocomplete_container);
    },

    select : function(value, id){
        this.element.hide();
        this.element.next().addClass("slds-hide");
        var selected_container = this.element.prev();
        selected_container.removeClass("slds-hide");
        var selected_span = selected_container.find('span.slds-pill__label');
        selected_span.text(value);
        this.element.val(id);
        this.element.attr("automcomplete-value", value);
        this._trigger( "on_select", null, { "id": id, "value": value } );
    },

    unselect : function(){
        this.element.show();
        this.element.val("");
        this.element.attr("automcomplete-value", "");
        this.element.prev().addClass("slds-hide");
        this._trigger( "on_unselect", null, null);
    }
 
});
})(jQuery)