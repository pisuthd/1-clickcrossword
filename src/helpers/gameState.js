

function GameState(answer, clues) {

    this.answer = answer
    this.current =  answer.map((item) => (item !== "_" ? "" : "_"))
    this.solved = []
    this.clues = clues

}

export default GameState