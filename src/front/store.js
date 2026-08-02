export const initialStore = () => {
  return {
    shelters: [],
    userAuth: localStorage.getItem("userToken") || null
  };
};


export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case "set_user_auth":
      return {
        ...store,
        userAuth: action.payload
      };

    case 'set_shelter_auth':
      return {
        ...store,
        shelterAuth: action.payload
      };

    case "load_data": {
      const { nuevosShelters } = action.payload;
      return {
        ...store,
        shelters: nuevosShelters
      };
    }
    default:
      throw Error('Unknown action.');
  }    
}