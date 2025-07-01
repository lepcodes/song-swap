import { Separator } from "../components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer"

// import { Plus, MoveRight, X } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import StreamingServiceList from "../components/StreamingServiceList";
import { useServiceStore } from "../context/useServiceStore";
import '../index.css'



export default function StreamingServicesSelection() {
  const originService = useServiceStore((state) => state.originService)
  const targetService = useServiceStore((state) => state.targetService)
  return(
    <>
      <div className="selection shadow-lg flex flex-row justify-evenly gap-5 items-center flex-wrap bg-white rounded-lg p-4">
        <h1 className="text-2xl font-bold text-center">
          Select Streaming Services
        </h1>
        <Separator orientation='horizontal' className='m-0'/>
        <div className='flex justify-evenly items-center gap-5'>
          <Drawer>
            <DrawerTrigger className="rounded-2xl hover:cursor-pointer" asChild>
              <div className='group h-28 w-28 p-2 flex justify-center items-center border border-gray-200 hover:bg-gray-100'>
              {
                (originService.name) ?
                <img className='' src={originService.logo} alt={originService.name} />                 
                :
                <FaPlus className="h-10 w-10 text-gray-400 group-hover:text-gray-600" />
                }
              </div>
            </DrawerTrigger>

            <DrawerContent className='max-h-[90vh] pb-4'>

              <DrawerHeader className='flex flex-col items-center'>
                <DrawerTitle>Select Origin Service</DrawerTitle>
                <DrawerDescription>Choose your service</DrawerDescription>
              </DrawerHeader>

              <DrawerClose>
                <StreamingServiceList source={'origin'}/>
                <div className='absolute top-3 right-3 rounded-lg text-gray-400 p-2 hover:bg-gray-100'>
                  <RxCross2 className="w-8 h-8"/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>

          <FaArrowRightLong className="w-12 h-12 text-gray-600"/>

          <Drawer>
            <DrawerTrigger className="rounded-2xl hover:cursor-pointer" asChild>
              <div className='group h-28 w-28 p-2 flex justify-center items-center border border-gray-200 hover:bg-gray-100'>
              {
                (targetService.name) ?
                <img className='' src={targetService.logo} alt={targetService.name} />                 
                :
                <FaPlus className="h-10 w-10 text-gray-400 group-hover:text-gray-600" />
                }
              </div>
            </DrawerTrigger>
            
            <DrawerContent className='max-h-[90vh] pb-4'>

              <DrawerHeader className='flex flex-col items-center'>
                <DrawerTitle>Select Destination Service</DrawerTitle>
                <DrawerDescription>Choose your service</DrawerDescription>
              </DrawerHeader>

              <DrawerClose>
                <StreamingServiceList source={'target'}/>
                <div className='absolute top-3 right-3 rounded-lg text-gray-400 p-2 hover:bg-gray-100'>
                  <RxCross2 className="w-8 h-8"/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>    
  )
}