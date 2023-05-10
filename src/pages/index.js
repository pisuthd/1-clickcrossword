import { useCallback, useContext, useEffect, useState } from "react"
import { Plus, PlusCircle, X, Trash2 } from "react-feather"

import { PuzzleGeneratorContext } from '@/hooks/usePuzzleGenerator'
import GameContainer from "@/containers/game"
import CreateContainer from "@/containers/create"

export default function Home() {

  const { crosswordList, saveApikey, apiKey , removeItem} = useContext(PuzzleGeneratorContext)

  const [selected, setSelected] = useState()
  const [showApiModal, setShowApiModal] = useState(false);

  const [key, setKey] = useState(apiKey)

  useEffect(() => {
    apiKey && setKey(apiKey)
  }, [apiKey])

  const closeModal = () => {
    setShowApiModal(false);
  };

  const onSave = useCallback(() => {
    saveApikey(key)
    setShowApiModal(false)
  }, [key, saveApikey])


  return (
    <main>
      <div class="flex h-screen">
        {/* Sidebar */}
        <div class="bg-gray-800 w-80 flex-none flex flex-col">
          <div class="text-white p-6 flex flex-col justify-between h-full">
            <div class="overflow-y-auto mb-4">
              <div>
                <button onClick={() => setSelected()} class="w-full hover:bg-blue-700 text-white bg-transparent p-3 text-sm flex border border-white rounded-md">
                  +{` `}
                  <span class="ml-3">
                    Make Your Crossword
                  </span>
                </button>
              </div>
              <div class="space-y-2 mt-6">
                <h2 class="text-xl font-semibold mb-2">All Crosswords</h2>
                <div class="text-sm">
                  {crosswordList.map((item, index) => (
                    <div key={index} class="grid grid-cols-11">
                      <div onClick={() => setSelected(item.name)} class={`p-4  col-span-10 rounded-lg cursor-pointer ${selected === item.name && "bg-gray-700 "}`}>
                        <h3 class="font-semibold">{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      {index > 2 && (
                        <div onClick={() => removeItem(item.name)} class="col-span-1 flex items-center justify-center">
                          <div class="cursor-pointer mx-auto">
                            <Trash2 size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div>
                <div class="flex items-center space-x-2">
                  <h2 class="text-xl font-semibold">1-Click Crossword</h2>
                </div>
                <div class="flex items-center space-x-2">
                  <small>Make a crossword in a few seconds with GPT</small>
                </div>
                <div class="text-sm mt-1">
                  <a href="https://github.com/pisuthd/1-clickcrossword" target="_blank" class="text-blue-500 hover:text-blue-700">GitHub</a> |{` `}
                  <a href="https://twitter.com/pisuthd" target="_blank" class="text-blue-500 hover:text-blue-700">Twitter</a> |{` `}
                  <a onClick={() => setShowApiModal(true)} class="text-blue-500 cursor-pointer  hover:text-blue-700">Set OpenAI Key</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        {selected && <GameContainer selected={selected} />}
        {!selected && <CreateContainer />}
      </div>

      {showApiModal && (
        <div class="fixed inset-0 flex items-center justify-center z-50">
          <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div class="relative bg-gray-800 p-6 w-full max-w-2xl rounded-lg">
            <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-400" onClick={closeModal}>
              <X />
            </button>
            <div>
              <div class="mt-4 mb-4">
                <label for="apiKey" class="block text-sm font-medium text-gray-300">Your OpenAI API Key</label>
                {/* <input value={key} placeholder="sk-..." id="apiKey" onChange={(e) => setKey(e.target.value)} class="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" type="text" /> */}
                <p class=" text-gray-300 mt-1 text-xs">The key will be saved on your browser and use it on your own risk</p>
              </div>
              <div class="flex justify-end">
                <button class="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={onSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </main>
  )
}
