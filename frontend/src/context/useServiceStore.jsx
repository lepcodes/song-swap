import {create} from 'zustand'

export const useServiceStore = create((set) => ({
    originService: {
        name: '',
        logo: ''
    },
    setOriginService: (originService) => {
        set({originService: originService})
    },
    targetService: {
        name: '',
        logo: ''
    },
    setTargetService: (targetService) => {
        set({targetService: targetService})
    }
}))