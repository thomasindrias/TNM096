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

  equalsLists(L1, L2) {
    let check = 0;

    if (L1.length === 0 || L2.length === 0) return false;

    for (let i = 0; i < L1.length; i++)
      for (let j = 0; j < L2.length; j++) {
        if (this.equals(L1[i], L2[j])) {
          check++;
          break;
        }
      }

    return (check === L1.length);
  }
  /*---------------  CNF functions ----------------*/
  resolution(clauseA, clauseB) {
    let A = clauseA.copy();
    let B = clauseB.copy();

    // console.log("BEFORE")
    // A.log()
    // B.log()

    const intersection1 = this.intersection(A.positives, B.negatives);
    const intersection2 = this.intersection(A.negatives, B.positives);

    if (intersection1.size === 0 && intersection2.size === 0) {
      return false;
    }

    if (intersection1.size > 0) {
      let a = this.getRandomItem(intersection1);
      // console.log("Ap snitt Bn != {}", intersection1)
      A.positives.delete(a);
      B.negatives.delete(a);
    } else {
      let a = this.getRandomItem(intersection2);
      // console.log("Ap snitt Bn == {}", intersection2)
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
    let tempKB = [];

    KB.forEach((B, i) => {
      if (this.isSubset(B, A)) {
        return KB;
      } else if (!this.isStrictSubset(A, B)) {
        tempKB.push(B.copy());
      } else if (this.isStrictSubset(A, B)) {
        KB.splice(i, 1);
      }

    });

    tempKB.push(A.copy());
    return tempKB;
  }

  incorporate(S, KB) {
    S.forEach(A => {
      // console.log("DEBUG INCORPORATES")
      // A.log()
      // console.log("KB (incorporate)", KB)
      KB = this.incorporate_clause(A, KB);
    });

    console.log("KB result (incorporate)", JSON.parse(JSON.stringify(KB)))
    return KB;
  }

  solver(KB) {
    let KBprim = [];
    let C = null;

    while (!this.equalsLists(KBprim, KB)) {
      let S = [];
      KBprim = KB;

      for (let i = 0; i < KB.length; i++)
        for (let j = i + 1; j < KB.length; j++) {

          C = this.resolution(KB[i], KB[j]);

          if (C !== false) {
            S.push(C);
          }
        }

      console.log("S", S);

      if (S.length === 0) return KB;

      KB = this.incorporate(S, KB);
      // console.log(KB)
    }

    return KB;
  }
}

const clauseList1 = [];

const clauseA = new Clause(['+a', '+b', '-c']);
const clauseB = new Clause(['+c', '+b']);

const clauseList2 = [];

const apaA = new Clause(['-sun', '-money', '+ice']);
const apaB = new Clause(['-money', '+ice', '+movie']);
const apaC = new Clause(['-movie', '+money']);
const apaD = new Clause(['-movie', '-ice']);
const apaE = new Clause(['+movie']);

clauseList1.push(clauseA);
clauseList1.push(clauseB);

clauseList2.push(apaA);
clauseList2.push(apaB);
clauseList2.push(apaC);
clauseList2.push(apaD);
clauseList2.push(apaE);

const cnf = new CNF();

const KB = cnf.solver(clauseList2);

console.log("Resulting KB", KB);

// const resolution = cnf.resolution(clauseA, clauseB);