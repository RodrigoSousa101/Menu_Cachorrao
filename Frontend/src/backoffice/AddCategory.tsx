import { useEffect, useState } from "react";
import AdminNavbar from "../component/Admin_navbar";
import axios from "axios";

type Category = {
  ID: number;
  Name: string;
  Items: any[];
  CreatedAt: string;
};

function AddCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para modo de edição (se null = criar, caso contrário = editar)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Category[]>("http://localhost:3000/api/category");
        setCategories(data || []);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchData();
  }, []);

  // Abrir modal em modo criação
  function openCreateModal() {
    setEditingCategory(null);
    setName("");
    setOpen(true);
  }

  // Abrir modal em modo edição
  function openEditModal(cat: Category) {
    setEditingCategory(cat);
    setName(cat.Name);
    setOpen(true);
  }

  // Submeter criação/edição
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("O nome é obrigatório!");
    setLoading(true);

    try {
      if (editingCategory) {
        // EDITAR
        await axios.put(`http://localhost:3000/api/category/${editingCategory.ID}`, {
          Name: name,
        });
      } else {
        // CRIAR
        await axios.post("http://localhost:3000/api/category", { Name: name });
      }

      setName("");
      setOpen(false);
      setEditingCategory(null);
      window.location.reload(); // 🔄 atualiza a lista (coerente com o teu fluxo)

    } catch (error) {
      console.error("Erro ao guardar categoria:", error);
      alert("Erro ao guardar categoria. Ver consola.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/api/category/${categoryToDelete.ID}`);
      setDeleteOpen(false);
      setCategoryToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao eliminar categoria:", error);
      alert("Erro ao eliminar categoria. Ver consola.");
    } finally {
      setDeleting(false);
    }
  }

  function formDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="min-h-screen bg-amber-50 ">
      <AdminNavbar 
      showBack={true}
       />
      <div className="md:px-10 md:py-10 px-4 py-4">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-4xl font-bold">Categorias</p>
            <p>Gerir categorias do menu</p>
          </div>
          <button
            className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 cursor-pointer font-semibold flex items-center gap-2 text-white"
            onClick={openCreateModal}
            type="button"
          >
            <span>+</span>
            <span>Nova Categoria</span>
          </button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg p-4 mt-8">
          <p className="font-bold">Lista de Categorias</p>
          <p className="text-gray-700">Todas as categorias do seu menu</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead className="text-left text-gray-600 ">
                <tr className="border-b">
                  <th className="w-1/5 py-3 px-4 text-center align-middle">ID</th>
                  <th className="w-1/5 py-3 px-4 text-center align-middle">Nome</th>
                  <th className="w-1/5 py-3 px-4 text-center align-middle">Produtos</th>
                  <th className="w-1/5 py-3 px-4 text-center align-middle">Data de Criação</th>
                  <th className="w-1/5 py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {categories.map((c) => (
                  <tr key={c.ID} className="border-b last:border-0">
                    <td className="py-4 px-4 text-center align-middle">#{c.ID}</td>
                    <td className="py-4 px-4 font-semibold text-center align-middle">{c.Name}</td>
                    <td className="py-4 px-4 text-center align-middle">{c.Items.length} itens</td>
                    <td className="py-4 px-4 text-center align-middle">{formDate(c.CreatedAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-icon cursor-pointer"
                          type="button"
                          aria-label={`Editar ${c.Name}`}
                          title="Editar"
                          onClick={() => openEditModal(c)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon cursor-pointer"
                          type="button"
                          onClick={() => {
                            setCategoryToDelete(c);
                            setDeleteOpen(true);
                          }}
                          aria-label={`Eliminar ${c.Name}`}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td className="py-6 px-4 text-center text-gray-500" colSpan={5}>
                      Sem categorias ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Criar/Editar categoria */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Fundo */}
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setEditingCategory(null); }} />
          {/* Janela */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button
                onClick={() => { setOpen(false); setEditingCategory(null); }}
                className="rounded-lg px-3 py-1.5 hover:bg-gray-100"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className="text-sm font-medium ">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 mt-2"
                  placeholder="Ex.: Bebidas"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setEditingCategory(null); }}
                  className="rounded-xl px-4 py-2 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 active:scale-95"
                >
                  {loading
                    ? (editingCategory ? "A guardar..." : "A guardar...")
                    : (editingCategory ? "Guardar alterações" : "Guardar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminação */}
      {deleteOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Fundo */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteOpen(false)} />
          {/* Card */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Eliminar Categoria</h2>
            <p className="text-gray-700 mb-6">
              Tens a certeza que queres eliminar{" "}
              <span className="font-semibold text-amber-600">{categoryToDelete.Name}</span>?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteOpen(false)} className="rounded-xl px-4 py-2 hover:bg-gray-100" type="button">
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500 active:scale-95"
                type="button"
              >
                {deleting ? "A eliminar..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCategory;
