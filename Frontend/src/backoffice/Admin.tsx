import logo from "../assets/cachorraologo.png";
import AdminNavbar from "../component/Admin_navbar";
import { useNavigate } from "react-router-dom";

function Admin() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-amber-50 ">
      <AdminNavbar/>
      <div className="md:px-10 md:py-10 px-4 py-4">
        <p className="text-2xl font-bold">Dashboard</p>
        <p>Bem-vindo ao painel de administração do Cachorrão</p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-2">
            <div className="flex flex-col  w-full h-40 bg-white rounded-xl shadow-xl p-6">
                <p className="text-sm font-bold">Gestão de Categorias</p>
                <p className="text-gray-700 ">Criar, editar e organizar categorias do menu</p>
                <button onClick={() => navigate("/admin/add_category")} className="mt-8 w-9/10 h-10 bg-amber-600 hover:bg-amber-500 cursor-pointer text-white rounded-xl ">Gerir Categorias</button>
            </div>
            <div className="flex flex-col  w-full h-40 bg-white rounded-xl shadow-xl p-6">
                <p className="text-sm font-bold">Gestão de Produtos</p>
                <p className="text-gray-700 ">Adicionar, editar e remover produtos do menu</p>
                <button onClick={() => navigate("/admin/add_menuitem")} className="mt-8 w-9/10 h-10 bg-amber-600 hover:bg-amber-500 cursor-pointer text-white rounded-xl ">Gerir Produtos</button>
            </div>
        </div>
      </div>
        
    </div>
  );
}

export default Admin;
