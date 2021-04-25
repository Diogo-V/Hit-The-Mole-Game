// Bakeoff #2 - Seleção de Alvos e Fatores Humanos
// IPM 2020-21, Semestre 2
// Entrega: até dia 7 de Maio às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 3 de Maio

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 31; // Add your group number here as an integer (e.g., 2, 3)
const BAKE_OFF_DAY = false; // Set to 'true' before sharing during the simulation and bake-off days

// Target and grid properties (DO NOT CHANGE!)
let PPI, PPCM;
let TARGET_SIZE;
let TARGET_PADDING, MARGIN, LEFT_PADDING, TOP_PADDING;
let continue_button;

// Metrics
let testStartTime, testEndTime; // time between the start and end of one attempt (48 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters
let draw_targets = false; // used to control what to show in draw()
let trials = []; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)
let fitts_IDs = []; // add the Fitts ID for each selection here (-1 when there is a miss)

let image_red_mushroom;
let image_yellow_mushroom;
let imgHeart;
let lostLife = false;
let lives = 3;
let song;
let isPlaying = false;

// Image declaration EDU
let image_pipe;
let image_goomba;
let image_normal_pole;
let image_secret_pole;
let image_block;
let image_star;
let image_credits;

// Game variables
let hit_streak = 0;
let img;
//let hitStreakWiggle      = false;
let imgDoubleClick;
let showTutorial = true;
let endTutorialBtt;
let imgVector;
let imgHitStreak;
let tutorialPage = 1;
let timer = 5;
let timerWiggle = true;
let startSound = false;

// Target class (position and width)
class Target {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }
}

function preload() {
  image_red_mushroom = loadImage("images/Mush-Red.png");
  image_yellow_mushroom = loadImage("images/Mush-Yellow3.png");
  imgHeart = loadImage("images/heart.png");

  image_pipe = loadImage("images/300px-NSMBDS_Warp_Pipe_Artwork.png");
  image_goomba = loadImage("images/NSMBDS_Goomba_Walking_Sprite.gif");
  image_normal_pole = loadImage("images/NSMBW_Flagpole_Artwork.png");
  image_secret_pole = loadImage("images/Flagpole_secret.png");
  image_block = loadImage("images/QBlockNSMB.gif");
  image_star = loadImage("images/CoinsStar.png");
  image_credits = loadImage("images/NSMB_Credits_105.png");

  img = loadImage("images/mario-coin.png");
  imgVector = loadImage("images/vector.png");
  imgDoubleClick = loadImage("images/double_click.png");
  imgHitStreak = loadImage("images/hit_streak.png");

  image_mistery_box = loadImage("images/mistery-box.png");
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  randomizeTrials(); // randomize the trial order at the start of execution

  textFont("Arial", 18); // font size for the majority of the text
  drawUserIDScreen(); // draws the user input screen (student number and display size)

  song = createAudio("sounds/Super Mario 64 Soundtrack - Title Theme.mp3");
}

// Runs every frame and redraws the screen
function draw() {
  if (draw_targets) {
    if (showTutorial) {
      displayTutorial();
    } else {
      // The user is interacting with the 4x4 target grid
      background(color(0, 0, 0)); // sets background to black

      // Print trial count at the top left-corner of the canvas
      fill(color(255, 255, 255));
      textAlign(LEFT);
      text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
      drawLives();
      hitStreak();

      // Draw all 16 targets
      drawVector(); // Draw path between targets on the canvas
      for (var i = 0; i < 16; i++) drawTarget(i);

      image_pipe.resize(150, 463);
      image(image_pipe, (width * 7) / 8, height);
    }
  }
}

