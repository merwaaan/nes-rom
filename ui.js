UI = (function() {

  'user strict';

  var _elements = [];

  var _colors = [
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF'
  ];

  return {

    show: function() {

      this.clear();

      this.show_header();
      this.show_trainer();
      this.show_prg();
      this.show_chr();
    },

    clear: function() {

      _elements.concat([].slice.call(document.querySelectorAll('.qtip'))).map(function(element) {
        element.parentNode.removeChild(element);
      });

      _elements = [];
    },

    append: function(element) {

      document.body.insertBefore(element, document.getElementById('about'));

      _elements.push(element);
    },

    show_header: function() {

      var header_title = document.createElement('h2');
      header_title.textContent = 'Header (hover to see content)';
      this.append(header_title);

      var header_section = document.createElement('section');
      header_section.setAttribute('class', 'header');

      this.header_block(0, 4, 'Constant bytes ("NES" in ascii)', header_section);
      this.header_block(4, 1, 'Number of 16 kB units of PRG ROM (program)', header_section);
      this.header_block(5, 1, 'Number of 8 kB units of CHR ROM (sprites)', header_section);
      this.header_block(6, 1, 'Flag 6', header_section);
      this.header_block(7, 1, 'Flag 7', header_section);
      this.header_block(8, 1, 'Number of 8 kB units of PRG RAM', header_section);
      this.header_block(9, 1, 'Flag 9', header_section);
      this.header_block(10, 1, 'Flag 10 (unofficial)', header_section);
      this.header_block(11, 5, 'Padding', header_section);

      this.append(header_section);
    },

    header_block: function(address, size, comment, container) {

      var block = document.createElement('span');
      block.setAttribute('class', 'block');
      block.innerHTML = [].map.call(ROM.data['header'].content.subarray(address, address + size), function(x) {
        return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
      }).join(' ');

      $(block).qtip({
        content: {text: comment},
        style: {classes: 'qtip-tipsy'},
        position: {my: 'top left', at: 'bottom center'}
      });

      container.appendChild(block);
    },

    show_trainer: function() {

      if (ROM.has_trainer) {

        var trainer = ROM.data['trainer'].content;

        var trainer_title = document.createElement('h2');
        trainer_title.innerHTML = 'Trainer';
        this.append(trainer_title);

        var trainer_section = document.createElement('section');
        trainer_section.setAttribute('class', 'trainer');

        trainer_section.innerHTML = [].map(trainer, function(x) {
          return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
        }).join(' ');

        this.append(trainer_section);
      }
    },

    show_prg: function() {

      for (var i = 0; i < ROM.prg_rom_size; ++i) {

        var prg = ROM.data['prg'][i].content;

        var prg_title = document.createElement('h2');
        prg_title.innerHTML = 'PRG ' + i;
        this.append(prg_title);

        var prg_section = document.createElement('section');
        prg_section.setAttribute('class', 'prg');

        prg_section.innerHTML = [].map.call(prg, function(x) {
          return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
        }).join(' ');

        this.append(prg_section);
      }
    },

    show_chr: function() {

      for (var i = 0; i < ROM.chr_rom_size; ++i) {

        var chr = ROM.data['chr'][i].content;

        var chr_title = document.createElement('h2');
        chr_title.innerHTML = 'CHR ' + i + (i == 0 ? ' (hover to see tiles)' : '');
        this.append(chr_title);

        var chr_section = document.createElement('section');
        chr_section.setAttribute('class', 'chr');

        for (var j = 0; j < 8192; j += 16) {

          var pattern_span = document.createElement('span');
          pattern_span.setAttribute('class', 'block');

          var pattern = chr.subarray(j, j + 16);

          pattern_span.innerHTML = [].map.call(pattern, function(x) {
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
    },

    draw_pattern: function(pattern, scale) {

      scale = scale || 1;

      var pattern0 = pattern.subarray(0, 8);
      var pattern1 = pattern.subarray(8, 16);

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
          ctx.fillStyle = _colors[color];

          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }

      return canvas;
    }

  }

})();
