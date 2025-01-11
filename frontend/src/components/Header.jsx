import { Button } from "./ui/button"

export default function Header() {
  
  return (
    <>
      <nav className="row-span-1 col-span-full shadow-lg flex flex-1 justify-between items-center bg-white rounded-lg p-2">
        <h1 className="font-bold text-xl">SongSwap</h1>
        <ul className="flex gap-20 items-center h-[50%]">
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
