import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../component/Admin_navbar";
import axios from "axios";

/** ===== Tipos ===== */
type Category = { ID: number; Name: string; };

type MenuItem = {
  ID: number;
  Name: string;
  Price: number;
  ingredients: string[];
  ImageURL?: string | null;
  CategoryID: number;
  Category?: { ID: number; Name: string };
  CreatedAt: string;
  UpdatedAt: string;
};

function AddMenuItem() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  // modal criar/editar
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);

  // campos do formulário
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [imageURL, setImageURL] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  // modal apagar
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // mapa id->nome de categoria
  const categoryNameById = useMemo(() => {
    const m = new Map<number, string>();
    categories.forEach((c) => m.set(c.ID, c.Name));
    return m;
  }, [categories]);

  // fetch sequencial: categorias -> itens
  async function fetchData() {
    setLoading(true);
    try {
      const catRes = await axios.get<Category[]>("http://localhost:3000/api/category");
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);

      const itemsRes = await axios.get<MenuItem[]>("http://localhost:3000/api/menuitem");
      const its = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data as any)?.data ?? [];
      console.log(its);
      setItems(its);
    } catch (err) {
      console.error("Erro a carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function formatDate(s: string) {
    const d = new Date(s);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  /** ===== criar / editar ===== */
  function openCreateModal() {
    setEditingItem(null);
    setName("");
    setPrice("");
    setIngredientsText("");
    setImageURL("");
    setCategoryId("");
    setOpen(true);
  }
  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setName(item.Name);
    setPrice(String(item.Price));
    setIngredientsText((item.ingredients || []).join(", "));
    setImageURL(item.ImageURL || "");
    setCategoryId(item.CategoryID);
    setOpen(true);
  }

  /** ===== Helpers para imagem: ficheiro -> dataURL (base64) ===== */
  function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  async function onImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validações simples (opcionais)
    if (!file.type.startsWith("image/")) {
      alert("O ficheiro tem de ser uma imagem.");
      return;
    }
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      alert("Imagem demasiado grande (máx. 2MB).");
      return;
    }

    try {
      const dataURL = await fileToDataURL(file);
      setImageURL(dataURL); // a tua API recebe uma string (link OU dataURL)
    } catch {
      alert("Falha ao ler a imagem.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("O nome é obrigatório!");
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) return alert("Preço inválido.");
    if (categoryId === "" || categoryId == null) return alert("Seleciona uma categoria.");

    const ingredientsArr = ingredientsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (editingItem) {
        // PUT /api/menuitem/:id  (podes alterar categoria também)
        await axios.put(`http://localhost:3000/api/menuitem/${editingItem.ID}`, {
          Name: name.trim(),
          Price: parsedPrice,
          Ingredients: ingredientsArr,
          ImageURL: imageURL.trim() ? imageURL.trim() : null,
          CategoryID: Number(categoryId),
        });
      } else {
        // POST /api/menuitem/:category_id  (category_id no path)
        await axios.post(`http://localhost:3000/api/menuitem/${categoryId}`, {
          Name: name.trim(),
          Price: parsedPrice,
          Ingredients: ingredientsArr,
          ImageURL: imageURL.trim() ? imageURL.trim() : null,
        });
      }

      setOpen(false);
      setEditingItem(null);
      // para já, recarrega tal como na página de categorias
      window.location.reload();
    } catch (err) {
      console.error("Erro a guardar item:", err);
      alert("Erro ao guardar item. Ver consola.");
    } finally {
      setSaving(false);
    }
  }

  /** ===== apagar ===== */
  function askDelete(item: MenuItem) {
    setItemToDelete(item);
    setDeleteOpen(true);
  }
  async function handleDelete() {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/api/menuitem/${itemToDelete.ID}`);
      setDeleteOpen(false);
      setItemToDelete(null);
      // para já, recarrega
      window.location.reload();
    } catch (err) {
      console.error("Erro ao eliminar item:", err);
      alert("Erro ao eliminar item. Ver consola.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 ">
      <AdminNavbar 
        showBack={true}
      />
      <div className="md:px-10 md:py-10 px-4 py-4">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-4xl font-bold">Menu Itens</p>
            <p>Gerir os Itens do menu</p>
          </div>
          <button
            className="h-10  px-4 rounded-xl bg-amber-600 hover:bg-amber-500 cursor-pointer font-semibold flex items-center gap-2 text-white"
            type="button"
            onClick={openCreateModal}
          >
            <span>+</span>
            <span>Novo Item</span>
          </button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg p-4 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Lista de Itens</p>
              <p className="text-gray-700">Todos os itens do menu</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead className="text-left text-gray-600 ">
                <tr className="border-b">
                  <th className="w-1/7 py-3 px-4 text-center">ID</th>
                  <th className="w-1/7 py-3 px-4 text-center">Imagem</th>
                  <th className="w-1/7 py-3 px-4 text-center">Nome</th>
                  <th className="w-1/7 py-3 px-4 text-center">Preço</th>
                  <th className="w-1/7 py-3 px-4 text-center">Categoria</th>
                  <th className="w-1/7 py-3 px-4 text-center">Criado em</th>
                  <th className="w-1/7 py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {items.map((it) => (
                  <tr key={it.ID} className="border-b last:border-0">
                    <td className="py-4 px-4 text-center align-middle">#{it.ID}</td>
                    <td className="py-4 px-4 text-center align-middle">
                      {it.ImageURL ? (
                        <img
                          src={it.ImageURL}
                          alt={it.Name}
                          className="h-12 w-12 object-cover rounded-lg inline-block"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : ("—")}
                    </td>
                    <td className="py-4 px-4 font-medium text-center align-middle">{it.Name}</td>
                    <td className="py-4 px-4 text-center align-middle">{it.Price} €</td>
                    <td className="py-4 px-4 text-center align-middle">
                      {it.Category?.Name ?? categoryNameById.get(it.CategoryID) ?? "—"}
                    </td>
                    <td className="py-4 px-4 text-center">{formatDate(it.CreatedAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-icon cursor-pointer"
                          type="button"
                          aria-label={`Editar ${it.Name}`}
                          title="Editar"
                          onClick={() => openEditModal(it)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon cursor-pointer"
                          type="button"
                          aria-label={`Eliminar ${it.Name}`}
                          title="Eliminar"
                          onClick={() => askDelete(it)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr>
                    <td className="py-6 px-4 text-center text-gray-500" colSpan={7}>
                      Sem itens ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {loading && <div className="text-sm text-gray-500 mt-3">A carregar…</div>}
          </div>
        </div>
      </div>

      {/* Modal: Criar/Editar item */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Fundo */}
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setEditingItem(null); }} />
          {/* Janela */}
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">
                {editingItem ? "Editar Item" : "Novo Item"}
              </h2>
              <button
                onClick={() => { setOpen(false); setEditingItem(null); }}
                className="rounded-lg px-3 py-1.5 hover:bg-gray-100"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 px-5 py-5">
              {/* Nome */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex.: Pizza Margherita"
                  required
                  autoFocus
                />
              </div>

              {/* Preço */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Preço (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex.: 8.50"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Categoria</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                >
                  <option value="" disabled>Seleciona a categoria</option>
                  {categories.map((c) => (
                    <option key={c.ID} value={c.ID}>{c.Name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-600">Não existem categorias — cria uma antes de continuares.</p>
                )}
              </div>

              {/* Ingredientes */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ingredientes</label>
                <textarea
                  rows={3}
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex.: tomate, mozzarella, manjericão"
                />
                <p className="text-xs text-gray-500">Separa por vírgulas. Ex.: <i>tomate, queijo, orégãos</i></p>
              </div>

              {/* Imagem (URL) + Upload */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Imagem (URL opcional ou upload)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {/* Botão de upload com input file escondido */}
                  <label className="rounded-xl border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {/* Preview (mostra tanto URL como dataURL) */}
                {imageURL ? (
                  <img
                    src={imageURL}
                    alt="Pré-visualização"
                    className="h-20 w-20 object-cover rounded-lg border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : null}
                <p className="text-xs text-gray-500">
                  Podes colar um <b>link</b> ou carregar um ficheiro (fica guardado como <i>dataURL</i> base64).
                </p>
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setEditingItem(null); }}
                  className="rounded-xl px-4 py-2 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || categories.length === 0}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 active:scale-95 disabled:opacity-60"
                >
                  {saving ? "A guardar..." : editingItem ? "Guardar alterações" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminação */}
      {deleteOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Fundo */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteOpen(false)} />
          {/* Card */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Eliminar Item</h2>
            <p className="text-gray-700 mb-6">
              Tens a certeza que queres eliminar{" "}
              <span className="font-semibold text-amber-600">{itemToDelete.Name}</span>?
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

export default AddMenuItem;