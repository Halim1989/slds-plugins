(function($)
{
	$.fn.slds_autocomplete=function(params)
	{

		//Les paramètres par défaut
		var defauts=
		{
			"source"	: [],
			"add_item" 	: null,
			"on_select"	: null
		};  

		//fusionner les deux objets
		var parameters = $.extend(defauts, params);

		return this.each(function()
		{
			var _this = $(this);
			jqxhr = null;
			$(this).keyup(function(){
				var q = $(this).val();
				if(parameters.source instanceof Array){
					var result = [];
					for (var i = 0; i < parameters.source.length; i++) {
						if(parameters.source[i].value.toUpperCase().indexOf(q.toUpperCase()) != -1){
							result.push(parameters.source[i]);
						}
					};
					refresh_template(result, _this);
				}
				else if(typeof parameters.source == 'string'){
					if(jqxhr != null){
						jqxhr.abort();
					}
					_this.addClass("slds_autocomplete_loading");
					jqxhr = jQuery.getJSON(parameters.source, {
						"q" : q
					}, function(data) {
						_this.removeClass("slds_autocomplete_loading");
						refresh_template(data, _this);
					});
				}
			});

			//	onclick -> verifier s il faut cacher l autocomplete
			$(document).click(event, function(){
				if(! $(event.target).is(_this)){
					if(_this.next().find(event.target).length == 0){
						_this.next().addClass("slds-hide");
					}
				}
				
			});

			$(this).after(init_list_template());
			$(this).before(init_selected_template(_this));
			if($(this).val() != ""){
				select(_this, $(this).attr("automcomplete-value"), $(this).val());
			}
		});

		function init_list_template(){
			var autocomplete_container = $("<div class='slds-lookup__menu slds-hide'>");
			var autocomplete_list = $("<ul class='slds-lookup__list'>");
			autocomplete_container.append(autocomplete_list);
			if(parameters.add_item != null){
				var autocomplete_add = $("<div class='slds-lookup__item'>");
				var autocomplete_add_btn = $("<button class='slds-button'>Add Account</button>");
				autocomplete_add.append(autocomplete_add_btn);
				autocomplete_container.append(autocomplete_add);
			}
			return autocomplete_container;
		}

		function init_selected_template(element){
			var selected_container = $("<div class='slds-pill_container slds-input-has-icon slds-input-has-icon--right slds-hide' style='padding: 1px; border: 1px solid #d8dde6; border-radius: .25rem; min-height: calc(2.125rem + 2px);'>");
			var selected_link = $("<a href='javascript:void(0);' class='slds-pill' style='width:100%'>");
			var selected_text = $("<span class='slds-pill__label slds-m-left--xx-small'>Pied Piper</span>");
			var selected_btn = $("<button class='slds-button slds-button--icon-bare slds-pill__remove' style='position: absolute; right: .75rem; top: 50%; margin-top: -.5rem;'>&#10006;</button>");
			selected_btn.bind("click", function(){
				unselect(element);
				return false;
			});
			selected_link.append(selected_text).append(selected_btn);
			selected_container.append(selected_link);
			return selected_container;
		}

		function refresh_template(result, element){
			var autocomplete_container = element.next();
			var autocomplete_list = autocomplete_container.find('ul');
			autocomplete_list.empty();
			if(result.length > 0){
				autocomplete_container.removeClass("slds-hide");
				for (var i = 0; i < result.length; i++) {
					var autocomplete_item = $("<li class='slds-lookup__item'>");
					var autocomplete_item_content = $("<a id='" + result[i].id + "' href='#''>" + result[i].value + "</a>");
					autocomplete_item_content.bind("click", function(){
						select(element, $(this).text(), $(this).attr("id"));
						return false;
					});
					autocomplete_item.append(autocomplete_item_content);
					autocomplete_list.append(autocomplete_item);
				};
			}
		}

		function select(element, value, id){
			element.hide();
			element.next().addClass("slds-hide");
			var selected_container = element.prev();
			selected_container.removeClass("slds-hide");
			var selected_span = selected_container.find('span.slds-pill__label');
			selected_span.text(value);
			element.val(id);
			element.attr("automcomplete-value", value);
			if(parameters.on_select){
				parameters.on_select({
					"id" : id,
					"value" : value
				});
			}
		}

		function unselect(element){
			element.show();
			element.val("");
			element.attr("automcomplete-value", "");
			element.prev().addClass("slds-hide");
		}


	};
})(jQuery);
