$(function() {
	// オセロ盤のglobal変数
	var board = new Array(16);
	// オセロ盤のすべての値を" "で初期化
	for(var i = 0; i < board.length; i++) {
		board[i] = "□";
	}

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
		// TODO: エラーのチェック機能を追加する（1.valueは0~15までの数でなければならない 2.同じ場所には置けない）
		var position = document.getElementById("position").value;

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