/* tdl

board buttons disabled while simon goes

only detecting first player error...

20 goes
implement strict mode

User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

User Story: I can see how many steps are in the current series of button presses.

User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

*/


(document).addEventListener('DOMContentLoaded', function() {

	'use strict'

	// SOUNDS
	//var rSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
	//var gSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
	//var ySound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
	//var bSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')

	// DOM ELEMENTS
	var r = document.getElementById('r');
	var g = document.getElementById('g');
	var y = document.getElementById('y');
	var b = document.getElementById('b');
	var container = document.getElementById('container');
	var controls = document.getElementById('controls');
	var togglePower = document.getElementById('toggle-switch');
	var messageScreenDiv = document.getElementById('messageScreen');
	var controlButtons = document.getElementsByClassName('control-btn');
	var pieceButtons = document.getElementsByClassName('pieces');
	var startButton = document.getElementById('start');
	var resetButton = document.getElementById('reset');
	var strictButton = document.getElementById('strict');
	var overlayDiv = document.getElementById('overlay');
	var overlayToggleButton = document.getElementById('overlayToggle');

	// trigger lightUpPlay event on click;
	// put this into a function to enable/disable...
	r.addEventListener('click', lightUpPlay);
	g.addEventListener('click', lightUpPlay);
	y.addEventListener('click', lightUpPlay);
	b.addEventListener('click', lightUpPlay);

	overlayToggleButton.addEventListener('click', toggleOverlay);

	var INIT = (function(){

	  var finalScore = 1;
	  var isOn = false;
    var okSoFar = true;

	  return {

			powerState: function(){
				return isOn;
			},

      okSoFar: function(){
      	return okSoFar;
      },

		  togglePower: function(){
			  isOn = !isOn;
			  startButton.disabled = !startButton.disabled;
			  resetButton.disabled = !resetButton.disabled;
			  strictButton.disabled = !strictButton.disabled;

				pieceButtons.disabled = !pieceButtons.disabled;
		  },

			enableColorButtons: function(){
					r.disabled = false;
					y.disabled = false;
					g.disabled = false;
					b.disabled = false;
			},
			disableColorButtons: function(){
				r.disabled = true;
				y.disabled = true;
				g.disabled = true;
				b.disabled = true;
			},

		  start: function(){

				DISPLAY.showMessage('START', 500);
				DISPLAY.showMessage('PLAY', 2000);
				DISPLAY.clearMessage(3500);

				setTimeout(function() {
					SIMON.simulate();
				}, 4500);

		  },

		  strict: function(){
			 return false;
		  },

		 reset: function(){
			finalScore = PLAYER.score();
			DISPLAY.showMessage('RESET', 100);
			DISPLAY.showMessage('SCORE ' + finalScore, 1750);
			DISPLAY.clearMessage(3500);
			SIMON.resetMovesArray();
			PLAYER.resetMovesArray();
		 },

		 resetMovesArray: function(){
			moves = [];
		 }

	};
})();

var SIMON = (function(){
	  var moves = [];
	  var rgby = [r, g, b, y];
	  var isSIMONturn = false;
	  var endGame = false;
	  var repeating = false;
	  var strict = false;

	  var addMove = function(){
		  var newPiece = rgby[ Math.floor(Math.random() * 4) ]; // adding one of the r, g, b, y elements to the array
			moves.push(newPiece);
	  };

	  return{
		 simonMoves: function(){
			return moves;
		 },
		 isSimonTurn: function(){
			return isSIMONturn;
		 },
		 simonTurnFalse: function(){
			isSIMONturn = false;
			return isSIMONturn;
		 },
		 simonTurnTrue: function(){
			isSIMONturn = true;
			return isSIMONturn;
		 },
		 endGame: function(){
			return endGame;
		 },
		 /*strict: function(){
			return strict;
		},*/
		 resetMovesArray: function(){
			moves = [];
			console.log('simon moves = ' + moves.length);
		 },
		 movesArrayPop: function(){
			console.log(moves);
			moves.pop();
			console.log(moves);
		 },

		 simulate: function(){

			var goNumber = moves.length + 1;
			DISPLAY.showMessage('ROUND ' + goNumber, 0);
			console.log('Round = ' + goNumber);

			var isPlayerTryingAgain = false;
			//console.log('isPlayerTryingAgain = ' + isPlayerTryingAgain);

			if (isPlayerTryingAgain === false){
				addMove();
			}
			if (!INIT.powerState()){
			   return null;
			}

			PLAYER.resetMovesArray();

			//Simon's turn...
			for (let i = 0; i <= moves.length - 1; i++) {
				//overlayDiv.style.display = 'block';
				setTimeout( function() {
					isSIMONturn = true;
					if (moves[i]) {
						moves[i].click(); //call lightUpPlay
						overlayToggleButton.click();
					}
				   //console.log('moves ' + moves[i]);
				}, i * 1000 );
			}
		},
	};
	})();

	function toggleOverlay(event){

		var disableTime = SIMON.simonMoves();
		disableTime = disableTime.length;
		overlayDiv.style.display = 'block';
		setTimeout( function() {
			overlayDiv.style.display = 'none';
		}, disableTime * 1000 );

	}

/* if I make a mistake on the first click = error. No error on next clixk though

/********************************/
	function lightUpPlay(e){

		let clickedItem = e.target;

		var playerMoves = PLAYER.playerMoves();
		var playerAnswer;
		var simonMoves = SIMON.simonMoves();
		var isItSimonsTurn = false;

		// helper function to lighten the clicked item's color
		let computeLightUpColor = () => {
			let rColor = originalRGB[0].replace('rgb(', '');
			let gColor = originalRGB[1].replace(' ', '');
			let bColor = originalRGB[2].replace(')', '');

			rColor = +rColor + 50 > 255 ? 255 : +rColor + 50;
			gColor = +gColor + 50 > 255 ? 255 : +gColor + 50;
			bColor = +bColor + 50 > 255 ? 255 : +bColor + 50;
			let newRGB = `rgb(${rColor}, ${gColor}, ${bColor})`;
			return newRGB;
		}

		isItSimonsTurn = SIMON.isSimonTurn();

		if (!isItSimonsTurn){
			PLAYER.addPlayerMove(e.target.id);

			//rename to ?? playerGoResult??
			playerAnswer = PLAYER.playerInput()
			//console.log('playerAnswer = ' + playerAnswer);

			/*******************************/
			if (playerAnswer === true){ //wrong
				console.log('loooose');
				//PLAYER.loses();
			}
		}

		SIMON.simonTurnFalse();

		let originalRGB = window.getComputedStyle(clickedItem, null).getPropertyValue("background-color").split(',');
		clickedItem.style.background = computeLightUpColor(originalRGB);

		//let currentSound = eval(`${e.target.id}Sound`);
		//currentSound.play();

		setTimeout(function(){
			clickedItem.style.background = originalRGB;
		}, 250);

		//console.log('playerMoves length = ' + playerMoves.length);
		//console.log('simonMoves length = ' + simonMoves.length);

		//ends player turn - simon will go again
		if (playerMoves.length === simonMoves.length && !SIMON.endGame()){
			setTimeout( function() {
				SIMON.simulate();
			}, 1500);
		}
}
// end lightUpPlay function

/********************************/

	var PLAYER = (function(){
		var moves = [];
		var simonMoves;
		var playerMoves;
		var answer = true;
    var score;
		var tryingAgain = false;

		return {

			score: function(){
				var score = SIMON.simonMoves();
				var score = score.length - 1;
				if(score < 0) {
					score = 0;
				}
				return score;
			},

			tryingAgain: function(){
				return tryingAgain;
			},

			addPlayerMove: function(move){
				moves.push(move);
				console.log('player moves array = ' + moves);
			},

			playerInput: function(){

				var checkArray = [];

				simonMoves = SIMON.simonMoves();
				//playerMoves = gogetuptodatemovesffs
				//console.log('simonMoves length = ' + simonMoves.length);
				//console.log('players input ' + moves);

				/** Test EACH click against simons **/
				for(let i = 0; i < simonMoves.length; i++){
				//debugger;
					//console.log('player moves = ' + moves);
					console.log(i);
					var singleSimon = simonMoves[i].id;
					var singlePlayer = moves[i];

          if(singlePlayer === undefined){
              //console.log('undefined!');
				  } else if(singleSimon === singlePlayer) {
							answer = true;
							//console.log('player ' + moves);
							checkArray.push(simonMoves[i].id);
							//console.log('simon ' + checkArray);
							console.log('player answer is ' + answer);
							//
					} else {
						answer = false;
						//DISPLAY.flashMessage(['WRONG', 'TRY AGAIN']);
						console.log('player answer is ' + answer);
						console.log('player = ' + singlePlayer);
						console.log('simon = ' + singleSimon);
						PLAYER.loses();
						//return answer;
					}



				}
				//return true;
			},

			playerMoves: function(){
				return moves;
			},

			loses: function(){
			DISPLAY.showMessage('WRONG', 50);
			DISPLAY.showMessage('TRY AGAIN', 1500);

			//all four sounds at once to indicate error
			//rSound.play();
			//bSound.play();
			//gSound.play();
			//bSound.play();

			var finalScore = PLAYER.score();
			//DISPLAY.flashMessage(['RESET', `SCORE: ${finalScore}`]);
			//PLAYER.resetMovesArray();
			//SIMON.resetMovesArray();

			if(INIT.strict()){
				console.log('Big Loser!!');
				//big lose function
			} else {
				tryingAgain = true;
				setTimeout(function() {
					SIMON.simulate();
				}, 3500);
			}

			/*if (SIMON.strict){
			//SIMON.endGame = true;
			//SIMON.flashMessage([`INCORRECT`, 'SCORE: ' + SIMON.moves.length]);
			SIMON.resetMovesArray();
			moves = [];
			} else {
			//SIMON.repeating = true;
			//SIMON.flashMessage(['INCORRECT', 'TRY AGAIN']);
			//setTimeout(() => SIMON.simulate(), 5500);
			}*/
			},

			wins: function(){
			},

			resetMovesArray: function(){
				moves = [];
				//console.log('player moves = ' + moves.length);
			}
		};
	})();

/*******************/
  var DISPLAY = (function(){

		var messageDisplayTime = 1500;
		messageScreen.style.color = '#15BF3B';

		return {

			showMessage: function(message, delay){
					setTimeout(function() {
						messageScreenDiv.innerText = message;
					}, delay);
			},//showMessage

			clearMessage: function(delay){
				setTimeout(function() {
					messageScreenDiv.innerText = '';
				}, delay);
			} //clearMessage

		}; //return

	})();
/**********************/

  togglePower.addEventListener("click", INIT.togglePower);
	resetButton.addEventListener('click', INIT.reset);
	startButton.addEventListener('click', INIT.start);
	strictButton.addEventListener('click', INIT.strict);
})
