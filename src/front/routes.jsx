// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import Breed from "./pages/Breed";
import CreateBreed from "./pages/CreateBreed";
import EditBreed from "./pages/EditBreed";
import EditShelter from "./pages/EditShelter";
import Veterinarian from "./pages/Veterinarian";
import CreateVeterinarian from "./pages/CreateVeterinarian";
import EditVeterinarian from "./pages/EditVeterinarian";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { CreateShelter } from "./pages/CreateShelter";
import { Shelter } from "./pages/Shelter";
import { ShelterView } from "./pages/ShelterView";
import { User } from "./pages/User";
import { PetsList } from "./pages/PetsList";
import { CreatePet } from "./pages/CreatePet";
import { PetDetail } from "./pages/PetDetail";
import { PetView } from "./pages/PetView";
import { Home } from "./pages/Home";
import { AdoptionsList } from "./pages/AdoptionsList";
import { CreateAdoption } from "./pages/CreateAdoption";
import { AdoptionDetail } from "./pages/AdoptionDetail";
import { MedicalAppointmentsList } from "./pages/MedicalAppointmentsList";
import { CreateMedicalAppointment } from "./pages/CreateMedicalAppointment";
import { MedicalAppointmentDetail } from "./pages/MedicalAppointmentDetail";
import { MedicalAppointmentView } from "./pages/MedicalAppointmentView";
import { AdoptionView } from "./pages/AdoptionView";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/createShelter" element={<CreateShelter />} />
      <Route path="/editShelter/:id" element={<EditShelter />} />
      <Route path="/shelter-view/:id" element={<ShelterView />} />
      <Route path="/shelter" element={<Shelter />} />
      <Route path="/user" element={<User />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/create-pet" element={<CreatePet />} />
      <Route path="/pet-view/:id" element={<PetView />} />
      <Route path="/pets" element={<PetsList />} />
      <Route path="/pet-detail/:id" element={<PetDetail />} />
      <Route path="/breed" element={<Breed />} />
      <Route path="/breed/new" element={<CreateBreed />} />
      <Route path="/breed/edit/:id" element={<EditBreed />} />
      <Route path="/veterinarian" element={<Veterinarian />} />
      <Route path="/veterinarian/new" element={<CreateVeterinarian />} />
      <Route path="/veterinarian/edit/:id" element={<EditVeterinarian />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/pets/:id" element={<PetDetail />} />
      <Route path="/create-adoption" element={<CreateAdoption />} />
      <Route path="/adoptions" element={<AdoptionsList />} />
      <Route path="/adoptions/:id" element={<AdoptionDetail />} />
      <Route path="/create-medical-appointment" element={<CreateMedicalAppointment />} />
      <Route path="/medapps" element={<MedicalAppointmentsList />} />
      <Route path="/medapps/:id" element={<MedicalAppointmentDetail />} />
      <Route path="/medapps-view/:id" element={<MedicalAppointmentView />} />
      <Route path="/adoption-view/:id" element={<AdoptionView />} />
    </Route>
  )
);