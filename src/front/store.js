/* export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
} */


export const initialStore = () => {
  return {
    shelters: [],

  };
};


export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case "load_data": {
      const { nuevosShelters } = action.payload; //es la informacion que tu das para que se haga lo que haya en el case, por ejemplo un ID, que te permitirá hacer "algo"
      return {
        ...store,
        shelters: nuevosShelters
      };
    }
    default:
      throw Error('Unknown action.');
  }    
}