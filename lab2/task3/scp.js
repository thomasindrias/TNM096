class Scheduler {
  constructor(courses) {
    this.courses = this.shuffle(courses);
    this.nConflicts = this.tot_conflicts();
    this.score = 0;
  }

  shuffle(c) {
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = c[i];
      c[i] = c[j];
      c[j] = temp;
    }
    return c;
  }

  // Check if conflict between MT1,2,3,4,5
  tot_conflicts() {
    let nConflicts = 0;
    for (let i = 0; i < this.courses.length; i += 3) {
      let col1 = this.courses[i].charAt(2);
      let col2 = this.courses[i + 1].charAt(2);
      let col3 = this.courses[i + 2].charAt(2);

      if (col1 === col2 || col1 === col3 || col2 === col3)
        nConflicts++;
    }
    return nConflicts;
  }

  generate() {
    let nConflicts = this.tot_conflicts();
    let n = 0;
    let maxIt = 10;

    while (n < maxIt && nConflicts > 0) {
      n++;

      // Random course from courses
      const randInd = Math.floor(Math.random() * this.courses.length);
      const minInd = parseInt(this.minConflicts(randInd));
      //console.log("BEFORE", JSON.parse(JSON.stringify(this.courses)));
      //console.log("swapping index:", randInd + " and ", minInd);

      //Swap
      var b = this.courses[randInd];
      this.courses[randInd] = this.courses[minInd];
      this.courses[minInd] = b;

      nConflicts = this.tot_conflicts();

      //console.log("AFTER", JSON.parse(JSON.stringify(this.courses)));
    }

    this.nConflicts = nConflicts;

    console.log(JSON.parse(JSON.stringify(this.courses)));
    //this.score();
  }

  findConflicts(year, index) {
    let col = index % 3;
    let nConflicts = 0;
    let neighbours = ["", ""];

    if (year === "5") return 0;

    if (col == 0) {
      neighbours[0] = this.courses[index + 1];
      neighbours[1] = this.courses[index + 2];
    } else if (col == 1) {
      neighbours[0] = this.courses[index - 1];
      neighbours[1] = this.courses[index + 1];
    } else if (col == 1) {
      neighbours[0] = this.courses[index - 1];
      neighbours[1] = this.courses[index - 2];
    }

    if (year === neighbours[0].charAt(2)) nConflicts++;
    if (year === neighbours[1].charAt(2)) nConflicts++;

    return nConflicts;
  }

  minConflicts(index) {
    let course = this.courses[index];
    let year = course.charAt(2);

    let minInd = index;
    let minIndConflict = 99999;

    // If there's an empty course slot
    if (year === " ") return index;

    // Compare course with other courses in schedule
    for (let i = 0; i < this.courses.length; i++) {
      let tempConflicts = this.findConflicts(year, i);

      if (tempConflicts < minIndConflict) {
        minIndConflict = tempConflicts;
        minInd = i;
      }
    }

    return minInd;
  }

  score() {

  }
}

const schedule = new Scheduler([
  "MT101", "MT102", "MT103",
  "MT104", "MT105", "MT106",
  "MT107", "MT201", "MT202",
  "MT203", "MT204", "MT205",
  "MT206", "MT301", "MT302",
  "MT303", "MT304", "MT401",
  "MT402", "MT403", "MT501",
  "MT502", "     ", "     "
]);

schedule.generate();