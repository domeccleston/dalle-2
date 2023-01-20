import Link from "next/link";

export default function Redirect() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="font-bold text-5xl w-[800px] text-center">
        This deployment has been disabled due to OpenAI API costs.
      </h1>
      <p className="mt-4 w-[800px] text-center">
        See the{" "}
        <Link
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/domeccleston/dalle-2"
        >
          Github repo
        </Link>{" "}
        for an example of how you can deploy and host your own version.
      </p>
    </div>
  );
}
