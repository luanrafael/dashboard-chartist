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
			widget.setAttribute('draggable', true);

			return widget;

		},

		append: function(widget) {
			$('.content').appendChild(widget);
			var id = widget.getAttribute('id');
			var selector = '#' + id + ' .remove';

			add_click($(selector));
			allow_drag_drop($('#' + id));
			
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
		add_click(element);
	});

}

function add_click(element) {
	element.addEventListener('click', remove_widget, false);
}

function allow_drag_drop (element) {
	element.addEventListener('dragstart', handleDragStart, false);
  	element.addEventListener('dragenter', handleDragEnter, false);
	element.addEventListener('dragover', handleDragOver, false);
	element.addEventListener('dragleave', handleDragLeave, false);
	element.addEventListener('drop', handleDrop, false);
	element.addEventListener('dragend', handleDragEnd, false);
}

function remove_widget(){
	if(!confirm('Deseja realmente excluir o widget? ')) return;
	this.parentNode.remove()
}

var dragSrcEl;

function handleDragStart(e) {
	this.style.opacity = '0.4';  // this / e.target is the source node.

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	this.style.opacity = '1';
	return false;
}

function handleDragEnter(e) {
	e.dataTransfer.dropEffect = 'move';
	this.classList.add('over');
}

function handleDragLeave(e) {
	this.classList.remove('over');
}

function handleDrop(e) {
	
	if (e.stopPropagation) {
		e.stopPropagation();
  	}

	if (dragSrcEl != this) {
		dragSrcEl.innerHTML = this.innerHTML;
	    this.innerHTML = e.dataTransfer.getData('text/html');
	}

  	return false;
}

function handleDragEnd(e) {
	[].forEach.call($$('.widget'), function (col) {
		col.classList.remove('over');
  	});
}