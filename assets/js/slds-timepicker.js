(function($)
{
	$.fn.slds_timepicker=function(parametres)
	{
		return this.each(function()
		{
			var _this = $(this);

			$(this).focus(function(){
				$(this).next().removeClass("slds-hide");
			});

			$(document).click(event, function(){
				if(! $(event.target).is(_this)){
					if(_this.next().find(event.target).length == 0){
						_this.next().addClass("slds-hide");
					}
				}
			});

			$(this).change(function(){
				console.log("change");
			});

			init(this);

		});

		function init(element){
			var ul = $("<ul class='slds-datepicker--time__list' style='height:200px; overflow-y:scroll'>");
			for (var i = 0; i < 24; i++) {
				var li = $("<li aria-selected='false'>");
				var time = format_time(i)
				li.text(time);
				if($(element).val() == time){
					li.css("background-color", "#005fb2").css("color", "white");
				}
				li.bind("click", function(){
					var time = $(this).text();
					$(element).val(time);
					$(this).parent().children().removeAttr("style");
					$(this).css("background-color", "#005fb2").css("color", "white");
					return false;
				});
				ul.append(li);
			};
			var div = $("<div class='slds-dropdown slds-dropdown--left slds-hide'>");
			div.append(ul);
			$(element).after(div);
		}

		function format_time(i){
			var time = i;
			if(i < 10){
				time = '0' + i;
			}
			time += ':00';
			return time;
		}
	};
})(jQuery);
