import { PuzzleGeneratorContext } from "@/hooks/usePuzzleGenerator"
import { useEffect, useContext, useState, useCallback } from "react"



const GameContainer = ({ selected }) => {

    const { createGameByName, game, updatePos, revealAll, check } = useContext(PuzzleGeneratorContext)

    const [activeWordPos, setActiveWordPos] = useState([])

    useEffect(() => {
        selected && createGameByName(selected)
    }, [selected])

    const onReset = useCallback(() => {
        createGameByName(selected)
    },[selected])

    const onReveal = useCallback(() => {
        revealAll(game)
    },[game])

    const onCheck = useCallback(() => {
        check(game)
    },[game])

    const clueData = game ? game.clues.reduce((output, item, index) => {
        if (activeWordPos.includes(item.startPosition)) {
            output = output + `${index + 1}. ${game.clues[index].clue}<br />`
        }
        return output
    }, "") : "-"

    return (
        <div class="flex-1 flex flex-col">
            <div class="p-6 bg-gray-700">
                <div class="grid grid-cols-2">
                    <div>
                        <h1 class="text-lg text-white font-bold mb-2">{game && game.name}</h1>
                        <p class="text-sm text-gray-300 mb-4">{game && game.description}</p>
                    </div>
                </div>
            </div>
            <div class="p-6 bg-gray-900 text-white flex-grow flex items-center justify-center">
                <div class="w-full">
                    <div class="flex justify-center mx-auto">
                        <div className="grid grid-cols-10 grid-rows-10 gap-1">
                            {game && game.current.map((cell, index) => {
                                const wordIndex = game.clues.reduce((result, item, wordIndex) => {
                                    if (item.startPosition === index) {
                                        if (result) {
                                            result = `${result}, ${wordIndex + 1}`
                                        } else {
                                            result = `${wordIndex + 1}`
                                        }
                                    }
                                    return result
                                }, undefined)
                                return (
                                    <div key={index} className={`relative w-12 h-12 border ${activeWordPos.includes(index) ? "border-blue-700" : "border-black"} ${cell !== "_" ? "bg-white" : "bg-black"}`}>
                                        {cell !== "_" && (
                                            <>
                                                <div className="flex items-center justify-center w-full h-full">
                                                    {wordIndex && <div className="absolute top-0 left-0 text-xs px-1 bg-black">{wordIndex}</div>}
                                                    <input
                                                        onClick={() => {
                                                            setActiveWordPos(game.clues.reduce((arr, item) => {
                                                                if (item.positions.includes(index)) {
                                                                    arr = arr.concat(item.positions)
                                                                }
                                                                return arr
                                                            }, []))
                                                        }}
                                                        onChange={(e) => updatePos(e.target.value, index)}
                                                        value={cell.toUpperCase()}
                                                        type="text"
                                                        className={`w-full h-full text-black text-center outline-none ${game.solved.includes(index) && "underline"}`}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div class="flex mt-2 justify-center mx-auto">
                        <div class="w-1/2  py-2 mx-4 px-4 mt-2  ">
                            <div class="grid grid-cols-3 text-sm">
                                <button onClick={onCheck} class="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-4 mx-2 rounded">
                                    Check
                                </button>
                                <button onClick={onReveal} class="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 mx-2 rounded">
                                    Reveal All
                                </button>
                                <button onClick={onReset} class="bg-gray-500 hover:bg-gray-700 text-white  py-2 px-4 mx-2 rounded">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex  justify-center mx-auto"> 
                        <div class="w-1/2  py-2 mx-4 px-4 mt-2 bg-gray-700 rounded-lg">
                            <h1 class="text-lg text-white font-bold mb-2 mt-2">Clues</h1>
                            <p class="text-sm text-gray-300 mt-2 mb-4">
                                {clueData
                                    ?
                                    <p dangerouslySetInnerHTML={{ __html: clueData }} />
                                    :
                                    "Click on one of the cells to reveal the clue"
                                }
                            </p>
                        </div> 
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default GameContainer