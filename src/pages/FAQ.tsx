import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Les commandes sont expédiées sous 24-48h et livrées sous 3-5 jours ouvrés en France métropolitaine. Pour l'international, comptez 7-14 jours."
  },
  {
    question: "Comment puis-je retourner un article ?",
    answer: "Vous disposez de 30 jours pour retourner un article non porté avec ses étiquettes. Contactez notre service client pour obtenir une étiquette de retour gratuite."
  },
  {
    question: "Les frais de livraison sont-ils gratuits ?",
    answer: "Oui, la livraison est gratuite pour toute commande supérieure à 50€. En dessous de ce montant, les frais de livraison sont de 4,90€."
  },
  {
    question: "Comment connaître ma taille ?",
    answer: "Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, notre service client peut vous aider à choisir la taille adaptée."
  },
  {
    question: "Proposez-vous un service de paiement en plusieurs fois ?",
    answer: "Oui, nous proposons le paiement en 3x sans frais pour tout achat supérieur à 100€."
  },
  {
    question: "Comment puis-je suivre ma commande ?",
    answer: "Vous recevrez un email avec un numéro de suivi dès l'expédition de votre commande. Vous pouvez également suivre votre colis depuis notre page 'Suivre ma commande'."
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation. Passé ce délai, contactez rapidement notre service client."
  },
  {
    question: "Les produits sont-ils garantis ?",
    answer: "Tous nos produits bénéficient d'une garantie de conformité de 2 ans. En cas de défaut, contactez notre service client."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-light text-center mb-4">Questions Fréquentes</h1>
      <p className="text-center text-gray-600 mb-12">
        Trouvez rapidement les réponses à vos questions
      </p>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-200">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
            >
              <span className="font-medium pr-4">{item.question}</span>
              <ChevronDown
                size={20}
                className={`flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gray-50 text-center">
        <h2 className="text-xl font-light mb-3">Vous ne trouvez pas votre réponse ?</h2>
        <p className="text-gray-600 mb-4">Notre équipe est là pour vous aider</p>
        <button className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition">
          Contactez-nous
        </button>
      </div>
    </div>
  );
}
