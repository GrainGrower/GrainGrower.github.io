"use strict";

document.addEventListener("DOMContentLoaded", function() {

const body = document.querySelector("body");
const betInput = document.querySelector(".bet_input");
const cashCounter = document.querySelector(".current_cash");
const betCounter = document.querySelector(".current_bet");
const currentBetCounter = document.querySelector(".current_bet_counter");
const betButton = document.querySelector(".bet_button");

const dealerHand = document.querySelector(".dealer_hand");
const dealerHandShift = dealerHand.querySelector(".shift");
const playerHand = document.querySelector(".player_hand");

// валідатор умови ставки
let validate = true;

// грощі в грі
let bank = 0;

// стартові грощі
let playerMoney = 200;

// значення мінімальної ставки
const minimumBet = 2;

// створення колоди та рук гравців
let deck = [];
let playerHand1Arr = [];
let dillerHandArr = [];

// Input. мінімальне та максимальне значення інпута
betInput.min = minimumBet;
betInput.max = playerMoney;

// "Ви маєте:" Формувач правильного значень $ та с
if (String(playerMoney).length > 2) {
	cashCounter.textContent = `${Number(playerMoney/100).toFixed(2)}$`;
} else {
	cashCounter.textContent = `playerMoney + "¢"`
}

// "Затвердити ставку" обробник події
betButton.addEventListener("click", function(event) {
	event.preventDefault();
	acceptBet();
});

// функція невиконання умови input
function inputFail(){
	currentBetCounter.style.color = "red";
		betInput.classList.add("input_alert");
		validate = false;
};

// обробник події зміни поточного значення input 
betInput.addEventListener("input", function(event) {
	let bet = event.target.value;
	betInput.classList.remove("input_alert");
	currentBetCounter.style.color = "black";
	if (String(bet).includes(".")) {
		currentBetCounter.textContent = "Дрібні значення - неприпустимі";
		inputFail();
	} else if (bet < minimumBet) {
		currentBetCounter.textContent = "Ваша ставка менша за мінімальну";
		inputFail();
	} else if (bet > playerMoney) {
		currentBetCounter.textContent = "Недостатньо грошей";
		inputFail();
	} else {
		if (String(bet).length >= 3) {
				bet = bet/100 + "$";
			} else {
				bet = bet + "¢";
			}
	currentBetCounter.textContent = `Поточна ставка: ${bet}`;
	validate = true;
	};	
	
});





createCards(deck);

// створення колоди
function createCards(arr){
	for(let j = 0; j <= 3; j++){
		for(let i = 1; i <= 13; i++) {
			let element = [];
			if(i == 1) {
				element.push("ace");
			} else if(i == 11) {
				element.push("jack");
			} else if(i == 12) {
				element.push("dame");
			} else if(i == 13) {
				element.push("king");
			} else {
				element.push(i);
			}
			addSuit(element, j);
			element.push(Math.random());
			element.push(`${element[0]} of ${element[1]}`);
			arr.push(element);
		}
	}
	arr.sort( (a, b) => a[2] - b[2] );
}

// додавання картам масті
function addSuit(card, suit){
			if(suit == 0){
				card.push("clubs");
			}
			if(suit == 1){
				card.push("diamonds");
			}
			if(suit == 2){
				card.push("hearts");
			}
			if(suit == 3){
				card.push("spades");
			}
}

function sumator(arg) {
	let sum = [0,0]; 
	for (let i=0; i<arg.length; i++) {
		if (typeof arg[i][0] === "number") {
			sum[0] += arg[i][0];
		} else if (arg[i][0] !== "ace") {
			sum[0] += 10;
		} else {
			sum[0] += 11;
			sum[1] += 1;
		}
	}
	while (sum[0] > 21 && sum[1] != 0) {
			sum[0] -= 10;
			sum[1] -= 1;
	}
	return sum[0];
};

function playerGiveCard(arr, i){
	playerHand1Arr.push(arr[arr.length - 1]);
	arr.pop();
	playerHand.innerHTML += `<img class="card" src="cards/${playerHand1Arr[i][3]}.png"></div>`;
}

function dealerGiveCard(arr, i){
	dillerHandArr.push(arr[arr.length - 1]);
	arr.pop();
	if (i===1) {
		dealerHand.innerHTML += `<img class="card shift" src="cards/shift.png"></div>`;
		dealerHand.innerHTML += `<img class="card shifted hide" src="cards/${dillerHandArr[i][3]}.png"></div>`;
		const dealerHandShift = dealerHand.querySelector(".shift");
		const dealerHandShifted = dealerHand.querySelector(".shifted");
	} else {
		dealerHand.innerHTML += `<img class="card" src="cards/${dillerHandArr[i][3]}.png"></div>`;
	}
}

// перша раздача карт гравцеві та ділеру
function distributionCards(arr) {
	playerHand.innerHTML = "";
	dealerHand.innerHTML = "";
	playerHand1Arr = [];
	dillerHandArr = [];
	for (let i = 0; i < 2; i++){
		playerGiveCard(arr, i);
		dealerGiveCard(arr, i);
	}
	console.log(playerHand1Arr);
	console.log(`Гравець: ${sumator(playerHand1Arr)}`);
	console.log(dillerHandArr);
	console.log(`Ділер: ${sumator(dillerHandArr)}`);
}
	
function blackjackTest() {
	if(dillerHandArr[0][0] === "ace") {
		console.log("!!!");
	};
}
	
	
	//автоблекджек
	if(sumator(playerHand1Arr) === 21) {
		playerMoney += Math.floor(bank * 1.5);
		bank = 0;
		console.log("Гравець переміг! Автоблекджек! Виграш 3:2");
	};
	
	

	
	if(sumator(dillerHandArr) === 21) {
		bank = 0;
		console.log("Гравець програв! В ділера блекджек!");
	};
	
/* 	console.log(deck); */
	/* console.log (sumator([["ace"],["ace"],["ace"]])); */


function acceptBet(){
	const toggleVisibleBetForm = document.querySelector(".bet_field");
	const toggleVisibleActionForm = document.querySelector(".action_field");
	toggleVisibleBetForm.classList.toggle("hide");
	toggleVisibleActionForm.classList.toggle("hide");
	if (validate) {
		let bet = betInput.value;
		bank = bet;
		playerMoney = playerMoney - bet;

		currentCashChanger();
		distributionCards(deck);
		blackjackTest();
		returnDefault();
	}
}

function currentCashChanger(){
	if (String(playerMoney).length >= 3) {
		console.log(`Грошей у гравця: ${playerMoney}`);
			cashCounter.textContent = (playerMoney/100).toFixed(2) + "$";
	} else {
		cashCounter.textContent = playerMoney + "¢";
	}
}

function returnDefault(){
	betInput.value = minimumBet;
	if (String(minimumBet).length > 2) {
		currentBetCounter.textContent = `${Number(playerMoney/100).toFixed(2)}$`;
	} else {
		currentBetCounter.textContent = `Поточна ставка: ${minimumBet}¢`;	
	};
	if (playerMoney < minimumBet) {
		currentBetCounter.textContent = "Недостатньо грошей";
		currentBetCounter.style.color = "red";
		betInput.classList.add("input_alert");
		validate = false;
	}
	betInput.min = minimumBet;
	betInput.max = playerMoney;
}




});