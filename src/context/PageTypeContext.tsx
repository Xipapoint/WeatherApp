import React, { createContext, useContext, useMemo, useState } from "react";
enum PAGE_TYPE_ENUM {
    ALL_USERS,
    SAVED
}
interface PageTypeContextType {
    pageType: PAGE_TYPE_ENUM
}

const PageTypeContext = createContext<PageTypeContextType | null>(null);

export const usePageTypeContext = (): PageTypeContextType => {
  const context = useContext(PageTypeContext);

  if (context === null) {
    throw new Error(
      "PageTypeContext cannot be null, please add a context provider."
    );
  }

  return context;
};

export const PageTypeContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
    const [pageType, setPageType] = useState<PAGE_TYPE_ENUM>(PAGE_TYPE_ENUM.ALL_USERS);
    const value = useMemo(() => ({ pageType, setPageType }), [pageType]);
  
  return (
    <PageTypeContext.Provider value={value}>
      {children}
    </PageTypeContext.Provider>
  );
};
