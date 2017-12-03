/*globals $:false */
/*globals window:false */
/*globals document:false */
/*globals setTimeout:false */


$(document).ready(function () {
    var firstChoice;
    var secondChoice;
    var openCards;
    var tries;
    var triesBet;

    var level = 0;

    //    create DOMmanipulator object which will hold all funcs that pamipulate the dom

    var DOMmanipulator = (function () {

        var gameContainer = $('#game');
        var ui = $('#game-UI');
        var uiIntro = $('#game-intro');
        var uiStats = $('#game-stats');
        var uiComplete = $('#game-complete');
        var uiCompleteWin = $('#game-complete #win-container');
        var uiCompleteLose = $('#game-complete #lose-container');
        var uiGameCompleteWin = $('#game-complete #win-game');
        var uiPlay = $('#game-play');
        var uiReset = $('.game-reset');
        var uiRemaining = $('#game-remaining');
        var uiScore = $('.game-score');
        var uiTries = $('.game-tries');
        var cardContainer = $('#card-container');
        var uiGameBet = $('#game-bet');

        var uiLevel = $('.game-level');

        function prepareBoard(level) {
            cardContainer.empty();
            //            console.log(level);
            for (var i = 0; i < Game.getCardsNum(level) * 2; i++) {
                var tile = $('<div>')
                    .addClass('col-sm-6').css({
                        //                    'padding': '10px',
                        //                'width': '300px',
                        //                'height': '300px',
                        //                'background-color': 'red'
                    })

                var emptyCard =
                    $('<div>').prop('id', 'index-' + i)
                    .css({
                        'margin': '10px',
                        'width': '300px',
                        'height': '300px',
                        'background-color': 'red'
                    })
                    .on('click', function (e) {
                        DOMmanipulator.showCard(e);
                    });
                var card = $('<div>');
                tile.append(emptyCard);

                cardContainer.append(tile);
            }
        }

        function getUiPlay() {
            return uiPlay;
        }

        function getUiReset() {
            return uiReset;
        }

        function getCardContainer() {
            return cardContainer;
        }

        function getGameContainer() {
            return gameContainer;
        }

        function updateLevelDisplay(level) {
            uiLevel.text(level + 1);
        }

        function updateScoreDisplay(triesBet) {
            uiScore.text(triesBet);
        }

        function updateTriesBetDisplay(tries) {
            uiTries.text(tries);
        }

        function startGameDisplay() {
            gameContainer.removeClass('game');
            ui.hide();
            uiPlay.hide();
            uiIntro.hide();
            uiComplete.find('.game-reset').before(uiGameBet);
            uiGameBet.show();

        }

        function resetGameDisplay() {
            gameContainer.addClass('game-playing');
            ui.hide();
            uiCompleteLose.hide();
            uiCompleteWin.hide();
            uiIntro.hide();
        }

        function showLoseLevelInfo() {
            uiComplete.show();
            uiCompleteLose.show();
            ui.show();
        }

        function showWinLevelInfo() {
            ui.show();
            uiComplete.show();
            uiGameCompleteWin.show();
            uiPlay.show();
            uiReset.hide();
            uiGameBet.hide();
        }

        function showWinGameInfo() {
            ui.show();
            uiComplete.show();
            uiGameCompleteWin.hide();
            uiCompleteWin.show();
            uiPlay.hide();
            uiReset.show();
        }

        function removeTags(arr, selectorPattern) {
            arr.forEach(function (e) {
                $(selectorPattern + e).remove();
            })
        }

        function bindEventToTags(arr, selectorPattern) {
            arr.forEach(function (e) {
                //                console.log(selectorPattern + e);
                $(selectorPattern + e).bind('click', showCard);
            })
        }

        function showResult() {

        }

        function showCard(e) {
            var element = $(e.target);
            if (!firstChoice) {
                firstChoice = element.attr('id').split('-')[1];

                element.append(

                    $('<img>')
                    .prop('src', Game.getCardCouplesArr()[firstChoice].imagePath)
                    .css({
                        'width': '100%'
                    })
                    .prop('id', 'img-index-' + firstChoice)

                );
                element.unbind('click');
                return;
            }
            if (!secondChoice) {
                secondChoice = element.attr('id').split('-')[1];
                element.append(

                    $('<img>')
                    .prop('src', Game.getCardCouplesArr()[secondChoice].imagePath)
                    .css({
                        'width': '100%'
                    })
                    .prop('id', 'img-index-' + secondChoice)


                )
                element.unbind('click');

                Game.compareCards(firstChoice, secondChoice);
            }
        }

        return {
            showCard: showCard,
            bindEventToTags: bindEventToTags,
            removeTags: removeTags,
            updateLevelDisplay: updateLevelDisplay,
            startGameDisplay: startGameDisplay,
            resetGameDisplay: resetGameDisplay,
            updateScoreDisplay: updateScoreDisplay,
            updateTriesBetDisplay: updateTriesBetDisplay,
            showLoseLevelInfo: showLoseLevelInfo,
            showWinLevelInfo: showWinLevelInfo,
            showWinGameInfo: showWinGameInfo,
            getUiReset: getUiReset,
            getUiPlay: getUiPlay,
            getCardContainer: getCardContainer,
            getGameContainer: getGameContainer,
            prepareBoard: prepareBoard

        }
    })();

    //http://picti.co/colored/furry_baby_mouse-692856.jpg
    var Game = (function () {
        var cards = [
            [{
                    'id': 1,
                    'imagePath': './images/bat.jpg'
        },
                {
                    'id': 2,
                    'imagePath': './images/duck.jpg'
            }],
            [{
                    'id': 3,
                    'imagePath': './images/cat.jpg'
                            }, {
                    'id': 4,
                    'imagePath': './images/peacock.jpg'
                                        },
                {
                    'id': 5,
                    'imagePath': './images/squirrel.jpg'
                                        }]
        ];

        var cardCouples = null;

        function initGame() {
            firstChoice = null;
            secondChoice = null;
            openCards = 0;
            tries = 0;
            level = 0;
            loadBoard(level);
            prepareCardCouplesArr(level);
        }

        function initNextLevel() {
            firstChoice = null;
            secondChoice = null;
            openCards = 0;
            tries = 0;
            loadBoard(level);
            prepareCardCouplesArr(level);
        }

        function loadBoard(level) {
            DOMmanipulator.prepareBoard(level);
        }

        function prepareCardCouplesArr(level) {
            cardCouples = cards[level].slice(0).concat(cards[level].slice(0));
            cardCouples = shuffleCardsArr(cardCouples);
            //            console.log(cardCouples);
        }

        function shuffleCardsArr(arr) {
            // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            //The Fisher-Yates algorithm works by picking one random element for each original array element, and then excluding it from the next draw. Just like randomly picking from a deck of cards.
            //
            //This exclusion is done in a clever way (invented by Durstenfeld for use by computers) by swapping the picked element with the current element, and then picking the next random element from the remainder. For optimal efficiency, the loop runs backwards so that the random pick is simplified (it can always start at 0), and it skips the last element because there are no other choices anymore.

            //        The running time of this algorithm is O(n).
            for (var i = arr.length - 1; i > 0; i--) {
                var randomIndex = Math.floor(Math.random() * (i + 1));
                var tmp = arr[i];
                arr[i] = arr[randomIndex];
                arr[randomIndex] = tmp;
            }
            return arr;
        }

        function compareCards(firstChoiceIndex, secondChoiceIndex) {

            tries++;
            if (cardCouples[firstChoiceIndex].id !== cardCouples[secondChoiceIndex].id) {
                var arrTagIndexes = [firstChoiceIndex, secondChoiceIndex];
                DOMmanipulator.bindEventToTags(arrTagIndexes, '#index-')
                if (triesBet <= tries) {
                    DOMmanipulator.showLoseLevelInfo();
                    DOMmanipulator.updateTriesBetDisplay(triesBet);
                    return;
                }
                setTimeout(function () {
                    DOMmanipulator.removeTags(arrTagIndexes, '#img-index-');
                    firstChoice = null;
                    secondChoice = null;
                }, 2000);
                return;
            }
            openCards++;

            if (openCards == Game.getCardsNum(level)) {
                DOMmanipulator.updateScoreDisplay(tries);
                if (Game.getLevelsCount() == level + 1) {
                    DOMmanipulator.showWinLevelInfo();
                } else {
                    DOMmanipulator.showWinGameInfo();
                    level++;
                    DOMmanipulator.updateLevelDisplay(level);
                }
                return;
            }
            if (triesBet <= tries) {
                DOMmanipulator.showLoseLevelInfo();
                DOMmanipulator.updateTriesBetDisplay(triesBet);
                return;
            }
            firstChoice = null;
            secondChoice = null;
        }

        function getCardsNum(level) {
            return cards[level].length;
        }

        function getLevelsCount() {
            return cards.length;
        }

        function getCardCouplesArr() {
            return cardCouples.slice(0)
        }

        return {
            initGame: initGame,
            initNextLevel: initNextLevel,
            getCardCouplesArr: getCardCouplesArr,
            compareCards: compareCards,
            getCardsNum: getCardsNum,
            getLevelsCount: getLevelsCount
        }

    })();

    DOMmanipulator.updateLevelDisplay(level);
    DOMmanipulator.getUiPlay().on('click', function (e) {
        e.preventDefault();
        Game.initGame(level);
        DOMmanipulator.startGameDisplay();
        triesBet = (Number($('#bet-clicks option:selected').val()) ? Number($('#bet-clicks option:selected').val()) : 0) + Game.getCardsNum(level);

    });
    DOMmanipulator.getUiReset().on('click', function (e) {
        e.preventDefault();
        Game.initNextLevel(level);
        DOMmanipulator.resetGameDisplay();
        DOMmanipulator.updateLevelDisplay(level);

        triesBet = (Number($('#bet-clicks option:selected').val()) ? Number($('#bet-clicks option:selected').val()) : 0) + Game.getCardsNum(level);
    });
})
