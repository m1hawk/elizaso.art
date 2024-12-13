'use client'
export default function Error({ error, reset }: any) {
  return (
          <html>
          <body>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
          </body>
          </html>
  )
}