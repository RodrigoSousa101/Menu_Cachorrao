import logo from "../assets/cachorraologo.png";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MenuItem from "../component/Menu_Item"
import api from "../lib/api";

type Item = {
  ID: number;
  Name: string;
  Price: number;
  ingredients: string[] | string;
  ImageURL: string | null;
  CategoryID: number;
};

type Category = {
  ID: number;
  Name: string;
  Items: Item[];
};

function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get<Category[]>("/api/category");
        setCategories(data || []);
      
        if (data?.length) setActiveCategory(data[0].ID);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchData();
  }, []);

  const selectedCategory = useMemo(
    () => categories.find(c => c.ID === activeCategory) || null,
    [categories, activeCategory]
  );

  return (
    
      <div className="min-h-screen bg-amber-50">
        <div className="w-full h-28 bg-gradient-to-r from-amber-600 to-amber-500">
          <div className="w-full h-full flex flex-row items-center justify-center gap-6">
            <img src={logo} className="w-20 h-20"></img>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-white">Cachorrão</p>
              <p className="text-amber-100 text-xs ">O sabor que une gerações desde 1994</p>
            </div>
          </div>
        </div>
        <div className="bg-white flex items-center h-18 gap-4 px-4 py-2 overflow-x-auto whitespace-nowrap shadow-sm scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.ID}
              onClick={() => setActiveCategory(cat.ID)}
              className={`h-9 px-4 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 
                ${
                  activeCategory === cat.ID
                    ? "bg-amber-500 text-white font-bold shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              {cat.Name}
            </button>
          ))}
        </div>
        <div className="w-full flex justify-center mt-4">
        {selectedCategory ? (
          selectedCategory.Items?.length ? (
            <div className="w-full max-w-5xl px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategory.Items.map((it) => (
                  <MenuItem
                    key={it.ID}
                    id={it.ID}
                    name={it.Name}
                    price={it.Price}
                    ingredients={it.ingredients ?? []}   // aceita string ou array
                    image={it.ImageURL}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Sem itens nesta categoria.</p>
          )
        ) : (
          <p className="text-gray-500">A carregar categorias…</p>
        )}
      </div>

      </div>
    
  )
}

export default Menu
