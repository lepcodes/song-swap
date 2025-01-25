import { Checkbox } from "./ui/checkbox";

export default function Track({name, cover, artist}){
  console.log(artist)
  return (
    <>
      <div className="flex flex-row gap-5 w-full items-center pl-0">
        <Checkbox/>
        <div className="flex flex-row items-center gap-2">
          <img className="w-16 h-16 rounded-xl" src={cover} alt="cover"/>
          <div className="h-16 flex flex-col justify-evenly gap-2">
            <h1>{name}</h1>
            <div className="flex">
              <span className="text-sm p-1 text-gray-600 bg-gray-100 rounded-md ">
                {artist}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}