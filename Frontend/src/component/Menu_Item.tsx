type Props = {
  id: number;
  name: string;
  price: number;
  ingredients: string | string[];
  image: string | null;
};

function MenuItem({ id, name, price, ingredients, image }: Props) {
  const ingList = Array.isArray(ingredients)
    ? ingredients
    : ingredients.split(",").map(i => i.trim()).filter(Boolean);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // se a imagem falhar, esconde-a para não ficar quebrada
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{name}</span>
          <span className="text-amber-600 font-bold text-xl">€{price}</span>
        </div>

        {ingList.length > 0 && (
          <>
            <p className="mt-4 text-xs font-semibold text-gray-600">INGREDIENTES:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ingList.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
