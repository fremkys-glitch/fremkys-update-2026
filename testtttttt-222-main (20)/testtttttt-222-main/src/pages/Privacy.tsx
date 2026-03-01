export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-light mb-8">Politique de Confidentialité</h1>
      <p className="text-sm text-gray-600 mb-12">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-light mb-4">1. Introduction</h2>
          <p className="leading-relaxed">
            FREMKYS s'engage à protéger la confidentialité de vos données personnelles. Cette politique
            explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez
            notre site web et nos services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">2. Données collectées</h2>
          <p className="leading-relaxed mb-3">Nous collectons les types de données suivants :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Informations d'identification (nom, prénom, email)</li>
            <li>Informations de livraison et de facturation</li>
            <li>Historique des commandes et préférences</li>
            <li>Données de navigation (cookies, adresse IP)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">3. Utilisation des données</h2>
          <p className="leading-relaxed mb-3">Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Traiter et expédier vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            <li>Améliorer nos services et votre expérience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">4. Protection des données</h2>
          <p className="leading-relaxed">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
            pour protéger vos données contre tout accès non autorisé, perte ou modification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">5. Vos droits</h2>
          <p className="leading-relaxed mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification de vos données</li>
            <li>Droit à l'effacement de vos données</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">6. Cookies</h2>
          <p className="leading-relaxed">
            Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez
            gérer vos préférences de cookies via les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">7. Contact</h2>
          <p className="leading-relaxed">
            Pour toute question concernant cette politique ou pour exercer vos droits, contactez-nous à :
            privacy@fremkys.com
          </p>
        </section>
      </div>
    </div>
  );
}
