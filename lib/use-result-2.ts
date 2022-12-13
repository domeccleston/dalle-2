import React, { useState, useEffect, useRef } from "react";

/**
 * internal utility
 */
const useInterval = (callback: () => any, delay?: number) => {
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
        if (delay) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};


type UseResult<TArgs, TResult> = {
    loading: boolean
    result: TResult | null
    error: string | null
    create: (args: TArgs) => Promise<void> // maybe name it `mutate` like trpc, react-query and swr do
}



// I don't think they'd be able to change the qstash-proxy URL. 
// All good let's keep it, doesn't hurt to have the option
type Options = {

    /**
     * Polling interval in milliseconds
     */
    interval?: number
    path: string,

    /**
     * Url to https://qstash-proxy.vercel.app
     * 
     * @default `https://qstash-proxy.vercel.app`
     */
    proxyUrl?: string

}

export function useResult<TArgs extends Record<string, unknown>, TResult extends Record<string, unknown>>({
    interval = 5000,
    path,
    proxyUrl = "https://qstash-proxy.vercel.app"
}: Options): UseResult<TArgs, TResult> {


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<TResult | null>(null)
    const [id, setId] = useState<string | null>(null)

    // this is wrong though
    // we can check it here as well no?
    // basically ensure that if it returns something other than ID it errors
    // oh yeah but thats runtime
    // i think it does have to be BE
    // yeah was thinking the same, lets do that afte

    // we can add a helper for the backend that ensures the response has { id: string }


    const create = async (args: TArgs): Promise<void> => {
        setLoading(true)
        const res = await fetch(path, {
            method: "POST",
            headers: {
                "Authorization": "TODO:"
            },
            body: JSON.stringify(args)
        })
        if (res.status !== 200) {
            throw new Error(await res.text())
        }
        const json = await res.json() as { id?: string }
        if (!json.id) {
            throw new Error("Api must return at least: { id: string }")
        }
        setId(json.id)
    }




    useInterval(async () => {
        const res = await fetch(`${proxyUrl}/api/poll?id=${id}`, {
            keepalive: true
        });
        if (res.status !== 200) {
            console.warn("Polling failed:", await res.text()) // just to debug for now
            return
        }
        const json = await res.json();

        setLoading(false);
        setResult(json);
        setId(null) // to stop the interval
    }, id ? interval : undefined)





    return { create, loading, result, error }
}

const { result, loading, create } = useResult({ path: '/api/image' })

// would be nice but how can we pass the prompt here?  
// haha
// the barrier is the need to use an api route

// MAGIC
// await create({ prompt: "Draw rauchg riding a balloon" })


// my ts is not working at all :D

/* JSX EXAMPLE */

// export const Component = (): JSX.Element => {

//     // this looks great, possible for it to be optional though so if you wanna just go useResult({ path: 'api' }) it works?
    // so ts noobs like me can use it
//     const { result, loading, create } = useResult<{ prompt: string }, { url: string }>({ path: '/api/image' })
// 
//     const [prompt, setPrompt] = useState("")
//     if (loading) {
L"oading"        return <div>Loading < /div>
//     }
        //     return result
    //         ?
    //         <div>{ result } < /div>
    //         :
    //         <form onsubmit(() => create({ prompt })) >
    //         <input {/* setPrompt(...)*/ } />
    //         <button>Create < /button>
            < /form>

// 








type Create<TArgs> = (args: TArgs)=>Promise<{id: string}>  

    const defaultCreate: Create =    ( arg s:   T Args) =  >{ 
    const res = await fetch(path, {     method: "POST",
            headers: 
        {
        "Authorization": "TODO:"
        },
        bod : JSON.stringify(args)
    })  
    if (   .status !== 200) {
           throw new Error(await res.text())
   } json = await res.json() as { id?: string } 
}    
    }