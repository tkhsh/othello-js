$(function() {
	//オセロ盤のサイズを定義
	var boardSize = 4;
	// オセロ盤のglobal変数
	var board = new Array(boardSize*boardSize);
	// オセロ盤を初期化
	for(var i = 0; i < board.length; i++) {
		board[i] = "□";
	}
	// 白石と黒石の記号
	var WhiteStone = "◯";
	var BlackStone = "●";

	function getSymbols(isPlayerTurn) {
		if(isPlayerTurn) {
			return { onesStone: BlackStone, oppositeStone: WhiteStone};
		} else {
			return { onesStone: WhiteStone, oppositeStone: BlackStone};
		}
	}

	var half = boardSize >> 1;
	board[parsePosition(half-1, half-1) ] = WhiteStone;
	board[parsePosition(half, half-1)] = BlackStone;
	board[parsePosition(half-1, half)] = BlackStone;
	board[parsePosition(half, half)] = WhiteStone;

	function parsePosition(x, y) {
		return y*4 + x;
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

		if(canAttack(position, true)) {
			//プレイヤーの順番
			board[position] = BlackStone;
			flip(position, true)
			turn = false;
			document.getElementById("turn").innerHTML = "白の番です。"

			//computerの順番
			var bestPos = searchBestMove();
			if(bestPos != null) {
				board[bestPos] = WhiteStone;
				flip(bestPos, false);	
			} else {
				// コンピューターはパス
			}
			turn = true;
			document.getElementById("turn").innerHTML = "黒の番です。"
		}

		draw();
	});

	//石が置けるか判定
	function canAttack(stonePos, isPlayerTurn) {
		// エラーチェック
		if(board[stonePos] != "□") {
			console.log("エラー：同じ場所には置けません");
			return false;
		}
		if(!(stonePos >= 0 && stonePos <= 15)) {
			console.log("エラー：0~15までの半角の数を入力してください");
			return false;
		}

		var symbols = getSymbols(isPlayerTurn);

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

					if(board[boardNum] == symbols.oppositeStone) { // 検索結果が異なる色なら
						differentStones.push(boardNum);
						//同じ方向にもう一マス進み、検索する。

					} else if(board[boardNum] == symbols.onesStone) { // 検索結果が同じ色なら
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

	var highPriorityMoves = [0, 3, 12, 15]; //もっとも「優勢」になる手

	function searchBestMove() {
		var bestMove; //　最もいい手を記録する canAttack(i, false)
		var availableMoves = [];
		for(var posNum = 0; posNum < board.length; posNum++) {
			if(canAttack(posNum, false)) {
				console.log(posNum);
				availableMoves.push(posNum);
			}
		}
		// 置ける場所がない場合
		if(availableMoves.length == 0) {
			return null;
		} else {
			bestMove = availableMoves[0];
		}

		// TODO:availableMovesの一つ一つの手について、４手先まで盤面を読む
		for(var i = 0; i < availableMoves.length-1; i++) {
			var tmp1 = availableMoves[i];
			var tmp2 = availableMoves[i+1];
			for(var j = 0; j < highPriorityMoves.length; j++) {
				if(tmp2 == highPriorityMoves[j]) {
					bestMove = tmp2;
				}
			}
		}

		return bestMove;
	}

	function flip(movePos, isPlayerTurn) {
		/*
		for(var i = 0; i < differentStones.length; i++) {
			var tmp = differentStones[i];
			board[tmp] = myStone;
		}
		*/
		var symbols = getSymbols(isPlayerTurn);

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

					if(board[boardNum] == symbols.oppositeStone) { // 検索結果が異なる色なら
						differentStones.push(boardNum);
						//同じ方向にもう一マス進み、検索する。

					} else if(board[boardNum] == symbols.onesStone) { // 検索結果が同じ色なら
						isContinueSearch = false;
						if(differentStones.length != 0) {
							// canSnap = true;
							for(var i = 0; i < differentStones.length; i++) {
								var tmp = differentStones[i];
								board[tmp] = symbols.onesStone;
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
