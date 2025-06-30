import { createContext, PropsWithChildren, useReducer } from "react"; 
import { USER_ACTIONS, userReducer, initialState } from "@/reducers/user";

// TODO: CAMBIAR TIPOS
// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-explicit-any
export const UserContext = createContext<any>(null)

function useUserReducer (){
  const [state, dispatch] = useReducer(userReducer, initialState)
  // TODO: CAMBIAR TIPOS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = (loginData: any) => dispatch({
    type: USER_ACTIONS.LOGIN, 
    payload: loginData
  })

  return {
    state,
    login,
  }
}

export const UserProvider = ({children}: PropsWithChildren) => {
  const { 
    state, 
    login,
  } = useUserReducer()

  return (
    <UserContext.Provider value={{
      user: state,
      login
    }}>
      {children}
    </UserContext.Provider>
  )
}