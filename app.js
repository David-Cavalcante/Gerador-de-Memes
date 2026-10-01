// CAN\VAS.js plugin
// ninivert, december 2016
(function (window, document) {
    /**
    * CAN\VAS Plugin - Adding line breaks to canvas
    * @arg {string} [str=Hello World] - text to be drawn
    * @arg {number} [x=0]             - top left x coordinate of the text
    * @arg {number} [y=textSize]      - top left y coordinate of the text
    * @arg {number} [w=canvasWidth]   - maximum width of drawn text
    * @arg {number} [lh=1]            - line height
    * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
    */
    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        // local variables and defaults
        
        // CORREÇÃO: Pega o valor exato, mesmo se tiver decimal (ex: "42.5px")
        var fontMatch = this.font.match(/([\d.]+)px/i);
        var textSize = fontMatch ? parseFloat(fontMatch[1]) : parseInt(this.font.replace(/\D/gi, ''));
        
        var textParts = [];
        var textPartsNo = 0;
        var words = [];
        var currLine = '';
        var testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        // manual linebreaks
        textParts = str.split('\n');
        textPartsNo = textParts.length;

        // split the words of the parts
        for (var i = 0; i < textParts.length; i++) {
            words[i] = textParts[i].split(' ');
        }

        // now that we have extracted the words
        // we reset the textParts
        textParts = [];

        // calculate recommended line breaks
        // split between the words
        for (var i = 0; i < textPartsNo; i++) {

            // clear the testline for the next manually broken line
            currLine = '';

            for (var j = 0; j < words[i].length; j++) {
                testLine = currLine + words[i][j] + ' ';

                // check if the testLine is of good width
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }
            // replace is to remove trailing whitespace
            textParts.push(currLine);
        }

        // CORREÇÃO: retorna imediatamente se o método for 'none' sem precisar entrar no loop de renderização
        if (method === 'none') {
            return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
        }

        // render the text on the canvas
        for (var i = 0; i < textParts.length; i++) {
            if (method === 'fill') {
                this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        }

        return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
    };
})(window, document);

var canvas = document.createElement('canvas');
var canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var padding = 15;
var textTop = 'nem sempre faço um meme';
var textBottom = 'mas quando faço isso, uso o gerador de MEMEs';
var textSizeTop = 8;
var textSizeBottom = 8;
var image = document.createElement('img');

image.onload = function (ev) {
    // delete and recreate canvas to untaint it
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    document.getElementById('trueSize').click();
    document.getElementById('trueSize').click();
    
    draw();
};

document.getElementById('imgURL').oninput = function(ev) {
    image.src = this.value;
};

document.getElementById('imgFile').onchange = function(ev) {
    var reader = new FileReader();
    reader.onload = function(ev) {
        image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
};

document.getElementById('textTop').oninput = function(ev) {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function(ev) {
    textBottom = this.value;
    draw();
};

document.getElementById('textSizeTop').oninput = function(ev) {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').innerHTML = this.value;
};
document.getElementById('textSizeBottom').oninput = function(ev) {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').innerHTML = this.value;
};

document.getElementById('trueSize').onchange = function(ev) {
    if (document.getElementById('trueSize').checked) {
        canvas.classList.remove('fullwidth');
    } else {
        canvas.classList.add('fullwidth');
    }
};

document.getElementById('export').onclick = function () {
    console.log('Export button clicked');
    
    if (!canvas.width || !canvas.height) {
        alert('Certifique-se de carregar uma imagem primeiro.');
        return;
    }

    var img = canvas.toDataURL('image/png');
    console.log('Canvas image URL:', img);

    var link = document.createElement("a");
    link.download = 'My Meme';
    link.href = img;

    link.click();

    var win = window.open('', '_blank');
    win.document.write('
