--- 
layout: pagelayout 
title: Different game 
addasyncjs: ttt.js
addcss: ttt.css
---

# Different tic-tac-toe / noughts and crosses / Xs and Os

You will not choose the mark you play next move with. It is randomly chosen for your each move. The same apply for your playmate's move.

Yes, you can get **"X"** to play and in next move it could be **"O"**.

The question is: who is the winner and the looser? Is there any looser?

<div id="placegame">
    <div id="game-start">
        <button>Start new game</button>
    </div>
    <div id="game-settings"></div>
    <div id="game-finished">
        <h2>Game finished</h2>
        <div class="again"><button>Play again</button></div>
        <div class="give-feedback"><a href="#">Please, share feelings about the game...</a></div>
    </div>
    <div id="game-feedback">
        <h2>Share your feelings</h2>
        <div class="feedback-form">
            <form>
                <fieldset>
                    <legend>You feel:</legend>
                    <div>
                        <input type="radio" id="won" name="feeling" value="won" required>
                        <label for="won">like you won</label>
                    </div>
                    <div>
                        <input type="radio" id="lost" name="feeling" value="lost">
                        <label for="lost">like you lost</label>
                    </div>
                    <div>
                        <input type="radio" id="cooperated" name="feeling" value="cooperated">
                        <label for="cooperated">that you cooperated</label>
                    </div>
                    <div>
                        <input type="radio" id="havingfun" name="feeling" value="havingfun">
                        <label for="havingfun">having fun</label>
                    </div>
                    <div>
                        <input type="radio" id="useless" name="feeling" value="useless">
                        <label for="useless">it's useless</label>
                    </div>
                    <div>
                        <input type="radio" id="nofeeling" name="feeling" value="nofeeling">
                        <label for="nofeeling">nothing special</label>
                    </div>
                </fieldset>
                <div class="form-row">
                    <div><label for="comment">Anything to say about it?</label></div>
                    <textarea id="comment" name="comment" maxlength="3000"></textarea>
                </div>
                <input type="hidden" name="gameid" value="">
                <input type="hidden" name="history" value="">
                <div class="form-row">
                    <button type="submit">Send anonymously</button>
                </div>
                <p><a href="#" class="newgame">Don't send anything, but play another game</a></p>
            </form>
        </div>
    </div>
    <div id="game-info">
        <div class="who-is-playing"></div>
        <div class="next-token"></div>
    </div>
    <div id="game-board"></div>
</div>

