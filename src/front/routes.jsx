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
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { PetsList } from "./pages/PetsList";
import { CreatePet } from "./pages/CreatePet";
import { PetDetail } from "./pages/PetDetail";
import { PetView } from "./pages/PetView";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/create-pet" element={<CreatePet />} />
      <Route path="/pet-view/:id" element={<PetView />} />
      <Route path="/pets" element={<PetsList />} />
      <Route path="/pet-detail/:id" element={<PetDetail />} />
      <Route path="/" element={<Breed />} />

      <Route path="/breed" element={<Breed />} />

      <Route path="/breed/new" element={<CreateBreed />} />

      <Route path="/breed/edit/:id" element={<EditBreed />} />

      <Route path="/single/:theId" element={<Single />} />

      <Route path="/demo" element={<Demo />} />
    </Route>
  )
);