  export const initialState: null = null

export const USER_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SIGNUP: 'SIGNUP'
}

export function userReducer(state: any, action: any) {
  const {payload: actionPayload, type: actionType} = action 
  switch (actionType) {
    case USER_ACTIONS.LOGIN: {
      const newState = structuredClone(actionPayload)
      localStorage.setItem('user-token', JSON.stringify(newState.tokens))
      return newState
    }
    default:
      return state
  }
  return state
}