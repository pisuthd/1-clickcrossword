import CrosswordPuzzle from "./crosswordPuzzle"
import Word from "./word"

class PuzzleGenerator {

    words = []
    attemptsToFitWords = 5000;
    gridsToMake = 20;
    gridSize = 10

    pilot

    usedWords = []
    generatedGrids = [];
    goodStartingLetters = new Set()

    constructor(words, pilot) {
        this.words = words

        if (pilot) {
            this.pilot = pilot
        }

    }

    generateGrids = () => {
        this.generatedGrids = [];


        for (let gridsMade = 0; gridsMade < this.gridsToMake; gridsMade++) {

            let grid = new CrosswordPuzzle({
                gridSize: this.gridSize
            });

            let word

            if (this.pilot) {
                word = new Word(this.pilot, 0, 0, false)
            } else {
                word = new Word(this.getRandomWordOfSize(this.getUnusedWords(), this.longestString(this.words).length > this.gridSize ? this.gridSize : this.longestString(this.words).length),
                    0, 0, false);

            }

            grid.update(word);
            this.pushUsedWords(word.text);

            let continuousFails = 0;

            for (let attempts = 0; attempts < this.attemptsToFitWords; ++attempts) {
                let placed = this.attemptToPlaceWordOnGrid(grid, word);
                if (placed) {
                    continuousFails = 0;
                }
                else {
                    continuousFails++;
                }
                if (continuousFails > 470) {
                    break;
                }
            }

            this.generatedGrids.push(grid);
            if (grid.getIntersections() >= 4) {
                break;
            }
            this.usedWords = [];
        }

    }

    longestString = (...strs) => {
        return strs.reduce((c, v) => c.length > v.length ? c : v);
    }


    getRandomWordOfSize = (wordList, wordSize) => {
        let properLengthWords = wordList.filter(val => val.length >= wordSize);
        return properLengthWords[this.getRandomInt(properLengthWords.length)]
    }

    getRandomWord = (wordList) => {
        let words = this.getUnusedWords();
        return words[this.getRandomInt(words.length)]
    }

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    getUnusedWords = () => {
        return this.words.filter(val => !this.usedWords.includes(val));
    }

    pushUsedWords = (text) => {
        this.usedWords.push(text);
        text.split('').filter(char => this.goodStartingLetters.add(char));
    }

    attemptToPlaceWordOnGrid = (grid, word) => {
        let text = this.getAWordToTry();
        for (let row = 0; row < this.gridSize; ++row) {
            for (let column = 0; column < this.gridSize; ++column) {
                word.text = text;
                word.row = row;
                word.column = column;
                word.vertical = Math.random() >= 0.5;

                if (grid.isLetter(row, column)) {
                    if (grid.update(word)) {
                        this.pushUsedWords(word.text);
                        return true;
                    }
                }
            }
        }
        return false;

    }

    isGoodWord = (word) => {
        let goodWord = false;
        for (let letter of this.goodStartingLetters) {
            if (letter === word.charAt(0)) {
                goodWord = true;
                break;
            }
        }
        return goodWord;
    }

    getAWordToTry = () => {
        let word = this.getRandomWord(this.words);
        let goodWord = this.isGoodWord(word);

        let count = 0

        while (this.usedWords.includes(word) || !goodWord) { 
            word = this.getRandomWord(this.words);
            goodWord = this.isGoodWord(word);

            if (count > 2000) {
                break
            }

            count += 1
        }
        return word;
    }

    getBestGrid = (grids) => {
        let bestGrid = grids[0];
        for (let grid of grids) { 
            if (grid.getIntersections() >= bestGrid.getIntersections()) {
                bestGrid = grid;
            }
        }
        return bestGrid;
    }


}




export default PuzzleGenerator