function displayTutorial() {
  push();
  background(0);
  fill(255, 255, 255);

  song.play();
  song.volume(0.1);

  if (tutorialPage == 1) {
    push();
    textSize(50);
    textAlign(CENTER);
    text("INSTRUCTIONS", width / 2 - 310, 100, 620);
    pop();

    push();
    imageMode(CENTER);
    image_red_mushroom.resize(70, 70);
    image(image_red_mushroom, width / 3, height / 4 + 50);
    textSize(20);
    text("Current Target", width / 3 + 80, height / 4 + 58);
    pop();

    push();
    imageMode(CENTER);
    image_yellow_mushroom.resize(70, 70);
    image(image_yellow_mushroom, width / 3, height / 4 + 160);
    textSize(20);
    text("Next Target", width / 3 + 80, height / 4 + 168);
    pop();

    push();
    imageMode(CENTER);
    imgDoubleClick.resize(80, 80);
    image(imgDoubleClick, width / 3, height / 4 + 270);
    textSize(20);
    text("Current + Next Target", width / 3 + 80, height / 4 + 298);
    pop();

    push();
    imageMode(CENTER);
    imgHeart.resize(70, 70);
    image(imgHeart, width / 2 + 100, height / 4 + 50);
    textSize(20);
    text("Live", width / 2 + 150, height / 4 + 58);
    pop();

    push();
    imageMode(CENTER);
    image_star.resize(70, 70);
    image(image_star, width / 2 + 100, height / 4 + 160);
    textSize(20);
    text("Hit Streak Counter", width / 2 + 150, height / 4 + 168);
    pop();

    push();
    imageMode(CENTER);
    imgVector.resize(60, 60);
    image(imgVector, width / 2 + 100, height / 4 + 270);
    textSize(20);
    text("Direction of the Next Target", width / 2 + 150, height / 4 + 298);
    pop();

    push();
    imageMode(CENTER);
    image_mistery_box.resize(70, 70);
    image(image_mistery_box, width / 2 - 100, height / 4 + 430);
    textSize(20);
    text(
      "Depending of your perfomance, \n" +
        "you will see one of the 3 Easter Eggs",
      width / 2,
      height / 4 + 424
    );
    pop();

    if (!endTutorialBtt) {
      endTutorialBtt = createButton("START GAME");
      endTutorialBtt.style("background-color", color(255, 0, 0));
      endTutorialBtt.style("color", color(255, 255, 255));
      endTutorialBtt.size(150, 70);
      endTutorialBtt.mouseReleased(() => {
        tutorialPage = 2;
        endTutorialBtt.remove();
      });
      endTutorialBtt.position(
        width / 2 - 70,
        height - endTutorialBtt.size().height - 100
      );
    }
  } else {
    push();
    textAlign(CENTER, CENTER);
    textSize(100);
    text(timer, width / 2, height / 2);
    if (frameCount % 60 == 0 && timer > 0) {
      timer--;
    }
    if (timer == 0) {
      song.stop();
      showTutorial = false;
      testStartTime = millis();
    }
    pop();
  }

  pop();
}

function drawLives() {
  push();
  if (lives === 3) {
    image(imgHeart, 80, 370, 50, 50);
    image(imgHeart, 130, 370, 50, 50);
    image(imgHeart, 180, 370, 50, 50);
  }

  if (lives === 2) {
    image(imgHeart, 80, 370, 50, 50);
    image(imgHeart, 130, 370, 50, 50);
  }

  if (lives === 1) image(imgHeart, 80, 370, 50, 50);

  pop();
}

function hitStreak() {
  push();
  textSize(25);
  image(img, 80, 270, 50, 50);

  if (hit_streak > 46) fill(color(255, 0, 255));
  else if (hit_streak > 40) fill(color(0, 147, 255));
  else if (hit_streak > 30) fill(color(254, 147, 0));
  else if (hit_streak > 20) fill(color(254, 230, 0));
  else if (hit_streak > 10) fill(color(254, 230, 146));

  text("Hit streak: " + hit_streak, 130, 265, 200, 50);
  pop();
}

