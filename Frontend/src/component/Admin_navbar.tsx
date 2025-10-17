import { useNavigate } from "react-router-dom";
import logo from "../assets/cachorraologo.png";

type AdminNavbarProps = {
  showBack?: boolean; // prop opcional (por padrão false)
};

function AdminNavbar({ showBack = false }: AdminNavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white h-18 p-8 shadow-lg">
      <div className="flex items-center justify h-full gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition cursor-pointer"
          >
            ← Voltar
          </button>
        )}
        <img src={logo} className="w-16 h-16" />
        <div className="flex flex-col">
          <span className="font-bold text-xl">Cachorrão Admin</span>
          <span className="text-gray-700">Painel de Gestão</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
