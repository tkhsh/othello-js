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

	draw();
});