// Print and save results at the end of 48 trials
function printAndSavePerformance() {
  // DO NOT CHANGE THESE!
  let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time = (testEndTime - testStartTime) / 1000;
  let time_per_target = nf(test_time / parseFloat(hits + misses), 0, 3);
  let penalty = constrain(
    (parseFloat(95) - parseFloat(hits * 100) / parseFloat(hits + misses)) * 0.2,
    0,
    100
  );
  let target_w_penalty = nf(
    test_time / parseFloat(hits + misses) + penalty,
    0,
    3
  );
  let timestamp =
    day() +
    "/" +
    month() +
    "/" +
    year() +
    "  " +
    hour() +
    ":" +
    minute() +
    ":" +
    second();

  background(color(0, 0, 0)); // clears screen
  fill(color(255, 255, 255)); // set text fill color to white
  text(timestamp, 10, 20); // display time on screen (top-left corner)

  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
  text("Hits: " + hits, width / 2, 100);
  text("Misses: " + misses, width / 2, 120);
  text("Accuracy: " + accuracy + "%", width / 2, 140);
  text("Total time taken: " + test_time + "s", width / 2, 160);
  text("Average time per target: " + time_per_target + "s", width / 2, 180);
  text(
    "Average time for each target (+ penalty): " + target_w_penalty + "s",
    width / 2,
    220
  );

  // Print Fitts IDS (one per target, -1 if failed selection)
  //

  // Saves results (DO NOT CHANGE!)
  let attempt_data = {
    project_from: GROUP_NUMBER,
    assessed_by: student_ID,
    test_completed_by: timestamp,
    attempt: attempt,
    hits: hits,
    misses: misses,
    accuracy: accuracy,
    attempt_duration: test_time,
    time_per_target: time_per_target,
    target_w_penalty: target_w_penalty,
    fitts_IDs: fitts_IDs,
  };

  // Send data to DB (DO NOT CHANGE!)
  if (BAKE_OFF_DAY) {
    // Access the Firebase DB
    if (attempt === 0) {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }

    // Add user performance results
    let db_ref = database.ref("G" + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }

  // Custom finale - sounds
  if (accuracy >= 95 && target_w_penalty > 0.563 && target_w_penalty <= 0.631) {
    var audio = new Audio("sounds/Super Mario Stage Clear Sound.mp3");
    audio.play();
  } else if (accuracy < 95 || target_w_penalty > 0.631) {
    var audio = new Audio("sounds/Super Mario Game Over Sound.mp3");
    audio.play();
  } else {
    var audio = new Audio("sounds/Super Mario World Clear Sound.mp3");
    audio.play();
  }

  // Custom finale - images
  if (target_w_penalty <= 0.563) {
    image_credits.resize(0, 240);
    image(image_credits, width / 2, (height * 3) / 4);

    image_star.resize(64, 0);
    image(image_star, width / 4, (height * 3) / 4);
    image(image_star, (width * 3) / 4, (height * 3) / 4);
  } else if (target_w_penalty <= 0.631) {
    image_secret_pole.resize(0, 320);
    image(image_secret_pole, width / 2, (height * 3) / 4);

    image_block.resize(48, 0);
    image(image_block, width / 3, (height * 3) / 4);
    image(image_block, (width * 2) / 3, (height * 3) / 4);
  } else {
    image_normal_pole.resize(0, 320);
    image(image_normal_pole, width / 2, (height * 3) / 4);

    image_goomba.resize(32, 0);
    image(
      image_goomba,
      (width * 2) / 5,
      (height * 3) / 4 + image_normal_pole.height / 2 - 16
    );
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets && !showTutorial) {
    // Get the location and size of the target the user should be trying to select
    let target = getTargetBounds(trials[current_trial]);

    // Check to see if the mouse cursor is inside the target bounds,
    // increasing either the 'hits' or 'misses' counters
    let fitts = -1;
    if (dist(target.x, target.y, mouseX, mouseY) < target.w / 2) {
      var audio = new Audio("sounds/Super Mario Coin Sound.mp3");
      audio.play();

      //hitStreakWiggle = true;
      hits++;
      hit_streak++;
      let nextTarget = getTargetBounds(trials[current_trial + 1]);
      let distance = dist(nextTarget.x, nextTarget.y, mouseX, mouseY);
      let width = nextTarget.w;
      fitts = Math.log2(distance / width + 1);
    } else {
      var audio = new Audio("sounds/Super Mario Firework Sound.mp3");
      audio.play();

      misses++;
      lives--;
      hit_streak = 0;
    }
    if (current_trial < 47) {
      fitts_IDs.push(fitts);
    }

    current_trial++; // Move on to the next trial/target

    // Check if the user has completed all 48 trials
    if (current_trial === trials.length) {
      testEndTime = millis();
      draw_targets = false; // Stop showing targets and the user performance results
      printAndSavePerformance(); // Print the user's results on-screen and send these to the DB
      attempt++;

      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton("START 2ND ATTEMPT");
        continue_button.mouseReleased(continueTest);
        continue_button.position(
          width / 2 - continue_button.size().width / 2,
          height / 2 - continue_button.size().height / 2
        );
      }
    }
  }
}

