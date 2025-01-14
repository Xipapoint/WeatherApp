import { useCallback, useMemo, useState } from "react"


interface UseModalReturn {
    isModalOpen: boolean
    openModal: (content: React.ReactNode) => void
    closeModal: () => void
    modalContent: React.ReactNode | null
  }

export const useModal = (): UseModalReturn => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)
  
    const openModal = useCallback((content: React.ReactNode) => {
      setModalContent(content)
      setIsModalOpen(true)
    }, [])
  
    const closeModal = useCallback(() => {
      setModalContent(null)
      setIsModalOpen(false)
    }, [])
  
    const modalState = useMemo(() => ({
      isModalOpen,
      openModal,
      closeModal,
      modalContent,
    }), [isModalOpen, modalContent, openModal, closeModal])
  
    return modalState
  }