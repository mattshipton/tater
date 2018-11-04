const fs = require('fs');

// Primary is the outer array, secondary is the inner array of the peelGrid
const peelLimit = 10000;
const peelGrid = [...Array(peelLimit)].map(() => Array(peelLimit).fill(0));
const peelCounter = { primary: 0, secondary: Array(peelLimit).fill(0) };;

const fileName = 'potato.🥔🥔🥔';
const program = fs.readFileSync(fileName, {encoding: 'utf8'}).trim().normalize('NFKD');
const programSplit = program.match(/taters/gi);

if(!programSplit || !programSplit.every(e => e.toLowerCase() === 'taters')) {
  console.error(new Error('Invalid syntax, we only accept taters and single spaces >:('));
  process.exit(1);
}

if(programSplit.filter(e => e === 'tATeRs').length !== programSplit.filter(e => e === 'tAtERs').length) {
  console.error(new Error('Loop openers do not match loop closers >:('));
  process.exit(2);
}

if(programSplit.filter(e =>
  e === 'tAteRs' || // ==
  e === 'TAteRs' || // >
  e === 'tAteRS' // <
).length !== programSplit.filter(e => e === 'tATERs').length) {
  console.error(new Error('Conditional openers do not match conditional closers >:('));
  process.exit(2);
}

let programCounter = 0;

const loopStack = [];

let nextNotModifier = false;

while(programCounter < programSplit.length) {
  // Not management
  let thisNotModifier = nextNotModifier;
  nextNotModifier = false;

  // TODO: Exponential printing of TATERS
  if(programSplit[programCounter] === 'TATERS') {
    console.log('TATERS');
    process.exit(0);
  }

  // 2d peel navigation
  else if(programSplit[programCounter] === 'TaTeRs') {
    // Move to previous secondary peel
    peelCounter.primary = (peelCounter.primary + peelLimit - 1) % peelLimit;
  }
  else if(programSplit[programCounter] === ' tAtErS') {
    // Move to next secondary peel
    peelCounter.primary = (peelCounter.primary + peelLimit + 1) % peelLimit;
  }
  else if(programSplit[programCounter] === 'TATers') {
    // Move pointer left on the secondary peel
    peelCounter.secondary[peelCounter.primary] = (peelCounter.secondary[peelCounter.primary] + peelLimit - 1) % peelLimit;
  }
  else if(programSplit[programCounter] === 'tatERS') {
    // Move pointer right on the secondary peel
    peelCounter.secondary[peelCounter.primary] = (peelCounter.secondary[peelCounter.primary] + peelLimit + 1) % peelLimit;
  }

  // Arithmetic, A is current box, B is next box
  else if(programSplit[programCounter] === 'Taters') {
    // A--
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]]--;
  }
  else if(programSplit[programCounter] === 'taterS') {
    // A++
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]]++;
  }
  else if(programSplit[programCounter] === 'TaTers') {
    // A = A - B
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] -= peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
  }
  else if(programSplit[programCounter] === 'tatErS') {
    // A = A + B
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] += peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
  }
  else if(programSplit[programCounter] === 'TaterS') {
    // A = A * B
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] *= peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
  }
  else if(programSplit[programCounter] === 'TaterS') {
    // temp[C] = A / B
    // B = A % B
    // A = temp[C]
    let divisionValue = peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] / peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] = peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] % peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
    peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit] = divisionValue;
  }
  else if(programSplit[programCounter] === 'TaTErS') {
    // A = A ** B
    peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] **= peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit];
  }

  // Loop management
  else if(programSplit[programCounter] === 'tATeRs') {
    // Open loop
    let loopCount = 1;
    let endPosition;
    for(endPosition = programCounter + 1; i < programSplit.length && loopCount > 0; i++) {
      if(programSplit[programCounter] === 'tATeRs') {
        loopCount++;
      } else if(programSplit[programCounter] === 'tAtERs') {
        loopCount--;
      }
    }
    endPosition--;
    loopStack.push({ start: programCounter, end: i });
  }
  else if(programSplit[programCounter] === 'tAtERs') {
    // Close loop
    programCounter = loopStack[loopStack.length() - 1].start;
  }
  else if(programSplit[programCounter] === 'TATERs') {
    programCounter = loopStack.pop().end;
  }

  // Conditional management
  else if(programSplit[programCounter] === 'TAteRS') {
    // Not
    nextNotModifier = true;
  }
  else if(programSplit[programCounter] === 'tAteRs') {
    // ==
    if(!(thisNotModifier ^ (peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] === peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit]))) {
      let loopCount = 1;
      let endPosition;
      for(endPosition = programCounter + 1; endPosition < programSplit.length && loopCount > 0; endPosition++) {
        if(['tAteRs', 'TAteRs', 'tAteRS'].includes(programSplit[endPosition])) {
          loopCount++;
        } else if(programSplit[endPosition] === 'tATERs') {
          loopCount--;
        }
      }
      endPosition--;
      programCounter = endPosition;
    }
  }
  else if(programSplit[programCounter] === 'tAteRS') {
    // <
    if(!(thisNotModifier ^ (peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] < peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit]))) {
      let loopCount = 1;
      let endPosition;
      for(endPosition = programCounter + 1; endPosition < programSplit.length && loopCount > 0; endPosition++) {
        if(['tAteRs', 'TAteRs', 'tAteRS'].includes(programSplit[endPosition])) {
          loopCount++;
        } else if(programSplit[endPosition] === 'tATERs') {
          loopCount--;
        }
      }
      endPosition--;
      programCounter = endPosition;
    }
  }
  else if(programSplit[programCounter] === 'TAteRs') {
    // >
    if(!(thisNotModifier ^ (peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]] > peelGrid[peelCounter.primary][(peelCounter.secondary[peelCounter.primary] + 1) % peelLimit]))) {
      let loopCount = 1;
      let endPosition;
      for(endPosition = programCounter + 1; endPosition < programSplit.length && loopCount > 0; endPosition++) {
        if(['tAteRs', 'TAteRs', 'tAteRS'].includes(programSplit[endPosition])) {
          loopCount++;
        } else if(programSplit[endPosition] === 'tATERs') {
          loopCount--;
        }
      }
      endPosition--;
      programCounter = endPosition;
    }
  }

  // Input/output
  else if(programSplit[programCounter] === 'TATErs') {
    // Input
  }
  else if(programSplit[programCounter] === 'tateRS') {
    // Output
    process.stdout.write(String.fromCharCode(peelGrid[peelCounter.primary][peelCounter.secondary[peelCounter.primary]]));
  }

  // Add one to our programCounter
  programCounter++;
}