function drawVector() {
  let fillColor = "white";
  if (current_trial < 47) {
    let target = getTargetBounds(trials[current_trial]);
    let v0 = createVector(target.x, target.y);
    let nextTarget = getTargetBounds(trials[current_trial + 1]);
    let v1 = createVector(nextTarget.x, nextTarget.y);
    push();
    stroke(fillColor);
    strokeWeight(3);
    fill(fillColor);
    line(v0.x, v0.y, v1.x, v1.y);
    pop();
    push();
    if (nextTarget.y != target.y || nextTarget.x != target.x) {
      fill(fillColor);
      translate(target.x, target.y);
      if (nextTarget.y - target.y === 0) {
        if (nextTarget.x - target.x < 0) rotate(PI);
        else if (nextTarget.x - target.x > 0) rotate(0);
      } else if (nextTarget.x - target.x < 0)
        rotate(
          PI + Math.atan((nextTarget.y - target.y) / (nextTarget.x - target.x))
        );
      else
        rotate(
          Math.atan((nextTarget.y - target.y) / (nextTarget.x - target.x))
        );
      triangle(
        target.w,
        0,
        target.w / 3 + 20,
        -(target.w / 6),
        target.w / 3 + 20,
        target.w / 6
      );
    }
    pop();
  }
}

// Draw target on-screen
function drawTarget(i) {
  // Get the location and size for target (i)
  let target = getTargetBounds(i);

  // Highlights next target
  if (trials[current_trial] === i) {
    imageMode(CENTER);
    image_red_mushroom.resize(target.w, target.w);
    image(image_red_mushroom, target.x, target.y);

    if (current_trial < 47 && trials[current_trial + 1] === i) {
      stroke(color(255, 255, 0));
      strokeWeight(8);
      noFill();
      circle(target.x, target.y, target.w);
    }
  }

  // Check whether this target is the target the user should be trying to select
  else if (current_trial < 47 && trials[current_trial + 1] === i) {
    // Remember you are allowed to access targets (i-1) and (i+1)
    // if this is the target the user should be trying to select
    //
    //fill(color(255, 0, 0));
    imageMode(CENTER);
    image_yellow_mushroom.resize(target.w, target.w);
    image(image_yellow_mushroom, target.x, target.y);
  }

  // Does not draw a border if this is not the target the user
  // should be trying to select
  else {
    noStroke();

    // Draws the target
    fill(color(125, 125, 125)); // Não pode ser menos!
    circle(target.x, target.y, target.w);
  }
}

// Returns the location and size of a given target
function getTargetBounds(i) {
  var x =
    parseInt(LEFT_PADDING) +
    parseInt((i % 4) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);
  var y =
    parseInt(TOP_PADDING) +
    parseInt(Math.floor(i / 4) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);

  return new Target(x, y, TARGET_SIZE);
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
  // Re-randomize the trial order
  shuffle(trials, true);
  current_trial = 0;
  print("trial order: " + trials);

  // Resets performance variables
  hits = 0;
  misses = 0;
  fitts_IDs = [];
  lives = 3;
  hit_streak = 0;

  continue_button.remove();

  // Shows the targets again
  draw_targets = true;
  testStartTime = millis();
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  let display = new Display({ diagonal: display_size }, window.screen);

  // DO NOT CHANGE THESE!
  PPI = display.ppi; // calculates pixels per inch
  PPCM = PPI / 2.54; // calculates pixels per cm
  TARGET_SIZE = 1.5 * PPCM; // sets the target size in cm, i.e, 1.5cm
  TARGET_PADDING = 1.5 * PPCM; // sets the padding around the targets in cm
  MARGIN = 1.5 * PPCM; // sets the margin around the targets in cm

  // Sets the margin of the grid of targets to the left of the canvas (DO NOT CHANGE!)
  LEFT_PADDING = width / 2 - TARGET_SIZE - 1.5 * TARGET_PADDING - 1.5 * MARGIN;

  // Sets the margin of the grid of targets to the top of the canvas (DO NOT CHANGE!)
  TOP_PADDING = height / 2 - TARGET_SIZE - 1.5 * TARGET_PADDING - 1.5 * MARGIN;

  // Starts drawing targets immediately after we go fullscreen
  draw_targets = true;
}
