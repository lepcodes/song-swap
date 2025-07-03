import {create} from 'zustand'
import { Service } from '../types/services'

interface ServiceState {
    isAuthenticated: boolean,
    originService: Service | null,
    targetService: Service | null,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
    setOriginService: (originService: Service) => void,
    setTargetService: (targetService: Service) => void
}

export const useServiceStore = create<ServiceState>((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => {
        set({isAuthenticated: isAuthenticated})
    },
    originService: null,
    setOriginService: (originService) => {
        set({originService: originService})
    },
    targetService: null,
    setTargetService: (targetService) => {
        set({targetService: targetService})
    }
}))