export const initialStore = () => {
  return {
    shelters: [],
    userAuth: localStorage.getItem("userToken") || null,
    currentUser: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    adminUserAuth: localStorage.getItem("adminUserToken") || null,
    shelterAuth: localStorage.getItem("sheltertoken") || null,
    currentShelter: JSON.parse(localStorage.getItem("shelter") || "null"),
    veterinarianAuth: localStorage.getItem("veterinariantoken") || null,
    currentVeterinarian: JSON.parse(localStorage.getItem("veterinarian") || "null"),
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "set_user_auth":
      localStorage.removeItem("adminUserToken");
      localStorage.removeItem("sheltertoken");
      localStorage.removeItem("shelter");
      localStorage.removeItem("veterinariantoken");
      localStorage.removeItem("veterinarian");

      return {
        ...store,
        userAuth: action.payload,
        adminUserAuth: null,
        shelterAuth: null,
        currentShelter: null,
        veterinarianAuth: null,
        currentVeterinarian: null,
      };

    case "set_current_user":
      return {
        ...store,
        currentUser: action.payload,
      };

    case "set_admin_auth":
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sheltertoken");
      localStorage.removeItem("shelter");
      localStorage.removeItem("veterinariantoken");
      localStorage.removeItem("veterinarian");

      return {
        ...store,
        adminUserAuth: action.payload,
        userAuth: null,
        currentUser: null,
        shelterAuth: null,
        currentShelter: null,
        veterinarianAuth: null,
        currentVeterinarian: null,
      };

    case "set_shelter_auth":
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminUserToken");
      localStorage.removeItem("veterinariantoken");
      localStorage.removeItem("veterinarian");

      return {
        ...store,
        shelterAuth: action.payload,
        userAuth: null,
        currentUser: null,
        adminUserAuth: null,
        veterinarianAuth: null,
        currentVeterinarian: null,
      };

    case "set_current_shelter":
      return {
        ...store,
        currentShelter: action.payload,
      };

    case "set_current_pet":
      return {
        ...store,
        currentPet: action.payload,
      };

    case "set_veterinarian_auth":
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminUserToken");
      localStorage.removeItem("sheltertoken");
      localStorage.removeItem("shelter");

      return {
        ...store,
        veterinarianAuth: action.payload,
        userAuth: null,
        currentUser: null,
        adminUserAuth: null,
        shelterAuth: null,
        currentShelter: null,
      };

    case "set_current_veterinarian":
      return {
        ...store,
        currentVeterinarian: action.payload,
      };

    case "load_data": {
      const { nuevosShelters } = action.payload;
      return {
        ...store,
        shelters: nuevosShelters,
      };
    }
    default:
      throw Error("Unknown action.");
  }
}