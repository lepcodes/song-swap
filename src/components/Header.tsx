import '../styles/globals.css'
import { Fascinate } from 'next/font/google'

const font = Fascinate({
  weight: '400',
  subsets: ['latin'],
})

export default function Header() {
  
  return (
    <>
      <nav className="navbar flex flex-1 justify-between items-center bg-white rounded-4xl py-3 px-5 shadow-xs border border-gray-200">
        <h1 
          className={`text-2xl tracking-normal ${font.className}`}
        >
          Song Swap
        </h1>
        <ul className="flex gap-20 items-center h-[50%] text-sm">
          <li>
          </li>
        </ul>
      </nav>
    </>
  )
};
