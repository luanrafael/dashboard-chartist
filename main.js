var $ = function (e) {
	return document.querySelector(e);
}

$$ = function (e) {
	return document.querySelectorAll(e);
} 

var Dashboard = function (){

	return {
		
		add: function (type, data) {

			var widget = this.create_widget();

			switch(type) {
				case 'line': {
					var chart = new Chartist.Line(widget, data);
					break;
				}
				case 'bar': {
					var chart = new Chartist.Bar(widget, data);
					break;
				}
				case 'pie': {
					var chart = new Chartist.Pie(widget, {series:[123,312,54,44]});
					break;
				}

			}
			
			chart.on('draw', function(context) {
				var value = Math.floor( Math.random() * 1000);
				console.log(value);
				console.log(context);
				console.log(context.type);
				if(context.type == 'label') {
					context.element.attr({
			    		style: 'stroke: #fff;'
			    	});
				} else if(['slice','grid'].indexOf(context.type) > -1) {
					return;
				} else {

				    context.element.attr({
				    	style: 'stroke: hsl(' + value + ', 90%, 50%);'
				    });
				}

			});

			this.append(widget);

		},

		create_widget: function () {

			var widget = document.createElement('div');
			widget.classList.add('widget');

			var remove_span = document.createElement('span');
			remove_span.classList.add('remove');
			widget.appendChild(remove_span);

			widget.setAttribute('id', "widget_" + Date.now());


			return widget;

		},

		append: function(widget) {
			$('.content').appendChild(widget);
			var id = widget.getAttribute('id');
			var selector = '#' + id + ' .remove';

			$(selector).addEventListener('click', function(){
				if(!confirm('Deseja realmente excluir o widget? ')) return;
				this.parentNode.remove();
			});
		}


	}

}

window.onload = function() {

	var data = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
		series: [
			[5, 2, 4, 2, 0]
	  	]
	};

	var dash = new Dashboard();


	$('.chart-form').addEventListener('submit', function(e){
		e.preventDefault();
		e.stopPropagation();
		var type = $('.chart-form #chart-type').value;
		dash.add(type, data);
	});

	refresh_events();

}

function refresh_events(){

	$$('.widget .remove').forEach(function(element) {
		element.addEventListener('click', function(){
			if(!confirm('Deseja realmente excluir o widget? ')) return;
			this.parentNode.remove()
		});
	});

}






