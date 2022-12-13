import React, { useState, useEffect, useRef } from "react";

export const useInterval = (callback: () => any, delay: number) => {
  const savedCallback = useRef();

  useEffect(() => {
    //@ts-ignore
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      //@ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};


/**
 * What `useResult` returns
 */
type UseResult<TResult> = {
  generate: (path: string) => Promise<void>
  loading: boolean
  result: TResult | null
}

// too much detail? -> never enough detail
// sgtm
// i like hiding the fact we're polling though cause it's ugly, but maybe good to have it here

// ill just ping rauchg to add websocket support
// lol, do it

// then remove it :D

// can i say that 'generate' is a certain kind of string, i.e. has to start with '/api/?


/**
 * useResult continuously polls a path with the ID returned from // useResult tries to resolve the result ... idk ..gotta think about this
 * the API route passed to 'generate'.
 * 
 * the returned `result` will be null until it resolves.
 */
export function useResult<TResult = unknown>(interval = 1000): UseResult<TResult> {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TResult | null>(null);
  const [_id, setId] = useState();

  // async function resolveApiRoute(path)<Promise<any>>{

  // }

  async function generate(path: string) {
    setLoading(true);
    const { id } = await (await fetch(path)).json();
    setId(id);
  }

  useInterval(async () => {
    const pollingResult = await fetch(`https://qstash-proxy.vercel.app/api/poll?id=${_id}`);
    const json = await pollingResult.json();
    if (pollingResult.status === 200) {
      setLoading(false);
      setResult(json);
    }
  }, loading ? interval : null)

  return { generate, loading, result };
};


