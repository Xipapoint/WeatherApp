import { useState } from "react";


interface UseModalReturn {
    isModalOpen: boolean;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
    modalContent: React.ReactNode | null;
  }

export function useModal(): UseModalReturn {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  
    function openModal(content: React.ReactNode) {
      setModalContent(content);
      setIsModalOpen(true);
    }
  
    function closeModal() {
      setModalContent(null);
      setIsModalOpen(false);
    }
  
    return {
      isModalOpen,
      openModal,
      closeModal,
      modalContent,
    };
  }