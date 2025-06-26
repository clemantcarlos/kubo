export const initialState: null = null

export const USER_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SIGNUP: 'SIGNUP'
}
// TODO: CAMBIAR TIPOS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function userReducer(state: any, action: any) {
  const {payload: actionPayload, type: actionType} = action 
  switch (actionType) {
    case USER_ACTIONS.LOGIN: {
      const newState = structuredClone(actionPayload)
      localStorage.setItem('user-token', JSON.stringify(newState.tokens))
      return newState
    }
  }
  return state
}