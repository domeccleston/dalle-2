import { useState } from "react";
import Image from "next/image";

import { useInterval } from "../hooks/use-interval";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`);
      const json = await res.json();
      console.log(json);
      if (res.status === 200) {
        setLoading(false);
        setImage(json.data[0].url);
      }
    },
    loading ? 1000 : null
  );

  async function submitForm(e) {
    e.preventDefault();
    const response = await fetch(`/api/image?prompt=${prompt}`);
    const json = await response.json();
    setMessageId(json.id);
    console.log(messageId);
    setLoading(true);
  }

  return (
    <div className="antialiased mx-auto py-20 h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-900">
          Dall-E 2 image generator
        </h1>
        <form className="flex" onSubmit={submitForm}>
          <input
            className="shadow-sm rounded-sm px-3 py-2 min-w-[600px]"
            type="text"
            placeholder="Prompt for DALL-E"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="shadow-sm inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 py-2 ml-2 rounded-md hover:bg-green-500"
            type="Submit"
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Submit
          </button>
        </form>
        <div className="flex items-center justify-center">
          {image && (
            <img
              className="mt-10 rounded-md shadow-md"
              src={image}
              width="400"
              height="400"
            />
          )}
        </div>
      </div>
    </div>
  );
}
