function Rom() {

	this.data = [];
}

Rom.prototype.load = function(data) {

	// Split data into a byte array
	
	for (var i = 0; i < data.length; i++) {
		this.data.push(data.charCodeAt(i));
	}
	
	//
	
	var pos = this.read_header();	
	pos = this.read_trainer(pos);	
	pos = this.read_prg(pos);	
	pos = this.read_chr(pos);
	this.read_title(pos);
};

Rom.prototype.read_header = function() {

	// Read header
	
	this.constant = this.data.slice(0, 4); console.log(this.constant);
	this.prg_rom_size = this.data[4]; console.log(this.prg_rom_size);
	this.chr_rom_size = this.data[5]; console.log(this.chr_rom_size);
	this.flag6 = this.data[6]; console.log(this.flag6);
	this.flag7 = this.data[7]; console.log(this.flag7);
	this.prg_ram_size = this.data[8]; console.log(this.prg_ram_size);
	this.flag9 = this.data[9]; console.log(this.flag9);
	this.flag10 = this.data[10]; console.log(this.flag10);
	
	// Parse flags
	
	this.has_sram = (this.flag6 & 1<<1) !== 0; console.log(this.has_sram);
	this.has_trainer = (this.flag6 & 1<<2) !== 0; console.log(this.has_trainer);
	this.has_playchoice = (this.flag7 & 1<<1) !== 0; console.log(this.has_playchoice);
	this.is_ntsc = (this.flag9 & 1) !== 0; console.log(this.is_ntsc);
	
	return 16;
};

Rom.prototype.read_trainer = function(pos) {

	var size = this.has_trainer ? 512 : 0;
	
	console.log(this.data.slice(pos, pos + size));

	return pos + size;
};

Rom.prototype.read_prg = function(pos) {
	
	var size = this.prg_rom_size * 16384;
	
	console.log(this.data.slice(pos, pos + size));

	return pos + size;
};

var colors = [
	[0, 0, 0],
	[50, 50, 50],
	[150, 150, 150],
	[250, 250, 250]
];
 
Rom.prototype.read_chr = function(pos) {

	var size = this.chr_rom_size * 8192;
	
	console.log(this.data.slice(pos, pos + size));

	for (var i = pos; i < pos + size; i += 16) {
	
		var canvas = document.createElement('canvas');
		canvas.width = 8;
		canvas.height = 8;
		document.body.appendChild(canvas);
		
		var ctx = canvas.getContext('2d');
		var pixels = ctx.createImageData(canvas.width, canvas.height);
		
		var pattern0 = this.data.slice(i, i+8);
		var pattern1 = this.data.slice(i+8, i+16);
		
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
	}
	
	return pos + size;
};

Rom.prototype.read_title = function(pos) {
	
	console.log(this.data.slice(pos, this.data.length));
	console.log(pos);
};
