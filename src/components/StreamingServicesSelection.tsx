"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import StreamingServiceList from "./StreamingServiceList";
import { useServiceStore } from "../stores/useServiceStore";
import '../styles/globals.css'
import { Service } from "../types/services";


export default function StreamingServicesSelection() {
  const originService = useServiceStore<Service | null>((state) => state.originService)
  const targetService = useServiceStore<Service | null>((state) => state.targetService)
  const setOriginService = useServiceStore((state) => state.setOriginService)
  const setTargetService = useServiceStore((state) => state.setTargetService)
  return(
    <>
      <div className="selection flex flex-row justify-evenly items-center flex-wrap bg-white rounded-4xl p-4 shadow-xs border border-gray-100">
        <h1 className="text-2xl font-bold text-center">
          Select Streaming Services
        </h1>
        <div className='flex justify-evenly items-center gap-5'>
          <Drawer>
            <div className="relative group">
              <DrawerTrigger className="rounded-3xl hover:cursor-pointer transition-all duration-200" asChild>
                <div className='h-28 w-28 p-2 flex justify-center items-center border border-neutral-300 hover:bg-neutral-100'>
                  {
                    (originService?.name) ?
                    <div className="relative w-full h-full">
                      <Image src={originService.logo} alt={originService.name} fill={true}/>      
                    </div>
                    :
                    <FaPlus className="h-10 w-10 text-neutral-400 group-hover:text-neutral-600" />
                  }
                </div>
              </DrawerTrigger>
              {
                originService?.name &&
                <button 
                  onClick={() => setOriginService(null)}
                  className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 p-0.5 rounded-full bg-white border-2 border-neutral-600 text-black hover:cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-500 transition-all duration-100">
                  <RxCross2 className="h-6 w-6"/>
                </button>
              }
            </div>

            <DrawerContent className='max-h-[90vh] pb-4 bg-white'>

              <DrawerHeader className='flex flex-col items-center'>
                <DrawerTitle>Select Origin Service</DrawerTitle>
                <DrawerDescription>Choose your service</DrawerDescription>
              </DrawerHeader>

              <DrawerClose>
                <StreamingServiceList source={'origin'}/>
                <div className='group absolute top-3 right-3 rounded-lg text-neutral-400 p-2 hover:bg-neutral-100 hover:cursor-pointer'>  
                  <RxCross2 className="w-8 h-8 group-hover:text-black"/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>

          <FaArrowRightLong className="w-12 h-12 text-neutral-500"/>

          <Drawer>
            <div className="relative group">
              <DrawerTrigger className="rounded-3xl hover:cursor-pointer transition-all duration-200" asChild>
                <div className='h-28 w-28 p-2 flex justify-center items-center border border-neutral-300 hover:bg-neutral-100'>
                  {
                    (targetService?.name) ?
                    <div className="relative w-full h-full">
                      <Image src={targetService.logo} alt={targetService.name} fill={true}/>
                    </div>
                    :
                    <FaPlus className="h-10 w-10 text-neutral-400 group-hover:text-neutral-600" />
                  }
                </div>
              </DrawerTrigger>
              {
                targetService?.name &&
                <button 
                  onClick={() => setTargetService(null)}
                  className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 p-0.5 rounded-full bg-white border-2 border-neutral-600 text-black hover:cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-500 transition-all duration-100">
                  <RxCross2 className="h-6 w-6"/>
                </button>
              }
            </div>
            
            <DrawerContent className='max-h-[90vh] pb-4 bg-white'>

              <DrawerHeader className='flex flex-col items-center'>
                <DrawerTitle>Select Destination Service</DrawerTitle>
                <DrawerDescription>Choose your service</DrawerDescription>
              </DrawerHeader>

              <DrawerClose>
                <StreamingServiceList source={'target'}/>
                <div className='group absolute top-3 right-3 rounded-lg text-neutral-400 p-2 hover:bg-neutral-100 hover:cursor-pointer'>  
                  <RxCross2 className="w-8 h-8 group-hover:text-black"/>
                </div>
              </DrawerClose>

            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>    
  )
}