import { PuzzleGeneratorContext } from "@/hooks/usePuzzleGenerator"
import { useCallback, useContext, useState } from "react"

import { Plus, PlusCircle, X } from "react-feather"

import PROMPTS from "@/helpers/prompts"

const CreateContainer = () => {

    const { execute, addPuzzleToStorage } = useContext(PuzzleGeneratorContext)

    const [types, setTypes] = useState()
    const [topic, setTopic] = useState()
    const [total, setTotal] = useState("40")

    const [outputWordList, setOutputWordList] = useState([])
    const [outputClueList, setOutputClueList] = useState([])

    const [errorMessage, setErrorMessage] = useState()
    const [loading, setLoading] = useState()

    const [showSaveModal, setSaveModal] = useState(false)

    const [puzzleName, setPuzzleName] = useState()
    const [puzzleDetails, setPuzzleDetails] = useState()

    const prompts = PROMPTS

    const closeSaveModal = () => {
        setSaveModal(false);
    };

    const onSave = useCallback(() => {

        if (!puzzleName || puzzleName.length < 3) {
            setErrorMessage("Name is not set")
            return
        }

        addPuzzleToStorage({
            name: puzzleName,
            description: puzzleDetails,
            words: outputWordList,
            clues: outputClueList
        })

        setOutputWordList([])
        setOutputWordList([])
        closeSaveModal()
    }, [puzzleName, puzzleDetails, outputClueList, outputWordList, addPuzzleToStorage])

    const onExecute = useCallback(async () => {

        if (loading) {
            return
        }

        setOutputClueList([])
        setOutputWordList([])

        setErrorMessage()

        if (!types || types.length < 3) {
            setErrorMessage("Types is not set")
            return
        }

        if (!topic || topic.length < 3) {
            setErrorMessage("Topic is not set")
            return
        }

        setLoading(true)

        try {

            const generateWordsPrompt = prompts[0].replace("{types}", types).replace("{topic}", topic).replace("{totalWords}", total)
            let response = await execute(generateWordsPrompt)

            const wordList = JSON.parse(response)

            setOutputWordList(wordList)

            console.log("wordList --> ", wordList)

            const generateCluesPrompt = prompts[1].replace("{words}", JSON.stringify(wordList))

            response = await execute(generateCluesPrompt)

            console.log("clue response --> ", response)

            setOutputClueList(JSON.parse(response))

        } catch (e) {
            setErrorMessage(`${e.message}`)
        }

        setLoading(false)


    }, [loading, prompts, types, topic, total])

    return (
        <div class="flex-1 flex flex-col">
            <div class="p-6 flex-grow bg-gray-900 text-white flex items-center justify-center">
                <div class=" w-full  mx-auto">
                    <div class="text-center">
                        <h1 class="text-2xl text-white font-bold mb-4">1-Click Crossword</h1>
                        <p class="text-sm text-gray-300 mb-2">1. Click on "Set OpenAI Key" to enter your API key</p>
                        <p class="text-sm text-gray-300 mb-2">2. Fill out the prompt template provided below</p>
                        <p class="text-sm text-gray-300 mb-2">3. Execute the task, review the generated words and clues, and hit "Save"</p>
                    </div>
                    <div class="w-full lg:w-1/2 py-2 mx-auto px-4 mt-6 bg-gray-700 rounded-lg">
                        <div className="grid grid-cols-7 p-2 gap-3">
                            <div class="col-span-3">
                                <label class="block text-sm font-medium text-gray-300">Types</label>
                                <input placeholder="common words" onChange={(e) => setTypes(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" type="text" />
                                <p class=" text-gray-300 mt-1 text-xs">
                                    Ex. cities name,  characters name
                                </p>
                            </div>
                            <div class="col-span-3">
                                <label class="block text-sm font-medium text-gray-300">Topic</label>
                                <input placeholder="the Matrix movies" onChange={(e) => setTopic(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" type="text" />
                                <p class=" text-gray-300 mt-1 text-xs">
                                    Ex. Bitcoin whitepaper, children book
                                </p>
                            </div>
                            <div class="col-span-1">
                                <label class="block text-sm font-medium text-gray-300">Words</label>
                                <select value={total} onChange={(e) => setTotal(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base">
                                    <option value="60">60</option>
                                    <option value="40">40</option>
                                    <option value="20">20</option>
                                    {/* <option value="10">10</option> */}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="text-center m-5">
                        <button onClick={onExecute} class={`bg-blue-500 text-white py-2 px-4 rounded-lg ${loading && "opacity-50"}`}>Execute</button>
                        <button onClick={() => (outputWordList.length > 0 && outputClueList.length > 0) && setSaveModal(true)} class={`bg-blue-500 text-white py-2 ml-2 px-4 rounded-lg ${(outputWordList.length == 0 || outputClueList.length === 0) && "opacity-50"}`}>Save</button>
                    </div>
                    {errorMessage && (
                        <p class="text-sm text-center text-blue-500 mb-2">{errorMessage}</p>
                    )}
                    {loading && (
                        <p class="text-sm text-center text-white mb-2">Executing...</p>
                    )}
                    <div class="relative w-full lg:w-3/4 max-h-60 mt-6 mx-auto bg-gray-700 overflow-y-auto rounded ">
                        <table class="w-full  text-sm mx-auto text-left text-gray-300  ">
                            <tbody>
                                {outputWordList.map((item, index) => {
                                    return (
                                        <tr key={index} class="border-b">
                                            <th scope="row" class="p-2">
                                                #{index + 1}
                                            </th>
                                            <td class="p-2">
                                                {item}
                                            </td>
                                            <td class="p-2">
                                                {outputClueList[index] || "wait for a moment..."}
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>

                    </div>
                    {
                        outputWordList.length > 0 && (
                            <div class="text-center mt-2">
                                <p class="text-sm text-gray-300 mb-2">If you are not satisfied with the result, you can try execute it again</p>
                            </div>
                        )
                    }
                </div>
            </div>
            {showSaveModal && (
                <div class="fixed inset-0 flex items-center justify-center z-50">
                    <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div class="relative bg-gray-800 p-6 w-full max-w-2xl rounded-lg">
                        <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-400" onClick={closeSaveModal}>
                            <X />
                        </button>
                        <div>
                            <div class="mt-4 mb-4">
                                <div class="grid grid-cols-3 gap-2">
                                    <div class="col-span-1">
                                        <label for="apiKey" class="block text-sm font-medium text-gray-300">Name</label>
                                        <input value={puzzleName} placeholder="Fun Puzzle" onChange={(e) => setPuzzleName(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" type="text" />
                                    </div>
                                    <div class="col-span-2">
                                        <label for="apiKey" class="block text-sm font-medium text-gray-300">Short Description</label>
                                        <input value={puzzleDetails} onChange={(e) => setPuzzleDetails(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" type="text" />

                                    </div>
                                </div>
                            </div>
                            {errorMessage && (
                                <p class="text-sm text-center text-blue-500 ">{errorMessage}</p>
                            )}
                            <div class="flex justify-end">
                                <button class="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={onSave}>Confirm</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default CreateContainer