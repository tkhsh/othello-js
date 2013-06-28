$(function() {
	//オセロ盤のサイズを定義
	var boardSize = 4;
	// オセロ盤のglobal変数
	var board = new Array(boardSize*boardSize);
	// オセロ盤を初期化
	for(var i = 0; i < board.length; i++) {
		board[i] = "□";
	}
	var half = boardSize >> 1;
	board[parsePosition(half-1, half-1) ] = "○";
	board[parsePosition(half, half-1)] = "●";
	board[parsePosition(half-1, half)] = "●";
	board[parsePosition(half, half)] = "○";

	function parsePosition(x, y) {
		return y*4 + x%4;
	}

	// オセロ盤を表示する
	function draw() {
		// 配列boardをStringに変換
		var boardStr = "";
		for(var i = 0; i < board.length; i++) { 
			if(i%boardSize == 0) {
				boardStr += "\n"
			}
			boardStr += board[i];
		}
		// pre要素に表示させる
		document.getElementById("display").innerHTML = boardStr;
	}

	var turn = true; // 順番を判定するフラグ
	$('#snap').click(function () {
		var tmpPosition = document.getElementById("position").value;
		var position = parseInt(tmpPosition);

		if(flipDetection(position, true)) {
			//プレイヤーの順番
			board[position] = "●";
			flip(position, true)
			turn = false;
			document.getElementById("turn").innerHTML = "白の番です。"

			//computerの順番
			var bestPos = searchBestMove();
			board[bestPos] = "○";
			flip(bestPos, false);
			turn = true;
			document.getElementById("turn").innerHTML = "黒の番です。"
		}

		draw();
	});

	//石が置けるか判定
	function moveDetection(stonePos, myStoneColor) {
		// エラーチェック
		if(board[stonePos] != "□") {
			console.log("エラー：同じ場所には置けません");
			return false;
		}
		if(!(stonePos >= 0 && stonePos <= 15)) {
			console.log("エラー：0~15までの半角の数を入力してください");
			return false;
		}

		var myStone;
		var oppositeStone;
		if(myStoneColor == true) {
			myStone = "●";
			oppositeStone = "○";
		} else　if(myStoneColor == false) {
			myStone = "○";
			oppositeStone = "●";
		}

		var canSnap = false; // 石がおけるか？

		for(var dx = -1; dx <= 1; dx++) {
			for(var dy = -1; dy <= 1; dy++) {

				var posX = stonePos%boardSize;
				var posY = Math.floor(stonePos/boardSize); // 整数の値をとる
				var isContinueSearch = true;
				var differentStones = [];

				while(isContinueSearch) {
					posX += dx;
					posY += dy;

					if(posX < 0 || posX > boardSize) { //端まできたときにsearchを終了
						break;
					} else if (posY < 0 || posY > boardSize) {
						break;
					}

					var boardNum = posY*boardSize + posX%boardSize;

					if(board[boardNum] == oppositeStone) { // 検索結果が異なる色なら
						differentStones.push(boardNum);
						//同じ方向にもう一マス進み、検索する。

					} else if(board[boardNum] == myStone) { // 検索結果が同じ色なら
						isContinueSearch = false;
						if(differentStones.length != 0) {
							canSnap = true;
						}
					} else { // 間にスペースのある場合
						isContinueSearch = false;	// 石が置けない
					}
				}
			}
		}
		return canSnap;
	}

	function searchBestMove() {
		var bestMove; //　最もいい手を記録する flipDetection(i, false)
		var availableMoves = [];
		for(var i = 0; i < board.length; i++) {
			if(flipDetection(i, false)) {
				console.log(i);
				availableMoves.push(i);
			}
		}

		// availableMovesからbestMoveを選ぶ
		bestMove = availableMoves[0];
		for(var i = 0; i < availableMoves.length-1; i++) {
			var tmpY1 = Math.floor(availableMoves[i]/boardSize);
			var tmpY2 = Math.floor(availableMoves[i+1]/boardSize);
			if(tmpY1 > tmpY2) {
				bestMove = availableMoves[i+1];
			} else if (tmpY1 == tmpY2) {
				var tmpX1 = availableMoves[i] % boardSize;
				var tmpX2 = availableMoves[i+1] % boardSize;
				if(tmpX1 > tmpX2) {
					bestMove = availableMoves[i+1];
				}
			}
		}

		return bestMove;
	}

	function flip(movePos, myStoneColor) {
		/*
		for(var i = 0; i < differentStones.length; i++) {
			var tmp = differentStones[i];
			board[tmp] = myStone;
		}
		*/
		var myStone;
		var oppositeStone;
		if(myStoneColor == true) {
			myStone = "●";
			oppositeStone = "○";
		} else　if(myStoneColor == false) {
			myStone = "○";
			oppositeStone = "●";
		}

		for(var dx = -1; dx <= 1; dx++) {
			for(var dy = -1; dy <= 1; dy++) {
				var posX = movePos%boardSize;
				var posY = Math.floor(movePos/boardSize); // 整数の値をとる
				var isContinueSearch = true;
				var differentStones = [];

				while(isContinueSearch) {
					posX += dx;
					posY += dy;

					if(posX < 0 || posX > boardSize) { //端まできたときにsearchを終了
						break;
					} else if (posY < 0 || posY > boardSize) {
						break;
					}

					var boardNum = posY*boardSize + posX%boardSize;
					console.log(" boardNum:" + boardNum);

					if(board[boardNum] == oppositeStone) { // 検索結果が異なる色なら
						differentStones.push(boardNum);
						//同じ方向にもう一マス進み、検索する。

					} else if(board[boardNum] == myStone) { // 検索結果が同じ色なら
						isContinueSearch = false;
						if(differentStones.length != 0) {
							// canSnap = true;
							for(var i = 0; i < differentStones.length; i++) {
								var tmp = differentStones[i];
								board[tmp] = myStone;
							}
						}
					} else { // 間にスペースのある場合
						isContinueSearch = false;	// 石が置けない
					}
				}
			}
		}
	}

	draw();
});