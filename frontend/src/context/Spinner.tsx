import { useState } from "react";
import { createContext, PropsWithChildren } from "react";

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-explicit-any
export const SpinnerContext = createContext<any>(null);

function useSpinner() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showSpinner = () => setIsLoading(true);
  const hideSpinner = () => setIsLoading(false);

  return { isLoading, showSpinner, hideSpinner };
}

export const SpinnerProvider = ({ children }: PropsWithChildren) => {
  const { isLoading, showSpinner, hideSpinner } = useSpinner();

  return (
    <SpinnerContext.Provider
      value={{
        isLoading,
        showSpinner,
        hideSpinner,
      }}
    >
      {children}
    </SpinnerContext.Provider>
  );
};
