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
			board[position] = "●";
			turn = false;
		} else {
			board[position] = "○";
			turn = true;
		}

		draw();
	});

	draw();
});