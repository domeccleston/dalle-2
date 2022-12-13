import { useEffect, useState } from "react";
import Image from "next/image";
import cn from "classnames";
import { Toaster, toast } from "react-hot-toast";

import { useResult } from "../lib/andreas";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [canShowImage, setCanShowImage] = useState(false);


  /**
   * Advanced with custom fetcher
   */
  // const fetcher = async (args: { prompt: string }) => {
  //   const res = await fetch(`/api/image?prompt=${args.prompt}`)
  //   return await res.json()
  // }

  // const { create, loading, result, error } = useResult<{ prompt: string }, { data: { url: string }[] }>({ fetcher });


  /**
   * Simple with path
   */


  const { create, loading, result, error } = useResult({ path: "/api/art" });
  console.log({ loading, error, result })

  useEffect(() => {
    if (error) {
      alert(error)
    }
  }, [error])
  async function submitForm(e) {
    e.preventDefault();
    await create({ prompt })
  }

  //@ts-ignore
  const image = result?.data[0]?.url;

  const showLoadingState = loading || (image && !canShowImage);

  return (
    <div className="h-screen px-4 py-20 mx-auto antialiased bg-gray-100">
      <Toaster />
      <div className="flex flex-col items-center justify-center">
        <h1 className="pb-10 text-5xl font-bold tracking-tighter text-gray-800">
          Dall-E 2 image generator
        </h1>
        <form
          className="flex flex-col w-full mb-10 sm:w-auto sm:flex-row"
          onSubmit={submitForm}
        >
          <input
            className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
            type="text"
            placeholder="Prompt for DALL-E"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="min-h-[40px] shadow-sm sm:w-[100px] py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
            type="submit"
          >
            {showLoadingState && (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {!showLoadingState ? "Generate" : ""}
          </button>
        </form>
        <div className="relative flex items-center justify-center w-full">
          {image && (
            <div className="w-full sm:w-[400px] h-[400px] rounded-md shadow-md relative">
              <Image
                alt={`Dall - E representation of: ${prompt}`}
                className={cn(
                  "opacity-0 duration-1000 ease-in-out rounded-md shadow-md h-full object-cover",
                  { "opacity-100": canShowImage }
                )}
                src={image}
                fill={true}
                onLoadingComplete={() => {
                  setCanShowImage(true);
                }}
              />
            </div>
          )}

          <div
            className={cn(
              "w-full sm:w-[400px] absolute top-0.5 overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5",
              {
                "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transparent":
                  showLoadingState,
                "opacity-0 shadow-none": canShowImage,
              }
            )}
          >
            <div
              className={cn(
                "w-full sm:w-[400px] h-[400px] bg-gray-200 rounded-md shadow-md flex items-center justify-center"
              )}
            >
              <p className="text-sm text-gray-400 uppercase">
                {showLoadingState
                  ? "Generating image...."
                  : "No image selected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
