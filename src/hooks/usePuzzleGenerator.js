
import PuzzleGenerator from "../helpers/puzzleGenerator"
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react"

import Crypto from "@/examples/crypto"
import Word from "@/examples/word"
import Cities from "@/examples/cities"

import { Configuration, OpenAIApi } from "openai"

import GameState from "@/helpers/gameState"

export const PuzzleGeneratorContext = createContext()


const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            apiKey: undefined,
            crosswordList: [],
            game: undefined // game state
        }
    )

    const { crosswordList, game, apiKey } = values

    // useEffect(() => {

    //     let fromLocalStorage

    //     if (localStorage.getItem("puzzles")) {
    //         fromLocalStorage = localStorage.getItem("puzzles")
    //         fromLocalStorage = JSON.parse(fromLocalStorage)
    //     }

    //     dispatch({
    //         crosswordList: [Word, Crypto, Cities, ...fromLocalStorage]
    //     })

    //     if (localStorage.getItem("openai_api")) {
    //         dispatch({
    //             apiKey: localStorage.getItem("openai_api")
    //         })
    //     }

    // }, [])

    const updatePos = useCallback((text, position) => {

        if (!game.solved.includes(position)) {

            const normalizedText = text.replace(game.current[position], "")

            dispatch({
                game: {
                    ...game,
                    current: game.current.map((item, index) => index === position ? normalizedText && normalizedText[normalizedText.length - 1].toUpperCase() : item)
                }
            })
        }

    }, [game])

    const check = useCallback((game) => {

        const solved = game.answer.reduce((arr, item, index) => {
            if (game.current[index] === item) {
                arr.push(index)
            }
            return arr
        }, [])

        dispatch({
            game: {
                ...game,
                solved,
                current: game.current.map((item, index) => solved.includes(index) ? item : "")
            }
        })
    }, [])

    const revealAll = useCallback((game) => {
        dispatch({
            game: {
                ...game,
                current: game.answer,
                solved: game.answer.reduce((arr, item, index) => { if (item !== "_") { arr.push(index) } return arr }, [])
            }
        })

    }, [])

    const generateGame = useCallback((wordList, clueList) => {

        const capitalWordList = wordList.map(item => item.toUpperCase())
        const normalizedClueList = clueList.reduce((arr, item) => item.clue ? arr.concat(item.clue) : arr.concat(item), [])

        // create 20 10x10 grids...
        const generator = new PuzzleGenerator(wordList.map(item => item.toUpperCase()), wordList[0].toUpperCase()) // pilot word
        generator.generateGrids()

        // find the best one
        const bestGrid = generator.getBestGrid(generator.generatedGrids);

        // packaging into an object
        const gameState = new GameState(bestGrid.flatten(), bestGrid.words.map((item) => {
            let clue
            if (capitalWordList.includes(item.word.toUpperCase())) {
                const index = capitalWordList.indexOf(item.word.toUpperCase())
                clue = normalizedClueList[index]
            }
            return {
                ...item,
                clue
            }
        }))

        return gameState
    }, [])

    const createGameByName = useCallback((gameName) => {

        const { words, clues, name, description } = crosswordList.find(item => item.name === gameName)
        const gameState = generateGame(words, clues)

        dispatch({
            game: {
                ...gameState,
                name,
                description
            }
        })
    }, [crosswordList])

    const execute = useCallback(async (prompt, temperature = 0.5, maxTokens = 1000) => {
        // Configure OpenAI
        const configuration = new Configuration({
            apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const messages = [{ "role": "system", "content": prompt }]
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: maxTokens,
            temperature: temperature,
            n: 1,
            stop: null
        })
        console.log(response)
        return response.data.choices[0].message.content.trim()

    }, [apiKey])

    const saveApikey = (key) => {
        localStorage.setItem("openai_api", key)
        dispatch({
            apiKey: key
        })
    }


    const addPuzzleToStorage = useCallback(({
        name,
        description,
        words,
        clues
    }) => {

        const newItem = {
            name,
            description,
            words,
            clues
        }

        if (!localStorage.getItem("puzzles")) {
            localStorage.setItem("puzzles", JSON.stringify([]))
        }

        let array = localStorage.getItem("puzzles")
        array = JSON.parse(array)

        array.push(newItem)

        localStorage.setItem("puzzles", JSON.stringify(array))

        dispatch({
            crosswordList: [...crosswordList, newItem]
        })
    }, [crosswordList])

    const removeItem = useCallback((name) => {

        let array = localStorage.getItem("puzzles")
        array = JSON.parse(array)

        array = array.filter(item => item.name !== name)

        localStorage.setItem("puzzles", JSON.stringify(array))

        dispatch({
            crosswordList: [Word, Crypto, Cities, ...array]
        })

    }, [])

    const generatorContext = useMemo(
        () => ({
            crosswordList,
            createGameByName,
            game,
            updatePos,
            revealAll,
            apiKey,
            saveApikey,
            check,
            execute,
            removeItem,
            addPuzzleToStorage
        }),
        [crosswordList, addPuzzleToStorage, createGameByName, updatePos, game, revealAll, check, apiKey, execute]
    )

    return (
        <PuzzleGeneratorContext.Provider value={generatorContext}>
            {children}
        </PuzzleGeneratorContext.Provider>
    )
}

export default Provider