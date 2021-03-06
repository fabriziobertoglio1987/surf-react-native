// Action login
let nextUserId = 0
export const login = user => ({
  type: "LOGIN",
  payload: { id: ++nextUserId, user }
})

const initialState = { 
  type: "INITIAL_STATE",
  payload: { id: nextUserId, user: {email: "guest", password: "guest"}}
}

// Reducer authentication
export const authentication = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": 
      return Object.assign({}, state)
    default: 
      return state
  }
}
