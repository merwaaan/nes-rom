function UI(rom) {

	this.rom = rom;
	
	this.show_prg();
	this.show_chr();
}

UI.prototype.show_prg = function() {

}

UI.prototype.show_chr = function() {

	for (var i = 0; i < this.rom.chr_rom_size; ++i) {
	
		var address = this.rom.addresses['chr'][i];
		
		var chr_section = document.createElement('section');
		chr_section.setAttribute('class', 'chr');
		
		for (var j = 0; j < 8192; j += 16) {
		
			var pattern_span = document.createElement('span');
			pattern_span.setAttribute('class', 'pattern');
			
			var pattern = this.rom.data.slice(address+j, address+j+16);
			
			pattern_span.innerHTML = pattern.map(function(x) {
				return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
			}).join(' ');
			
			chr_section.appendChild(pattern_span);
			
			var canvas = document.createElement('canvas');
			canvas.width = 8;
			canvas.height = 8;
			canvas.setAttribute('id', 'a');
			
			var ctx = canvas.getContext('2d');
			var pixels = ctx.createImageData(canvas.width, canvas.height);
			
			var pattern0 = pattern.slice(0, 8);
			var pattern1 = pattern.slice(8, 16);
			
			for (var x = 0; x < 8; ++x) {
				for (var y = 0; y < 8; ++y) {
					var bit0 = (pattern0[y] >> (7-x)) & 1;
					var bit1 = (pattern1[y] >> (7-x)) & 1;
					var color = bit0 + (bit1 << 1);
					pixels.data[(x + y*8)*4] = colors[color][0];
					pixels.data[(x + y*8)*4 + 1] = colors[color][1];
					pixels.data[(x + y*8)*4 + 2] = colors[color][2];
					pixels.data[(x + y*8)*4 + 3] = 255;
				}
			}
			
			ctx.putImageData(pixels, 0, 0);

			$(pattern_span).qtip({
				content: $(canvas)
			});
		}
		
		document.body.appendChild(chr_section);
	}
}

var colors = [
	[0, 0, 0],
	[50, 50, 50],
	[150, 150, 150],
	[250, 250, 250]
];