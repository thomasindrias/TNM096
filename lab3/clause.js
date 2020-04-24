class Clause {
  constructor(clause) {
    this.positives = new Set();
    this.negatives = new Set();

    this.parseClause(clause);
  }

  copy() {
    let temp = new Clause([]);

    temp.positives = new Set(JSON.parse(JSON.stringify(Array.from(this.positives))));
    temp.negatives = new Set(JSON.parse(JSON.stringify(Array.from(this.negatives))));

    return temp;
  }

  parseClause(clause) {
    clause.forEach(literal => {
      if (literal[0] === '+') {
        this.positives.add(literal.substr(1));
      } else if (literal[0] === '-') {
        this.negatives.add(literal.substr(1));
      }
    });
  }

  isEmpty() {
    if (this.positives.size === 0 && this.negatives.size === 0) return true;
    return false;
  }

  log() {
    const res = {
      positives: JSON.parse(JSON.stringify(Array.from(this.positives))),
      negatives: JSON.parse(JSON.stringify(Array.from(this.negatives)))
    };

    console.log(res)
  }
}

export default Clause;