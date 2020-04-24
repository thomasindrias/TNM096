import Clause from './clause.js';

class CNF {
  constructor() {}

  /*---------------  Auxalliary Functions ----------------*/
  intersection(A, B) {
    let intersection = new Set(
      [...A].filter(literal => B.has(literal)));

    return intersection;
  }

  union(A, B) {
    let union = new Set([...A, ...B]);

    return union;
  }

  difference(A, B) {
    let difference = new Set(
      [...A].filter(x => !B.has(x)));

    return difference;
  }

  isStrictSubset(A, B) {
    const ASize = A.positives.size + A.negatives.size;
    const BSize = B.positives.size + B.negatives.size;

    return (this.isSubset(A, B) && (ASize < BSize));
  }

  isSubset(A, B) {
    const posSub = new Set([...B.positives, ...A.positives]).size === B.positives.size;
    const negSub = new Set([...B.negatives, ...A.negatives]).size === B.negatives.size;

    return (posSub && negSub);
  }

  getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
  }

  //Compare two clauses
  equals(A, B) {
    if (A.positives.size !== B.positives.size || A.negatives.size !== B.negatives.size) return false;

    return this.isSubset(A, B);
  }
  /*---------------  CNF functions ----------------*/
  resolution(clauseA, clauseB) {
    let A = clauseA.copy();
    let B = clauseB.copy();

    const intersection1 = this.intersection(A.positives, B.negatives);
    const intersection2 = this.intersection(A.negatives, B.positives);

    if (intersection1.size === 0 && intersection2.size === 0) {
      return false;
    }

    if (intersection1.size > 0) {
      let a = this.getRandomItem(intersection1);
      A.positives.delete(a);
      B.negatives.delete(a);
    } else {
      let a = this.getRandomItem(intersection2);
      A.negatives.delete(a);
      B.positives.delete(a);
    }

    let C = new Clause([]);
    C.positives = this.union(A.positives, B.positives);
    C.negatives = this.union(A.negatives, B.negatives);

    if (this.intersection(C.positives, C.negatives).size > 0) return false;

    return C;
  }

  incorporate_clause(A, KB) {
    for (let i = 0; i < KB.length; i++) {
      if (this.isSubset(KB[i], A)) {
        console.log("JFG");
        return KB;
      }
    }

    for (let i = 0; i < KB.length; i++) {
      if (this.isStrictSubset(A, KB[i])) {
        KB[i].negatives = A.negatives;
        KB[i].positives = A.positives;
      }
    }

    return KB;
  }

  incorporate(S, KB) {
    S.forEach(A => {
      KB = this.incorporate_clause(A, KB);
    });

    return KB;
  }

  solver(KB) {
    let KBprim = [];
    let C = new Clause([]);

    let flag = true;

    while (flag || C && !C.isEmpty()) {
      let S = [];
      KBprim = KB;

      for (let i = 0; i < KB.length; i++)
        for (let j = i + 1; j < KB.length; j++) {

          C = this.resolution(KB[i], KB[j]);

          if (C != false) S.push(C);
        }

      console.log("S", S);

      // if (S.length === 0) return KB;

      KB = this.incorporate(S, KB)
      flag = false
    }

    return KB;
  }
}

const clauseList1 = [];

const clauseA = new Clause(['-db']);
const clauseB = new Clause(['+da', '+dc']);
const clauseC = new Clause(['-c', '+a']);
const clauseD = new Clause(['+a', '+b', '+c']);

const clauseList2 = [];

const apaA = new Clause(['-sun', '-money', '+ice']);
const apaB = new Clause(['-money', '+ice', '+movie']);
const apaC = new Clause(['-movie', '+money']);
const apaD = new Clause(['-movie', '-ice']);

clauseList1.push(clauseA);
clauseList1.push(clauseB);
clauseList1.push(clauseC);
clauseList1.push(clauseD);

clauseList2.push(apaA);
clauseList2.push(apaB);
clauseList2.push(apaC);
clauseList2.push(apaD);

const cnf = new CNF();
const KB = cnf.solver(clauseList2);

console.log("KB", KB);

// const resolution = cnf.resolution(clauseA, clauseB);