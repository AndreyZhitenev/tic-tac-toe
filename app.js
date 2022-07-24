let game = document.querySelector(".game"),
	res = document.querySelector(".res"),
	btnGame = document.querySelector(".new-game"),
	fields = document.querySelectorAll(".field"),
	touchSound = new Audio("audio/touch.mp3"),
	winSound = new Audio("audio/win.mp3"),
	loseSound = new Audio("audio/lose.mp3"),
	step = false,
	count = 0,
	circle = `<svg class="circle" width="24" height="24" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 19.0926C15.9171 19.0926 19.0926 15.9171 19.0926 12C19.0926 8.08287 15.9171 4.90741 12 4.90741C8.08287 4.90741 4.90741 8.08287 4.90741 12C4.90741 15.9171 8.08287 19.0926 12 19.0926Z" fill="white"/>
</svg>`,
	cross = `
	<svg class="cross "fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/></svg>`;

function stepCross(target) {
	target.innerHTML = cross;
	target.classList.add("x");
	touchSound.play();
	count++;
}

function stepZero(target) {
	target.innerHTML = circle;
	target.classList.add("o");
	touchSound.play();
	count++;
}

function init(e) {
	if (!step) stepCross(e.target);
	else stepZero(e.target);
	step = !step;
	win();
}

function newGame() {
	step = false;
	count = 0;
	res.innerText = "";
	fields.forEach((item) => {
		item.innerHTML = "";
		item.classList.remove("x", "o", "active");
	});
	game.addEventListener("click", init);
}

function win() {
	let comb = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < comb.length; i++) {
		if (
			fields[comb[i][0]].classList.contains("x") &&
			fields[comb[i][1]].classList.contains("x") &&
			fields[comb[i][2]].classList.contains("x")
		) {
			setTimeout(() => {
				fields[comb[i][0]].classList.add("active");
				fields[comb[i][1]].classList.add("active");
				fields[comb[i][2]].classList.add("active");
				res.innerHTML = "X is winner!";
				winSound.play();
			}, 750);
			game.removeEventListener("click", init);
		} else if (
			fields[comb[i][0]].classList.contains("o") &&
			fields[comb[i][1]].classList.contains("o") &&
			fields[comb[i][2]].classList.contains("o")
		) {
			setTimeout(() => {
				fields[comb[i][0]].classList.add("active");
				fields[comb[i][1]].classList.add("active");
				fields[comb[i][2]].classList.add("active");
				res.innerHTML = "O is winner!";
				winSound.play();
			}, 750);
			game.removeEventListener("click", init);
		} else if (count == 9) {
			res.innerHTML = "Draw";
			game.removeEventListener("click", init);
		}
	}
}

btnGame.addEventListener("click", newGame);
game.addEventListener("click", init);
