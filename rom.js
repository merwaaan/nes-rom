var ROM = (function() {

  'use strict';

  /**
   * All the ROM data
   */

  var _buffer = null;

  return {

    /**
      * Views on the ROM data (one for each section)
      */

    data: {},

    load: function(buffer) {

      _buffer = new Uint8Array(buffer);

      // Start with the header

      var address = this.read_header();

      // Read the other sections

      if (this.has_trainer)
        address = this.read_section('trainer', 1, 512, address);

      address = this.read_section('prg', this.prg_banks, 16384, address);

      address = this.read_section('chr', this.chr_banks, 8192, address);
    },

    read_header: function() {

      var header = this.data['header'] = _buffer.subarray(0, 16);

      this.constant = header.subarray(0, 4);
      this.prg_banks = header[4];
      this.chr_banks = header[5];
      this.flag6 = header[6];
      this.flag7 = header[7];
      this.prg_ram_size = header[8];
      this.flag9 = header[9];
      this.flag10 = header[10];

      // Parse flags

      this.has_sram = (this.flag6 & 1<<1) !== 0;
      this.has_trainer = (this.flag6 & 1<<2) !== 0;
      this.has_playchoice = (this.flag7 & 1<<1) !== 0;
      this.is_ntsc = (this.flag9 & 1) !== 0;

      return 16;
    },

    read_section: function(name, banks, bank_size, address) {

      this.data[name] = [];

      for (var i = 0; i < banks; ++i)
        this.data[name].push(_buffer.subarray(address + i * bank_size, address + (i + 1) * bank_size));

      return address + banks * bank_size;
    }

  }

})();


