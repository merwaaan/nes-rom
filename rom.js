var ROM = (function() {

  'use strict';

  var _buffer = null;

  return {

    data: {},

    load: function(buffer) {

      _buffer = new Uint8Array(buffer);

      // Read

      var pos = this.read_header();
      pos = this.read_trainer(pos);
      pos = this.read_prg(pos);
      pos = this.read_chr(pos);
      this.read_title(pos);
    },

    read_header: function() {

      var header = this.data['header'] = {
        address: 0,
        content: _buffer.subarray(0, 16)
      };

      this.constant = header.content.subarray(0, 4);
      this.prg_rom_size = header.content[4];
      this.chr_rom_size = header.content[5];
      this.flag6 = header.content[6];
      this.flag7 = header.content[7];
      this.prg_ram_size = header.content[8];
      this.flag9 = header.content[9];
      this.flag10 = header.content[10];

      // Parse flags

      this.has_sram = (this.flag6 & 1<<1) !== 0;
      this.has_trainer = (this.flag6 & 1<<2) !== 0;
      this.has_playchoice = (this.flag7 & 1<<1) !== 0;
      this.is_ntsc = (this.flag9 & 1) !== 0;

      return 16;
    },

    read_trainer: function(pos) {

      if (this.has_trainer)
        this.data['trainer'] = {
          address: pos,
          content: _buffer.subarray(pos, pos + 512)
        };

      return pos + (this.has_trainer ? 512 : 0);
    },

    read_prg: function(pos) {

      this.data['prg'] = [];

      for (var i = 0; i < this.prg_rom_size; ++i)
        this.data['prg'][i] = {
          address: pos + i * 16384,
          content: _buffer.subarray(pos + i * 16384, pos + (i + 1) * 16384)
        };

      return pos + this.prg_rom_size * 16384;
    },

    read_chr: function(pos) {

      this.data['chr'] = [];

      for (var i = 0; i < this.chr_rom_size; ++i)
        this.data['chr'][i] = {
          address: pos + i * 8192,
          content: _buffer.subarray(pos + i * 8192, pos + (i + 1) * 8192)
        };

      return pos + this.chr_rom_size * 8192;
    },

    read_title: function(pos) {

      //this.addresses['title'] = pos;

      // TODO?
      // ...
    }

  }

})();


