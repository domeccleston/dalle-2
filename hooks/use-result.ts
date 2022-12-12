import React, { useState, useEffect, useRef } from "react";

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
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

// useInterval(
//     async () => {
//       const res = await fetch(`/api/poll?id=${messageId}`);
//       const json = await res.json();
//       if (res.status === 200) {
//         setLoading(false);
//         setImage(json.data[0].url);
//       }
//     },
//     loading ? 1000 : null
//   );

export const useResult = (interval = 1000) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [id, setId] = useState();

  useInterval(async () => {
    const pollingEndpoint = await fetch(`https://qstash-proxy.vercel.app/${id}`);
    const json = await pollingEndpoint.json();
    if (pollingEndpoint.status === 200) {
      setLoading(false);
      setResult(json);
    }
  }, loading ? interval : null)

  return { setId, loading, setLoading, result };
};
