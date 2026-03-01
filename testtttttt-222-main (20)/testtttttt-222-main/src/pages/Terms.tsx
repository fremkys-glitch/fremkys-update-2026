export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-light mb-8">Conditions Générales de Vente</h1>
      <p className="text-sm text-gray-600 mb-12">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-light mb-4">1. Objet</h2>
          <p className="leading-relaxed">
            Les présentes Conditions Générales de Vente régissent les relations contractuelles entre FREMKYS et tout client souhaitant effectuer un achat sur le site fremkys.com, opéré depuis l'Algérie.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">2. Commandes</h2>
          <p className="leading-relaxed mb-3">
            Toute commande validée sur notre site implique l'acceptation totale des présentes conditions.
          </p>
          <p className="leading-relaxed">
            Une confirmation par SMS ou appel peut être demandée avant l'expédition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">3. Prix</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Les prix sont affichés en dinar algérien (DA).</li>
            <li>Le prix appliqué est toujours celui visible au moment de la commande.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">4. Paiement</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Le paiement s'effectue uniquement en espèces (Cash) lors de la livraison.</li>
            <li>Aucun paiement en ligne n'est requis ou demandé.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">5. Livraison</h2>
          <p className="leading-relaxed mb-3">
            <span className="font-medium">Disponibilité :</span> Livraison disponible dans toutes les wilayas d'Algérie.
          </p>
          <p className="leading-relaxed mb-3">
            <span className="font-medium">Délais :</span> 2 à 7 jours ouvrés selon la wilaya.
          </p>
          <p className="leading-relaxed mb-3">
            <span className="font-medium">Frais de livraison :</span> Variables selon la zone.
          </p>
          <p className="leading-relaxed mb-3">
            Le client doit répondre à l'appel de confirmation pour valider l'expédition.
          </p>
          <p className="leading-relaxed">
            Le client a le droit de vérifier et inspecter le produit lors de la livraison avant d'effectuer le paiement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">6. Politique de retour / échange</h2>
          <p className="leading-relaxed mb-3">
            <span className="font-medium">Aucun retour ni remboursement n'est accepté.</span>
          </p>
          <p className="leading-relaxed mb-3">
            Cependant, un échange est possible uniquement en cas de taille (taille/mensuration) incorrecte, et sous conditions :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>Le produit doit être neuf, non utilisé, dans son état d'origine.</li>
            <li>L'emballage, l'étiquette et les accessoires doivent être intacts.</li>
            <li>La demande doit être faite dans un délai maximum de 24 heures après réception.</li>
            <li>Les frais de renvoi ou de réexpédition sont à la charge du client.</li>
            <li>Aucun échange ne sera accepté pour changement d'avis.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">7. Garanties</h2>
          <p className="leading-relaxed">
            Tous nos produits bénéficient de la garantie légale algérienne contre les défauts de fabrication.
            Un produit présentant un défaut avéré pourra être échangé après vérification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">8. Service client</h2>
          <p className="leading-relaxed mb-3">
            Disponible du dimanche au jeudi, de 9h à 17h :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Email : fremkysboutique@gmail.com</li>
            <li>Téléphone & WhatsApp : +213 792 22 10 56</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">9. Droit applicable</h2>
          <p className="leading-relaxed mb-3">
            Les présentes CGV sont régies par le droit algérien.
          </p>
          <p className="leading-relaxed">
            En cas de litige, seuls les tribunaux algériens sont compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
