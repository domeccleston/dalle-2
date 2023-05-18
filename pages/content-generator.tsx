import { FormEvent, useState } from 'react'

function ContentGenerator() {
  const [placeInput, setPlaceInput] = useState('')
  const [result, setResult] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place: placeInput }),
      })

      const data = await response.json()

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      setResult(data.result)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className='mx-auto flex max-w-3xl flex-col py-16'>
      <h1 className='text-3xl font-bold'>Generador de contenido</h1>

      <section className='mt-4 flex flex-col'>
        <div className='rounded border border-solid p-4 bg-white'>
          <form onSubmit={onSubmit}>
            <label htmlFor='destiny'>
              Destino:
              <input
                id='destiny'
                type='text'
                className='ml-2 h-8 rounded border border-solid px-2 shadow'
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
              />
            </label>
            <button
              type='submit'
              className='ml-2 h-8 rounded bg-sky-600 px-4 text-white shadow hover:bg-sky-700 disabled:bg-slate-500 disabled:hover:bg-slate-500'
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Enviar'}
            </button>
          </form>
          {errorMsg && <p className='text-red-500'>{errorMsg}</p>}
          {result && <p className='whitespace-pre-line'>{result}</p>}
          {loading && (
            <div className='mt-4 space-y-4'>
              <div className='h-2 w-3/12 rounded bg-zinc-500' />
              <div className='h-2 w-5/12 rounded bg-zinc-500' />
              <div className='h-2 w-4/12 rounded bg-zinc-500' />
              <div className='h-2 w-3/12 rounded bg-zinc-500' />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ContentGenerator
