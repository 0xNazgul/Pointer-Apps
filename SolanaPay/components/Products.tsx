import { useRef, useState } from "react";
import { products } from "../lib/products"
import NumberInput from "./NumberInput";

interface Props {
  submitTarget: string;
  enabled: boolean;
}

export default function Products({ submitTarget, enabled }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [priceA, setPriceA] = useState(false);

  return (
    <form method='get' action={submitTarget} ref={formRef}>
      <div className='flex flex-col gap-16'>
        <div className="grid grid-cols-2 gap-8">
          {products.map(product => {
            return (
              <div className="rounded-md bg-white text-left p-8" key={product.id}>
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-sm text-gray-800">{product.description}</p>
                <p className="my-4">
                  <button className="items-center px-20 rounded-md py-2 max-w-fit self-center bg-white text-gray-800 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPriceA(!priceA)}>
                    {priceA ? <span className="mt-4 text-xl font-bold" >{product.priceSol} SOL/{product.unitName}</span> : <span className="mt-4 text-xl font-bold">{product.priceUsd} USD/{product.unitName}</span> }
                  </button>
                </p>
                <div className="mt-1">
                  <NumberInput name={product.id} formRef={formRef} />
                </div>
              </div>
            )
          })}
        </div>
        <button
          className="items-center px-20 rounded-md py-2 max-w-fit self-center bg-gray-900 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!enabled}
        >
          Checkout
        </button>
      </div>
    </form>
  )
}
