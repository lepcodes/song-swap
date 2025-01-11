import { useState } from "react"
import { StreamingServiceContext } from "./StreamingServiceContext"

//Create provider
export const StreamingServiceProvider = ({ children }) => {
    const [originService, setOriginService] = useState({
        name: '',
        logo: ''
    })
    const [targetService, setTargetService] = useState({
      name: '',
      logo: ''
    })
    return (
      <StreamingServiceContext.Provider value={{
         originService,
         setOriginService, 
         targetService, 
         setTargetService}}>
        {children}
      </StreamingServiceContext.Provider>   
    )
  }