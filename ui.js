function UI() {

	this.elements = [];
}

UI.prototype.show = function(rom) {

	this.clear();
	
	this.rom = rom;
	
	this.show_header();
	this.show_trainer();
	this.show_prg();
	this.show_chr();
}

UI.prototype.clear = function(rom) {

	// Remove elements spawned previously + qtip elements
	this.elements.concat([].slice.call(document.querySelectorAll('.qtip'))).map(function(element) {
		element.parentNode.removeChild(element);
	});
	
	this.elements = [];
}

UI.prototype.append = function(element) {

	document.body.insertBefore(element, document.querySelector('#references'));
	this.elements.push(element);
}

UI.prototype.show_header = function() {

	var header_title = document.createElement('h2');
	header_title.innerHTML = 'Header (hover to see content)';
	this.append(header_title);
	
	var address = this.rom.addresses['header'];
	
	var header_section = document.createElement('section');
	header_section.setAttribute('class', 'header');

	this.header_block(0, 4, 'Constant bytes ("NES" in ascii)', header_section);
	this.header_block(4, 1, 'Number of 16 kB units of PRG ROM', header_section);
	this.header_block(5, 1, 'Number of 8 kB units of CHR ROM', header_section);
	this.header_block(6, 1, 'Flag 6', header_section);
	this.header_block(7, 1, 'Flag 7', header_section);
	this.header_block(8, 1, 'Number of 8 kB units of PRG RAM', header_section);
	this.header_block(9, 1, 'Flag 9', header_section);
	this.header_block(10, 1, 'Flag 10 (unofficial)', header_section);
	this.header_block(11, 5, 'Padding', header_section);
	
	this.append(header_section);
}

UI.prototype.header_block = function(address, size, comment, container) {

	var span = document.createElement('span');
	span.setAttribute('class', 'block');
	span.innerHTML = this.rom.data.slice(address, address + size).map(function(x) {
		return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
	}).join(' ');
	
	container.appendChild(span);
	
	$(span).qtip({
		content: {text: comment},
		style: {classes: 'qtip-tipsy'},
		position: {my: 'top left', at: 'bottom center'}
	});

	return span;
}

UI.prototype.show_trainer = function() {

	if (this.rom.has_trainer) {
	
		var trainer_title = document.createElement('h2');
		trainer_title.innerHTML = 'Trainer';
		this.append(trainer_title);
		
		var address = this.rom.addresses['trainer'];
		
		var trainer_section = document.createElement('section');
		trainer_section.setAttribute('class', 'trainer');
		
		var trainer = this.rom.data.slice(address, address+512).map(function(x) {
			return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
		}).join(' ');
		
		trainer_section.innerHTML = trainer;
		
		this.append(trainer_section);
	}
}

UI.prototype.show_prg = function() {

	for (var i = 0; i < this.rom.prg_rom_size; ++i) {
	
		var prg_title = document.createElement('h2');
		prg_title.innerHTML = 'PRG '+i;
		this.append(prg_title);
		
		var address = this.rom.addresses['prg'][i];
		
		var prg_section = document.createElement('section');
		prg_section.setAttribute('class', 'prg');
		
		var prg = this.rom.data.slice(address, address+16384).map(function(x) {
			return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
		}).join(' ');
		
		prg_section.innerHTML = prg;
		
		this.append(prg_section);
	}
}

UI.prototype.show_chr = function() {

	for (var i = 0; i < this.rom.chr_rom_size; ++i) {
	
		var chr_title = document.createElement('h2');
		chr_title.innerHTML = 'CHR ' + i + (i == 0 ? ' (hover to see tiles)' : '');
		this.append(chr_title);
		
		var address = this.rom.addresses['chr'][i];	
		
		var chr_section = document.createElement('section');
		chr_section.setAttribute('class', 'chr');
		
		for (var j = 0; j < 8192; j += 16) {
		
			var pattern_span = document.createElement('span');
			pattern_span.setAttribute('class', 'block');
			
			var pattern = this.rom.data.slice(address+j, address+j+16);
			
			pattern_span.innerHTML = pattern.map(function(x) {
				return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
			}).join(' ');
			
			chr_section.appendChild(pattern_span);
			
			var canvas = this.draw_pattern(pattern, 15);
			
			$(pattern_span).qtip({
				content: $(canvas),
				style: {classes: 'qtip-tipsy'},
				position: {my: 'left bottom', at: 'top right'}
			});
		}
		
		this.append(chr_section);
	}
}

UI.prototype.draw_pattern = function(pattern, scale) {

	scale = scale || 1;
	
	var pattern0 = pattern.slice(0, 8);
	var pattern1 = pattern.slice(8, 16);
	
	var canvas = document.createElement('canvas');
	canvas.width = 8 * scale;
	canvas.height = 8 * scale;
	canvas.setAttribute('id', 'a');
	
	var ctx = canvas.getContext('2d');
	
	for (var x = 0; x < 8; ++x) {
		for (var y = 0; y < 8; ++y) {
			
			var bit0 = (pattern0[y] >> (7-x)) & 1;
			var bit1 = (pattern1[y] >> (7-x)) & 1;
			var color = bit0 + (bit1 << 1);
			ctx.fillStyle = colors[color];
			
			ctx.fillRect(x * scale, y * scale, scale, scale);
		}
	}

	return canvas;
}

var colors = [
	'#FFFFFF',
	'#FF0000',
	'#00FF00',
	'#0000FF'
];