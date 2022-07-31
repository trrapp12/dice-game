(() => {
  // due to the type of font that is downloaded that will show dice as dot values instead of numbers, to get the right display for a dice we have to refer to it by the letter corresponding to the font.  Therefore it became useful to create an array of objects that associated the number value and letter that it corresponded to.
  const objArray = [
    {
      letter: "k",
      sidevalue: 1,
    },
    {
      letter: "l",
      sidevalue: 2,
    },
    {
      letter: "m",
      sidevalue: 3,
    },
    {
      letter: "n",
      sidevalue: 4,
    },
    {
      letter: "o",
      sidevalue: 5,
    },
    {
      letter: "p",
      sidevalue: 6,
    },
  ];

  // grab necessary elements that need to be populated

  const diceOne = document.getElementById("dice-1");
  const diceTwo = document.getElementById("dice-2");
  const scoreOneContainer = document.getElementById("score-1");
  const scoreTwoContainer = document.getElementById("score-2");
  const messageContainer = document.getElementById("message");
  const button = document.getElementById("button");
  const optionsOne = document.getElementById("options-1");
  const diceClassList1 = document.getElementById("dice-1").classList;
  const diceClassList2 = document.getElementById("dice-2").classList;

  let player1score = 0;
  let player2score = 0;
  let player1turn;

  // create functions
  function produceRandomNumber(maxvalue, startvalue) {
    return Math.floor(Math.random() * maxvalue + startvalue);
  }

  function setDisplayNumber(objArray, num) {
    return objArray[num - 1].letter;
  }

  function updateScore(player1turn, randNum) {
    if (player1turn) {
      player1score += objArray[randNum - 1].sidevalue;
    } else {
      player2score += objArray[randNum - 1].sidevalue;
    }
  }

  function updatePlayerMessage(player1turn, player1score, player2score) {
    scoreOneContainer.textContent = player1score;
    scoreTwoContainer.textContent = player2score;
  }

  function updateDice(objArray, randNum, func) {
    if (player1turn) {
      diceOne.textContent = setDisplayNumber(objArray, randNum);
    } else {
      diceTwo.textContent = setDisplayNumber(objArray, randNum);
    }
  }

  function displayButtonMessage(string) {
    button.textContent = string;
  }

  function addWobbleAnimation() {
    messageContainer.classList.add("wobble");
  }

  function removeWobbleAnimation() {
    messageContainer.classList.remove("wobble");
  }

  function toggleDice1Animation() {
    diceClassList1.toggle("dice-animation");
  }

  function toggleDice2Animation() {
    diceClassList2.toggle("dice-animation");
  }

  function removeDiceAnimation() {
    diceClassList1.remove("dice-animation");
    diceClassList2.remove("dice-animation");
  }

  function changeMessage(player1turn) {
    console.log("CHANGE MESSAGE");
    if (player1turn) {
      messageContainer.textContent = "Player 2's turn!";
    } else {
      messageContainer.textContent = "Player 1's turn";
    }
  }

  function playerRolls(player1turn, objArray) {
    let randNum = produceRandomNumber(6, 1);

    if (player1turn) {
      updateScore(player1turn, randNum);
      updateDice(objArray, randNum, setDisplayNumber);
      toggleDice1Animation();
      setTimeout(removeDiceAnimation, 1000);
      updatePlayerMessage(player1turn, player1score, player2score);
    } else {
      updateScore(player1turn, randNum);
      updateDice(objArray, randNum, setDisplayNumber);
      toggleDice2Animation();
      setTimeout(removeDiceAnimation, 1000);
      updatePlayerMessage(player1turn, player1score, player2score);
    }
  }

  function determineWhoRollsFirst() {
    let a = produceRandomNumber(2, 0);
    console.log(`DETERMINE WHO ROLLS FIRST (): random number is ${a}`);
    if (a === 0) {
      player1turn = true;
      console.log(
        `DETERMINE WHO ROLLS FIRST (), if statement: player1 is ${player1turn}`
      );
      messageContainer.textContent = "Player 1 goes first";
    } else {
      player1turn = false;
      console.log(
        `DETERMINE WHO ROLLS FIRST (), else statement: player1 is ${player1turn}`
      );
      messageContainer.textContent = "Player 2 goes first";
    }
  }

  function resetGame() {
    player1score = 0;
    player2score = 0;
    player1turn = undefined;

    scoreTwoContainer.textContent = " - ";
    scoreOneContainer.textContent = " - ";
    removeWobbleAnimation();
    setTimeout(() => {
      messageContainer.textContent = "Click or shake to see who plays first";
    }, 50);
  }

  function checkForWinner(player1score, player2score) {
    console.log("CHECK FOR WINNER");
    if (player1score >= 20 && player2score < 20) {
      messageContainer.textContent = "Player 1 wins";
      addWobbleAnimation();
      setTimeout(resetGame, 3000);
    } else if (player2score >= 20 && player1score < 20) {
      messageContainer.textContent = "Player 2 wins";
      addWobbleAnimation();
      setTimeout(resetGame, 3000);
    } else if (player1score === 20 && player2score === 20) {
      messageContainer.textContent = "It's a tie!";
      addWobbleAnimation();
      setTimeout(resetGame, 3000);
    } else {
      changeMessage(player1turn);
    }
  }

  // creates a handler functions and associated throttled function that will only run once every 200ms and a handler to go with it

  function throttled(delay, fn) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    };
  }

  const shakeHandler = (evt) => {
    if (evt.rotationRate.beta > 100) {
      if (player1turn === undefined) {
        console.log(`CLICK EVENT, IF STATEMENT: ${player1turn}`);
        determineWhoRollsFirst();
        displayButtonMessage("Roll!");
      } else {
        console.log(`CLICK EVENT, ELSE STATEMENT: ${player1turn}`);
        playerRolls(player1turn, objArray);
        checkForWinner(player1score, player2score);
        player1turn = !player1turn;
      }
    }
  };

  const shakeThrottled = throttled(200, shakeHandler);

  const loadHandler = () => {
    let a = produceRandomNumber(6, 1);
    let b = produceRandomNumber(6, 1);
    toggleDice1Animation();
    toggleDice2Animation();
    setTimeout(removeDiceAnimation, 3000);
    diceOne.textContent = setDisplayNumber(objArray, a);
    diceTwo.textContent = setDisplayNumber(objArray, b);
    displayButtonMessage("Start Game");
  };

  const clickHandler = () => {
    console.log(`CLICK EVENT: player 1 is ${player1turn}`);
    if (player1turn === undefined) {
      console.log(`CLICK EVENT, IF STATEMENT: ${player1turn}`);
      determineWhoRollsFirst();
      displayButtonMessage("Roll!");
    } else {
      console.log(`CLICK EVENT, ELSE STATEMENT: ${player1turn}`);
      playerRolls(player1turn, objArray);
      checkForWinner(player1score, player2score);
      player1turn = !player1turn;
    }
    evt.preventDefault();
  };

  const touchHandler = (evt) => {
    evt.preventDefault();
    console.log(`TOUCH EVENT: player 1 is ${player1turn}`);
    if (player1turn === undefined) {
      console.log(`TOUCH EVENT, IF STATEMENT: ${player1turn}`);
      determineWhoRollsFirst();
      displayButtonMessage("Roll!");
    } else {
      console.log(`TOUCH EVENT, ELSE STATEMENT: ${player1turn}`);
      playerRolls(player1turn, objArray);
      checkForWinner(player1score, player2score);
      player1turn = !player1turn;
    }
  };

  const keyHandler = (evt) => {
    if (evt.key === "Enter") {
      if (player1turn === undefined) {
        console.log(`CLICK EVENT, IF STATEMENT: ${player1turn}`);
        determineWhoRollsFirst();
        displayButtonMessage("Roll!");
      } else {
        console.log(`CLICK EVENT, ELSE STATEMENT: ${player1turn}`);
        playerRolls(player1turn, objArray);
        checkForWinner(player1score, player2score);
        player1turn = !player1turn;
      }
    } else if (
      evt.key === "Tab" ||
      evt.key === "ArrowLeft" ||
      evt.key === "Left" ||
      evt.key === "ArrowUp" ||
      evt.key === "Up" ||
      evt.key === "ArrowRight" ||
      evt.key === "Right" ||
      evt.key === "ArrowDown" ||
      evt.key === "Down" ||
      evt.key === " "
    ) {
      console.log("nothing to see here");
    } else {
      alert("Please use the Enter key make selections");
    }
  };
  // add event listeners

  window.addEventListener("load", loadHandler);

  button.addEventListener("click", clickHandler);

  button.addEventListener("touchend", touchHandler);

  button.addEventListener("keyup", keyHandler);

  window.addEventListener("devicemotion", shakeThrottled);
})();
