UI = (function() {

  'user strict';

  var _elements = [];

  var _colors = [
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF'
  ];

  var to_hex = function(data) {

    return [].map.call(data, function(x) {
      return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
    }).join(' ');
  };

  return {

    show: function() {

      // Remove everything

      this.clear();

      // Generate the sections

      this.show_header();

      if (ROM.has_trainer)
        this.show_section('trainer');

      this.show_section('prg');

      this.show_sprites();
    },

    clear: function() {

      // Remove the appended elements AND the qTips

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

      this.header_block(0, 4, 'Constant bytes ("NES\\n" in ascii)', header_section);
      this.header_block(4, 1, 'Number of PRG banks (program)', header_section);
      this.header_block(5, 1, 'Number of CHR banks (sprites)', header_section);
      this.header_block(6, 1, 'Flag 6', header_section);
      this.header_block(7, 1, 'Flag 7', header_section);
      this.header_block(8, 1, 'Number of PRG RAM banks', header_section);
      this.header_block(9, 1, 'Flag 9', header_section);
      this.header_block(10, 1, 'Flag 10 (unofficial)', header_section);
      this.header_block(11, 5, 'Padding', header_section);

      this.append(header_section);
    },

    header_block: function(address, size, comment, container) {

      var block = document.createElement('span');
      block.setAttribute('class', 'block');
      block.innerHTML = [].map.call(ROM.data['header'].subarray(address, address + size), function(x) {
        return (x < 16 ? '0' : '') + x.toString(16).toUpperCase();
      }).join(' ');

      $(block).qtip({
        content: {text: comment},
        style: {classes: 'qtip-tipsy'},
        position: {my: 'top left', at: 'bottom center'}
      });

      container.appendChild(block);
    },

    show_section: function(name) {

      // One section for each bank

      for (var i = 0; i < ROM.data[name].length; ++i) {

        var data = ROM.data[name][i];

        var title = document.createElement('h2');
        title.innerHTML = name.toUpperCase() + (ROM.data[name].length > 1 ? ' ' + i : '');
        this.append(title);

        var section = document.createElement('section');
        section.setAttribute('class', name);

        section.innerHTML = to_hex(data);

        this.append(section);
      }
    },

    /**
      * Sprites have special treatment: a thumbnail is displayed
      * when hovering over the data blocks.
      */

    show_sprites: function() {

      for (var i = 0; i < ROM.chr_banks; ++i) {

        var chr = ROM.data['chr'][i];

        var title = document.createElement('h2');
        title.innerHTML = 'CHR ' + i + (i == 0 ? ' (hover to see tiles)' : '');
        this.append(title);

        var section = document.createElement('section');
        section.setAttribute('class', 'chr');

        for (var j = 0; j < 8192; j += 16) {

          var span = document.createElement('span');
          span.setAttribute('class', 'block');

          var pattern = chr.subarray(j, j + 16);
          span.textContent = to_hex(pattern);

          section.appendChild(span);

          var canvas = this.draw_pattern(pattern, 15);

          // Add a bubble

          $(span).qtip({
            content: $(canvas),
            style: {classes: 'qtip-tipsy'},
            position: {my: 'left bottom', at: 'top right'}
          });
        }

        this.append(section);
      }
    },

    draw_pattern: function(pattern, scale) {

      var pattern0 = pattern.subarray(0, 8);
      var pattern1 = pattern.subarray(8, 16);

      var canvas = document.createElement('canvas');
      canvas.width = 8 * scale;
      canvas.height = 8 * scale;

      var ctx = canvas.getContext('2d');

      for (var x = 0; x < 8; ++x) {
        for (var y = 0; y < 8; ++y) {

          var bit0 = (pattern0[y] >> (7 - x)) & 1;
          var bit1 = (pattern1[y] >> (7 - x)) & 1;
          var color = bit0 + (bit1 << 1);
          ctx.fillStyle = _colors[color];

          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }

      return canvas;
    }

  }

})();
