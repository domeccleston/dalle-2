import { useState } from "react";
import Image from "next/image";
import cn from "classnames";

import { useInterval } from "../hooks/use-interval";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`);
      const json = await res.json();
      console.log(json);
      if (res.status === 200) {
        setLoading(false);
        setIsImageLoading(true);
        setImage(json.data[0].url);
      }
    },
    loading ? 1000 : null
  );

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/image?prompt=${prompt}`);
    const json = await response.json();
    setMessageId(json.id);
    console.log(messageId);
  }

  return (
    <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
          Dall-E 2 image generator
        </h1>
        <form className="flex w-full sm:w-auto flex-col sm:flex-row" onSubmit={submitForm}>
          <input
            className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
            type="text"
            placeholder="Prompt for DALL-E"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="shadow-sm sm:w-[90px] py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
            type="Submit"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            {!loading ? 'Submit' : ''}
          </button>
        </form>
        <div className="flex items-center justify-center">
          {image && (
            <Image
              alt={`Dall-E representation of: ${prompt}`}
              className={cn(
                "duration-700 ease-in-out mt-10 rounded-md shadow-md",
                isImageLoading
                  ? "grayscale blur-xl"
                  : "grayscale-0 blur-0"
              )}
              src={image}
              width="400"
              height="400"
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
