$(function() {
	// オセロ盤のglobal変数
	var board = new Array(16);
	// オセロ盤を初期化
	for(var i = 0; i < board.length; i++) {
		board[i] = "□";
	}
	board[5] = "○";
	board[6] = "●";
	board[9] = "●";
	board[10] = "○";

	// オセロ盤を表示する
	function draw() {
		// 配列boardをStringに変換
		var boardStr = "";
		for(var i = 0; i < board.length; i++) { 
			if(i%4 == 0) {
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

		// エラーチェック
		//1.valueは0~15までの数でなければならない
		var position = parseInt(tmpPosition);
		if(!(position >= 0 && position <= 15)) {
			console.log("エラー：0~15までの半角の数を入力してください");
			return;
		}
		//2.同じ場所には置けない
		if(board[position] != "□") {
			console.log("エラー：同じ場所には置けません");
			return;
		}

		//白の番か黒の番かを判定
		if(turn) {
			if(flipDetection(position, "black")) {
				board[position] = "●";
				turn = false;
			}
		} else {
			if(flipDetection(position, "white")) {
				board[position] = "○";
				turn = true;
			}
		}

		draw();
	});

	//石がひっくり返るか判定
	function flipDetection(stonePos, myStoneColor) {
		var myStone;
		var oppositeStone;
		if(myStoneColor == "black") {
			myStone = "●";
			oppositeStone = "○";
		} else　if(myStoneColor == "white") {
			myStone = "○";
			oppositeStone = "●";
		}

		var canSnap = false; // 石がおけるか？

		for(var dx = -1; dx <= 1; dx++) {
			for(var dy = -1; dy <= 1; dy++) {

				var posX = stonePos%4;
				var posY = Math.floor(stonePos/4); // 整数の値をとる
				var isContinueSearch = true; // TODO:終了条件の追加（1.端まで来たとき 2.検索結果が●だったとき）
				var differentStones = [];

				while(isContinueSearch) {
					posX += dx;
					posY += dy;
					console.log(dx + " dy:" + dy + " posX:" + posX);
					console.log(" posY:" + posY);

					if(posX < 0 || posX > 4) { //端まできたときにsearchを終了
						break;
					} else if (posY < 0 || posY > 4) {
						break;
					}

					var boardNum = posY*4 + posX%4;
					console.log(" boardNum:" + boardNum);

					if(board[boardNum] == oppositeStone) { // 検索結果が異なる色（白と仮定）なら
						// このブロック内の処理（1.boardNum（座標）を記録 2.石が置ける　3.同じ方向にもう一マス進み、検索する。）

						differentStones.push(boardNum); // 1を実装。differentStonesが空でなければ石は置けるとするので２の条件も満たす
						// whileループが継続するので、「3.同じ方向にもう一マス進み、検索する」の条件を満たす。

					} else if(board[boardNum] == myStone) { // 検索結果が同じ色（黒と仮定）なら
						// このブロック内の処理（1.この方向の検索が終了 2.石が置けるなら、記録した座標の色を変える）
						isContinueSearch = false; // 1を実装
						if(differentStones.length != 0) { //2を実装
							/////////////////////////関数に切り出したい処理///////////////////////////////
							for(var i = 0; i < differentStones.length; i++) {
								var tmp = differentStones[i];
								board[tmp] = myStone;
							}
							/////////////////////////////////////////////////////////
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

	draw();
});