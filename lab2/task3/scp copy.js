class Schedule {
  constructor() {
    const courses = [
      "MT101", "MT102", "MT103",
      "MT104", "MT105", "MT106",
      "MT107", "MT201", "MT202",
      "MT203", "MT204", "MT205",
      "MT206", "MT301", "MT302",
      "MT303", "MT304", "MT401",
      "MT402", "MT403", "MT501",
      "MT502", "     ", "     "
    ];
    this.courses = this.shuffle(courses);
    this.nConflicts = this.tot_conflicts();
    this.score = 0;
  }

  // Shuffle an array
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

      if (col1 === col2 || col1 === col3 || col2 === col3) {
        nConflicts++;
      }
    }
    return nConflicts;
  }

  // Generate a schedule with min conflict
  generate() {
    let nConflicts = this.tot_conflicts();
    let n = 0;
    let maxIt = 10000;

    while (n < maxIt && nConflicts > 0) {
      n++;

      // Random course from courses
      const randInd = Math.floor(Math.random() * this.courses.length);
      // Find index for minimum conflicts
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
    this.scheduleScore();
  }

  // Find conflicts between columns
  findConflicts(year, index) {
    let col = index % 3;
    let nConflicts = 0;
    let neighbours = ["", ""];

    //console.log("index", index, " col:", col);

    // MT5 allowed to conflict
    if (year === "5") return 0;

    if (col == 0) {
      neighbours[0] = this.courses[index + 1];
      neighbours[1] = this.courses[index + 2];
    } else if (col == 1) {
      neighbours[0] = this.courses[index - 1];
      neighbours[1] = this.courses[index + 1];
    } else if (col == 2) {
      neighbours[0] = this.courses[index - 1];
      neighbours[1] = this.courses[index - 2];
    }

    if (year === neighbours[0].charAt(2)) nConflicts++;
    if (year === neighbours[1].charAt(2)) nConflicts++;

    return nConflicts;
  }


  // Minimize conflicts
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

  // Task 4: Get score with the preferences
  scheduleScore() {
    let schedule = this.generateObject();

    // Check if time is 9am 12pm or 4pm
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].time === "9 am" || schedule[i].time === "12 pm" || schedule[i].time === "4 pm")
        for (let j = 0; j < schedule[i].courses.length; j++)
          if (schedule[i].courses[j].trim().length == 0)
            this.score++;

      if (schedule[i].time === "1 pm" || schedule[i].time === "2 pm")
        for (let j = 0; j < schedule[i].courses.length; j++)
          if (schedule[i].courses[j] === "MT501" || schedule[i].courses[j] === "MT502")
            this.score++;
    }
  }

  // Generate an object for schedule
  generateObject() {
    // From format [MT1X MT1X MT1X MT2X MT2X ...] to
    // [{time: x, courses[MTX MTX MTX]}, ...]
    let schedule = [{
        time: '9 am',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(0, 3),
      },
      {
        time: '10 am',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(3, 6),
      },
      {
        time: '11 am',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(6, 9),
      },
      {
        time: '12 pm',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(9, 12),
      },
      {
        time: '1 pm',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(12, 15),
      },
      {
        time: '2 pm',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(15, 18),
      },
      {
        time: '3 pm',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(18, 21),
      },
      {
        time: '4 pm',
        courses: JSON.parse(JSON.stringify(this.courses)).slice(21, 24),
      },

    ];
    return schedule;
  }
}

class Schedules {
  constructor() {
    this.schedules = [];
    this.maxScore = 0;
    this.bestIndex = 0;

    this.schedule = new Schedule();
    this.schedule.generate();
  }

  // Loop till we find the optimal schedule
  findBestSchedule() {
    while (this.schedules.length < 500) {
      const schedule = new Schedule();
      schedule.generate();

      // Check if stuck at local minima
      if (schedule.nConflicts != 0)
        continue;

      this.schedules.push(schedule.generateObject());

      if (schedule.score > this.maxScore) {
        this.maxScore = schedule.score;
        this.bestIndex = this.schedules.length - 1;
      }

      if (schedule.score == 4) {
        console.log("Optimal schedule found");
        break;
      }
    }
  }

  getBestSchedule() {
    schedules.findBestSchedule();
    console.log("Steps: ", this.schedules.length);
    return this.schedules[this.bestIndex];
  }
}

const schedules = new Schedules();

console.log("TASK 3:");
console.log("TOTAL CONFLICTS:", schedules.schedule.nConflicts);
console.log(schedules.schedule.generateObject());

console.log("TASK 4:");
console.log(schedules.getBestSchedule());