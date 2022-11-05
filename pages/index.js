import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  async function submitForm(e) {
    e.preventDefault();
    const response = await fetch(`/api/image?prompt=${prompt}`);
    const json = await response.json();
    console.log(json);
  }

  return (
    <div className="mx-auto py-20 h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl pb-10 font-bold">Dall-E 2 image generator</h1>
        <form onSubmit={submitForm}>
          <input
            className="shadow-sm rounded-sm px-3 py-2 min-w-[600px]"
            type="text"
            placeholder="Prompt for DALL-E"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="px-4 bg-green-600 text-gray-100 py-2 ml-2 rounded-md hover:bg-green-500" type="Submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
