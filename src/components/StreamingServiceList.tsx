import Image from "next/image";
import { useServiceStore } from "../stores/useServiceStore";
import { availableServices, ServiceKeys, Service } from "../types/services";

export default function StreamingServiceList({source} : { source: string}){  

  const {setOriginService, setTargetService} = useServiceStore((state) => state)

  const handleClick = (service: Service) => {
    if (!service.available){
      return
    }
    return(
      () => {
        if(source === 'origin'){
          setOriginService(service)
        }
        else if(source === 'target'){
          setTargetService(service)
        }
      }
    )
  }

  return (
    <>
      <div className="p-4 overflow-y-a  uto flex flex-wrap justify-evenly gap-10">
        {ServiceKeys.map((key) => {
          const service = availableServices[key]
          return (
            <div key={service.name} 
              className={`flex flex-col gap-2 justify-center items-center border p-5 rounded-xl ${service.available ? 'hover:bg-gray-100 hover:cursor-pointer ' : 'opacity-20'}`}
              onClick={handleClick(service)}
            >
              <Image src={service.logo} alt={service.name} width={160} height={160}/>
              <div className="text-base">
                {service.name}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}