export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-light text-center mb-12">À propos de FREMKYS</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="aspect-square bg-gray-100">
          <img
            src="https://xktmwzqqlbkymlsavutn.supabase.co/storage/v1/object/public/fitted%20long%20coat%20bordeaux/Gemini_Generated_Image_v8av5fv8av5fv8av.png"
            alt="Notre Histoire"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-light mb-4">Notre Histoire</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            FREMKYS est née d'une passion pour la mode féminine élégante et intemporelle.
            Fondée avec la vision de créer des pièces qui transcendent les tendances éphémères,
            notre marque s'engage à offrir des vêtements de qualité exceptionnelle.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Chaque pièce est soigneusement sélectionnée pour sa qualité, son confort et son style unique.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-2xl font-light mb-4">Notre Philosophie</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Nous croyons en une mode consciente et durable. Notre approche minimaliste privilégie
            la qualité à la quantité, créant des pièces versatiles qui s'adaptent à votre style de vie.
          </p>
          <p className="text-gray-600 leading-relaxed">
            L'élégance n'est pas une question de quantité, mais de choix réfléchis et de pièces intemporelles.
          </p>
        </div>
        <div className="aspect-square bg-gray-100 order-1 md:order-2">
          <img
            src="https://xktmwzqqlbkymlsavutn.supabase.co/storage/v1/object/public/fitted%20long%20coat%20bordeaux/Screenshot%202025-12-03%20232808.png"
            alt="Notre Philosophie"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-light mb-8">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h3 className="font-semibold mb-3">Qualité</h3>
            <p className="text-gray-600 text-sm">
              Des matériaux premium et une attention particulière aux détails
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold mb-3">Élégance</h3>
            <p className="text-gray-600 text-sm">
              Des designs intemporels qui subliment votre silhouette
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold mb-3">Durabilité</h3>
            <p className="text-gray-600 text-sm">
              Un engagement pour une mode plus responsable et consciente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
