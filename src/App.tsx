import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar";

import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Order from "./pages/Order";
import User from "./pages/User";
import AddProduct from "./pages/Addproduct";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
          <Navbar />

          <main className="flex-1 p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Product />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/users" element={<User />} />
            </Routes>
          </main>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;