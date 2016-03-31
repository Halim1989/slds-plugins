(function($)
{
	$.fn.slds_datepicker=function(params)
	{

		//Les paramètres par défaut
		var defauts=
		{
			"format"		: "DD-MM-YYYY",
			"calendar_date" : moment().startOf('month'),
			"selected_day"  : null,
			"start_year"	: 2010,
			"end_year"		: 2020
		};  

		//fusionner les deux objets
		var parameters = $.extend(defauts, params);

		return this.each(function()
		{

			var _this = $(this);

			//	onfocus -> afficher le calendrier
			$(this).focus(function(){
				$(this).next().show();
			});

			//	onclick -> verifier s il faut cacher le calendrier ou pas
			$(document).click(event, function(){
				if(! $(event.target).is(_this)){
					if(_this.next().find(event.target).length == 0){
						_this.next().hide();
					}
				}
				
			});

			//	initilialiser le contenu html du calendrier
			$(this).after(init_template($(this)));

		});

		//	Rafraichir le calendrier
		function refresh(element){
			element.next().find("table").empty();
			var table = refresh_calendar(element);
			element.next().append(table);
			element.next().find('h2').text(parameters.calendar_date.format('MMMM'));
			element.next().find('select.years-select').val(parameters.calendar_date.format('YYYY'));
		}

		//	initialiser le contenu html du calendrier
		function init_template(element){
			var main_div = $("<div class='slds-datepicker slds-dropdown slds-dropdown--left slds-hide'>");
			var filter_div = $("<div class='slds-datepicker__filter slds-grid'>");
			var filter_div_month = $("<div class='slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow'>");
			var command_next_button = $("<div class='slds-align-middle'>");
			var command_previous_button = $("<div class='slds-align-middle'>");
			var month_text = $("<h2 class='slds-align-middle'>" + parameters.calendar_date.format('MMMM') + "</h2>");
			var next_button = $("<button class='slds-button slds-button--icon-container'>")
								.bind("click", function(){
									next_month(element);
									return false;
								});
			var next_icon = $("<span style='color:  rgb(84, 105, 141);font-size: 20px;'>&#9654;</span>");
			var previous_button = $("<button class='slds-button slds-button--icon-container'>")
								.bind("click", function(){
									previous_month(element);
									return false;
								});
			var previous_icon = $("<span style='color:  rgb(84, 105, 141);font-size: 20px;'>&#9664;</span>");

			var filter_div_year = $("<div class='slds-shrink-none'>");
			var filter_div_year_container = $("<div class='slds-select_container'>");

			var years_select = $("<select class='slds-select years-select'>")
								.bind("change", function(){
									set_year(element, $(this).val());
									return false;
								});
			for (var i = parameters.start_year; i <= parameters.end_year; i++) {
				years_select.append($("<option>" + i + "</option>"));
			}
			filter_div_year_container.append(years_select);

			main_div
				.append(filter_div
							.append(filter_div_month
										.append(command_previous_button
													.append(previous_button
														.append(previous_icon)))
										.append(month_text)
										.append(command_next_button
													.append(next_button
														.append(next_icon))))
							.append(filter_div_year
										.append(filter_div_year_container)));
			var table = refresh_calendar(element);
			main_div.append(table);
			return main_div;
		}

		//	Rafrachir le calendrier
		function refresh_calendar(element){
			var date = parameters.calendar_date.clone().startOf('month').day(0);
			var table = $("<table class='datepicker__month'>");
			table.append(init_week_days());
			var tbody = $("<tbody>");
			for (var i = 0; i < 5; i++) {
				var tr = jQuery("<tr>");
				for (var j = 0; j < 7; j++) {
					var td = jQuery("<td role='gridcell' aria-disabled='false'>");
					td.attr("headers", date.format('dddd'));
					td.bind( "click", function(){
						var day = jQuery(this).text();
						parameters.selected_day = parameters.calendar_date.clone().set('date', day);
						$(this).parent().parent().children().children().removeClass("slds-is-selected");
						$(this).addClass("slds-is-selected");
						element.val(parameters.selected_day.format(parameters.format));
						return false;
					});
					if(date.month() != parameters.calendar_date.month()){
						td.addClass("slds-disabled-text");
						td.attr("aria-disabled", "true");
					}
					if(date.format(parameters.format) == moment().format(parameters.format)){
						td.addClass("slds-is-today");
					}
					if(parameters.selected_day && date.format(parameters.format) == parameters.selected_day.format(parameters.format)){
						td.addClass("slds-is-selected");
					}
					var span = jQuery("<span class='slds-day'>");
					span.text(date.format('DD'));
					td.append(span);
					tr.append(td);
					date = date.add(1, 'd');
				};
				tbody.append(tr);
			};
			table.append(tbody);
			return table;
		}

		//	Initialiser les jours de la semaine
		function init_week_days(){
			var thead = $("<thead>");
			for (var i = 0; i < 7; i++) {
				var day_name = moment().day(i).format('dddd');
				var day_name_min = moment().day(i).format('ddd');
				var abbr = jQuery("<abbr>");
				abbr.attr("title", day_name);
				abbr.text(day_name_min);
				var th = jQuery('<th>');
				th.attr("id", day_name);
				th.append(abbr);
				thead.append(th);
			};
			return thead;
		}

		//	Passer au prochain mois
		function next_month(element){
			parameters.calendar_date.set('month', parameters.calendar_date.get('month') + 1);
			refresh(element);
		}

		//	Revenir au mois precedent
		function previous_month(element){
			parameters.calendar_date.set('month', parameters.calendar_date.get('month') - 1);
			refresh(element);
		}

		function set_year(element, val){
			parameters.calendar_date.set('year', val);
			refresh(element);
		}
	};
})(jQuery);
