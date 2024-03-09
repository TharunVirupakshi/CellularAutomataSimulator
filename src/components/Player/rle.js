class RLE {
  constructor(text) {
    this.parse(text);
  }

  init(text) {
    this.text = text || '#C Empty text';
    this.pattern = [[]]; // Initialize with an empty row
    this.done = false;

    this.lines = this.text.split(/\r\n|\r|\n/).map((l) => ({ type: '', data: l.trim() })).filter((l) => l.data.length > 0);
  }

  setTypes() {
    this.lines.forEach((line) => {
      if (line.data[0] === '#') line.type = 'comment';
      else if (/[xX]/.test(line.data[0])) line.type = 'header';
      else if (/\d*[oObB]+[$!]+/.test(line.data)) line.type = 'pattern';
    });
  }

  execOp(op) {
    for (let n = 0; n < op.n; n++) {
      this.operation(op.o);
    }
  }

  operation(operand) {
    if (!this.done) {
      switch (operand) {
        case 'o':
          this.pattern[this.pattern.length - 1].push(1);
          break;
        case 'b':
          this.pattern[this.pattern.length - 1].push(0);
          break;
        case '$':
          this.pattern.push([]); // Start a new row
          break;
        case '!':
          this.done = true;
          break;
        default:
          this.pattern[this.pattern.length - 1].push(0);
      }
    }
  }

  parse(text) {
    this.init(text);
    this.setTypes();
    let tokens = this.lines
      .filter((l) => l.type === 'pattern')
      .map((l) => l.data)
      .join('')
      .toLowerCase()
      .replace(/[^\dob$!]/g, 'b')
      .match(/\d*[ob$!]/g);

    if (tokens) {
      tokens.forEach((op, idx) => {
        tokens[idx] = /\d/.test(op[0]) ? op : '1' + op;
      });

      tokens
        .join('')
        .match(/\d+[ob$!]/g)
        .map((token) => ({ n: parseInt(token), o: token.replace(/\d+/, '') }))
        .forEach((op) => this.execOp(op));
    }

    return this.pattern;
  }
}

export default RLE;
