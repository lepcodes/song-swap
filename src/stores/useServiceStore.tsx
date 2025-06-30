import {create} from 'zustand'
import { Service } from '../types/services'

interface ServiceState {
    originService: Service | null,
    targetService: Service | null,
    setOriginService: (originService: Service) => void,
    setTargetService: (targetService: Service) => void
}

export const useServiceStore = create<ServiceState>((set) => ({
    originService: null,
    setOriginService: (originService) => {
        set({originService: originService})
    },
    targetService: null,
    setTargetService: (targetService) => {
        set({targetService: targetService})
    }
}))