"use client";
import prisma from '../lib/prisma'
import {useState} from "react";



export default function Page() {
  const [error, setError] = useState(false);

  const handleGetError = () => {
    console.log(1111);
    setError(true);
  };

  return (
          <>
            {error ? Error() : <button onClick={handleGetError}>Get Error</button>}
          </>
  );
}