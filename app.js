$(function() {
    //ゲームの情報（もしくは設定）を保存する変数
    var gameInfo = {};
    
    function initGame() {
        gameInfo.boardSize = 4;
        gameInfo.board = new Array(gameInfo.boardSize * gameInfo.boardSize);
        gameInfo.whiteStone = "◯";
        gameInfo.blackStone = "●";
        gameInfo.space = "□";

        // 盤面を空白記号で初期化
        for(var i = 0; i<gameInfo.board.length; i++) {
            gameInfo.board[i] = gameInfo.space;
        }

        // 白石と黒石を初期配置に置く
        var half = gameInfo.boardSize >> 1;
        gameInfo.board[parsePosition(half-1, half-1) ] = gameInfo.whiteStone;
        gameInfo.board[parsePosition(half, half-1)] = gameInfo.blackStone;
        gameInfo.board[parsePosition(half-1, half)] = gameInfo.blackStone;
        gameInfo.board[parsePosition(half, half)] = gameInfo.whiteStone;
    }
    
    function getSymbols(isPlayerTurn) {
        if(isPlayerTurn) {
            return { onesStone: gameInfo.blackStone, oppositeStone: gameInfo.whiteStone};
        } else {
            return { onesStone: gameInfo.whiteStone, oppositeStone: gameInfo.blackStone};
        }
    }

    function parsePosition(x, y) {
        return y*4 + x;
    }

    // オセロ盤を表示する
    function draw() {
        // 配列boardをStringに変換
        var boardStr = "";
        for(var i = 0; i < gameInfo.board.length; i++) { 
            if(i%gameInfo.boardSize == 0) {
                boardStr += "\n"
            }
            boardStr += gameInfo.board[i];
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
            gameInfo.board[position] = gameInfo.blackStone;
            flip(position, true)
            turn = false;
            document.getElementById("turn").innerHTML = "白の番です。"

            //computerの順番
            var bestPos = searchBestMove();
            if(bestPos != null) {
                gameInfo.board[bestPos] = gameInfo.whiteStone;
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
        if(gameInfo.board[stonePos] != gameInfo.space) {
            console.log("エラー：同じ場所には置けません");
            return false;
        }
        if(!(stonePos >= 0 && stonePos <= 15)) {
            console.log("エラー：0~15までの半角の数を入力してください");
            return false;
        }

        var canSnap = searchAllDirections(stonePos, isPlayerTurn);

        return canSnap;
    }

    function searchAllDirections(position, isPlayerTurn) {
        var canMoveTo = false;
        var symbols = getSymbols(isPlayerTurn);

        for(var dx = -1; dx <= 1; dx++) {
            for(var dy = -1; dy <= 1; dy++) {
                var posX = position%gameInfo.boardSize;
                var posY = Math.floor(position/gameInfo.boardSize); // 整数の値をとる
                var isContinueSearch = true;
                var differentStones = [];

                while(isContinueSearch) {
                    posX += dx;
                    posY += dy;

                    if(posX < 0 || posX > gameInfo.boardSize) { //端まできたときにsearchを終了
                        break;
                    } else if (posY < 0 || posY > gameInfo.boardSize) {
                        break;
                    }

                    var boardNum = posY*gameInfo.boardSize + posX%gameInfo.boardSize;

                    if(gameInfo.board[boardNum] == symbols.oppositeStone) { // 検索結果が異なる色なら
                        differentStones.push(boardNum);
                        //同じ方向にもう一マス進み、検索する。

                    } else if(gameInfo.board[boardNum] == symbols.onesStone) { // 検索結果が同じ色なら
                        isContinueSearch = false;
                        if(differentStones.length != 0) {
                            canMoveTo = true;
                        }
                    } else { // 間にスペースのある場合
                        isContinueSearch = false;   // 石が置けない
                    }
                }
            }
        }
        return canMoveTo;
    }

    var highPriorityMoves = [0, 3, 12, 15]; //もっとも「優勢」になる手

    function searchBestMove() {
        var bestMove; //　最もいい手を記録する canAttack(i, false)
        var availableMoves = [];
        for(var posNum = 0; posNum < gameInfo.board.length; posNum++) {
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
                var posX = movePos%gameInfo.boardSize;
                var posY = Math.floor(movePos/gameInfo.boardSize); // 整数の値をとる
                var isContinueSearch = true;
                var differentStones = [];

                while(isContinueSearch) {
                    posX += dx;
                    posY += dy;

                    if(posX < 0 || posX > gameInfo.boardSize) { //端まできたときにsearchを終了
                        break;
                    } else if (posY < 0 || posY > gameInfo.boardSize) {
                        break;
                    }

                    var boardNum = posY*gameInfo.boardSize + posX%gameInfo.boardSize;
                    console.log(" boardNum:" + boardNum);

                    if(gameInfo.board[boardNum] == symbols.oppositeStone) { // 検索結果が異なる色なら
                        differentStones.push(boardNum);
                        //同じ方向にもう一マス進み、検索する。

                    } else if(gameInfo.board[boardNum] == symbols.onesStone) { // 検索結果が同じ色なら
                        isContinueSearch = false;
                        if(differentStones.length != 0) {
                            // canSnap = true;
                            for(var i = 0; i < differentStones.length; i++) {
                                var tmp = differentStones[i];
                                gameInfo.board[tmp] = symbols.onesStone;
                            }
                        }
                    } else { // 間にスペースのある場合
                        isContinueSearch = false;   // 石が置けない
                    }
                }
            }
        }
    }

    initGame();
    draw();
});
