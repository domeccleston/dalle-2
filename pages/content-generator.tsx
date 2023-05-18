import cn from "classnames";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

function ContentGenerator() {
  const [placeInput, setPlaceInput] = useState("");
  const [result, setResult] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place: placeInput }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/image?prompt=${result}`);
        const data = await response.json();

        if (response.status !== 202) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setImage(data.image);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        }
      }
    };

    if (result) fetchData();
  }, [result]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col py-16">
      <h1 className="text-3xl font-bold">Generador de contenido</h1>

      <section className="mt-4 flex flex-col">
        <div className="rounded border border-solid p-4 bg-white">
          <form onSubmit={onSubmit}>
            <label htmlFor="destiny">
              Destino:
              <input
                id="destiny"
                type="text"
                className="ml-2 h-8 rounded border border-solid px-2 shadow"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="ml-2 h-8 rounded bg-sky-600 px-4 text-white shadow hover:bg-sky-700 disabled:bg-slate-500 disabled:hover:bg-slate-500"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Enviar"}
            </button>
          </form>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {result && <p className="whitespace-pre-line">{result}</p>}
          {loading && (
            <div className="mt-4 space-y-4">
              <div className="h-2 w-3/12 rounded bg-zinc-500" />
              <div className="h-2 w-5/12 rounded bg-zinc-500" />
              <div className="h-2 w-4/12 rounded bg-zinc-500" />
              <div className="h-2 w-3/12 rounded bg-zinc-500" />
            </div>
          )}
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center mt-4">
        {result && !image && <div>Generating image...</div>}

        {image && (
          <div className="w-full sm:w-[400px] h-[400px] rounded-md shadow-md relative">
            <Image
              height={400}
              width={400}
              alt={`Dall-E representation of: ${result}`}
              className={cn(
                "rounded-md shadow-md h-full object-cover opacity-100"
              )}
              src={`data:image/png;base64,${image}`}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default ContentGenerator;
