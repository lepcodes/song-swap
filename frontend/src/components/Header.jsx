import { Button } from "./ui/button"
import '../index.css'

export default function Header() {
  
  return (
    <>
      <nav className="navbar shadow-lg flex flex-1 justify-between items-center bg-white rounded-lg p-2 px-5">
        <h1 className="font-bold text-xl font-playwrite-b tracking-normal">SongSwap</h1>
        <ul className="flex gap-20 items-center h-[50%] text-sm">
          <li>
            <div className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer">Transfer</div>
          </li>
          <li>
            <div className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer">Transfer</div>
          </li>
          <li>
            <div className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300 hover:cursor-pointer">Transfer</div>
          </li>
        </ul>
        <Button className='text-sm' size='sm'>Contact</Button>
      </nav>
    </>
  )
};
