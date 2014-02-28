function UI(rom) {

	this.rom = rom;
	
	this.show_header();
	this.show_trainer();
	this.show_prg();
	this.show_chr();
}

UI.prototype.show_header = function() {

	var header_title = document.createElement('h2');
	header_title.innerHTML = 'Header (hover to see content)';
	document.body.appendChild(header_title);
	
	var address = this.rom.addresses['header'];
	
	var header_section = document.createElement('section');
	header_section.setAttribute('class', 'header');

	this.header_block(0, 4, 'test', header_section);
	this.header_block(4, 1, 'test', header_section);
	this.header_block(5, 1, 'test', header_section);
	this.header_block(6, 1, 'test', header_section);
	this.header_block(7, 1, 'test', header_section);
	this.header_block(8, 1, 'test', header_section);
	this.header_block(9, 1, 'test', header_section);
	this.header_block(10, 1, 'test', header_section);
	this.header_block(11, 5, 'test', header_section);
	
	document.body.appendChild(header_section);
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
		position: {my: 'top center', at: 'bottom center'}
	});

	return span;
}

UI.prototype.show_trainer = function() {

	if (this.rom.has_trainer) {
	
		var trainer_title = document.createElement('h2');
		trainer_title.innerHTML = 'Trainer';
		document.body.appendChild(trainer_title);
		
		var address = this.rom.addresses['trainer'];
		
		var trainer_section = document.createElement('section');
		trainer_section.setAttribute('class', 'trainer');
		
		var trainer = this.rom.data.slice(address, address+512).map(function(x) {
			return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
		}).join(' ');
		
		trainer_section.innerHTML = trainer;
		
		document.body.appendChild(trainer_section);
	}
}

UI.prototype.show_prg = function() {

	for (var i = 0; i < this.rom.prg_rom_size; ++i) {
	
		var prg_title = document.createElement('h2');
		prg_title.innerHTML = 'PRG '+i;
		document.body.appendChild(prg_title);
		
		var address = this.rom.addresses['prg'][i];
		
		var prg_section = document.createElement('section');
		prg_section.setAttribute('class', 'prg');
		
		var prg = this.rom.data.slice(address, address+16384).map(function(x) {
			return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
		}).join(' ');
		
		prg_section.innerHTML = prg;
		
		document.body.appendChild(prg_section);
	}
}

UI.prototype.show_chr = function() {

	for (var i = 0; i < this.rom.chr_rom_size; ++i) {
	
		var chr_title = document.createElement('h2');
		chr_title.innerHTML = 'CHR ' + i + (i == 0 ? ' (hover to see tiles)' : '');
		document.body.appendChild(chr_title);
		
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
		
		document.body.appendChild(chr_section);
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