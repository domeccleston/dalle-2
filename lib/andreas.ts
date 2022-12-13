import React, { useState, useEffect, useRef } from "react";



/**
 * internal utility
 */
const useInterval = (callback: () => unknown, interval: number, enabled: boolean) => {
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
        if (enabled) {
            const id = setInterval(tick, interval);
            return () => clearInterval(id);
        }
    }, [interval, enabled]);
};


/**
 * The CreateHandler needs to be implemented by the user and is most likely just a simple fetch call 
 * to their own API.
 * 
 * The important part is that it must return an id 
 */
type CreateHandler<TArgs> = (args: TArgs) => Promise<{ id: string }>


type UseResult<TArgs, TResult> = {
    loading: boolean
    result: TResult | null
    error: string | null
    create: (args: TArgs) => Promise<void> // maybe name it `mutate` like trpc, react-query and swr do
}



// I don't think they'd be able to change the qstash-proxy URL. 
// All good let's keep it, doesn't hurt to have the option
type Options<TArgs> = {

    /**
     * Polling interval in milliseconds
     */
    interval?: number
    handle: CreateHandler<TArgs>,

    /**
     * Url to https://qstash-proxy.vercel.app
     * 
     * @default `https://qstash-proxy.vercel.app`
     */
    proxyUrl?: string

    /**
     * Stop polling after x milliseconds
     */
    timeout?: number

}

export function useResult<TArgs, TResult>({
    interval = 5000,
    proxyUrl = "https://qstash-proxy.vercel.app",
    handle,
    timeout = 900_000 // 15min
}: Options<TArgs>): UseResult<TArgs, TResult> {

    /**
     * Whether it should poll right now
     * This is different than `loading` because polling only starts after we receive the id
     * Loading already starts when we go ask for the id
     */
    const [poll, setPoll] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<TResult | null>(null)
    const [id, setId] = useState<string | null>(null)

    /**
     * Small wrapper around the user provided createHandler to set states
     */
    const create = async (args: TArgs): Promise<void> => {
        try {
            setLoading(true)
            const { id } = await handle(args)
            console.log({ id })
            setId(id)
            setPoll(true)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                throw err
            }
        }
    }


    /**
     * Stop polling after the defined timeout
     */
    useEffect(() => {
        if (!poll) {
            return
        }
        const timeoutId = setTimeout(() => {
            setPoll(false)
            setError("Timeout reached")
        })
        return () => clearTimeout(timeoutId)
    }, [poll])

    useInterval(async () => {
        console.log("Interval ticking")
        const res = await fetch(`${proxyUrl}/api/poll?id=${id}`, {
            keepalive: true
        });


        switch (res.status) {
            case 200:
                // Result is available
                const json = await res.json();
                console.log({ json })

                setLoading(false);
                setResult(json);
                setPoll(false)
                break

            case 404:
                // Result not yet available, keep polling
                console.debug("Polling failed:", await res.text()) // just to debug for now
                break

            default:
                // unexpected error
                setLoading(false);
                setError(await res.text())
                setPoll(false)
                break
        }


    }, interval, poll)





    return { create, loading, result, error }
}
