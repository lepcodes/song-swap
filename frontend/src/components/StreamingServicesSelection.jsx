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

import { Plus, MoveRight, X } from "lucide-react";
import StreamingServiceList from "../components/StreamingServiceList";
import { StreamingServiceContext } from "../context/StreamingServiceContext";
import { useContext } from "react";

export default function StreamingServicesSelection() {
  const {originService, targetService} = useContext(StreamingServiceContext)

  return(
    <>
      <div className="row-span-4 col-span-10 shadow-lg flex flex-row justify-evenly gap-5 items-center flex-wrap bg-white rounded-lg p-4">
        <h1 className="text-3xl font-bold left-10">
          Select Streaming Services
        </h1>
        <Separator orientation='horizontal' className='m-0'/>
        <div className='flex justify-evenly items-center gap-20'>
          <Drawer>
            <DrawerTrigger className="rounded-xl" asChild>
              <div className='group h-24 w-24 p-2 flex justify-center items-center border border-gray-200 hover:bg-gray-100'>
              {
                (originService.name) ?
                <img className='' src={originService.logo} alt={originService.name} />                 
                :
                <Plus className="h-10 w-10 text-gray-400 group-hover:text-gray-600" />
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
                  <X className=""/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>

          <MoveRight className="w-14 h-14 text-gray-600"/>

          <Drawer>
            <DrawerTrigger className="rounded-xl" asChild>
              <div className='group h-24 w-24 p-2 flex justify-center items-center border border-gray-200 hover:bg-gray-100'>
              {
                (targetService.name) ?
                <img className='' src={targetService.logo} alt={targetService.name} />                 
                :
                <Plus className="h-10 w-10 text-gray-400 group-hover:text-gray-600" />
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
                  <X className=""/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>    
  )
}