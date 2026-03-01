import { Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-light tracking-[0.3em] mb-4">FREMKYS</h3>
            <p className="text-gray-400 text-sm">
              Mode féminine élégante et intemporelle
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition">
                  Boutique
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  À propos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition">
                  Suivre ma commande
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">
                  Conditions générales
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/fremkys.boutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FREMKYS. Tous droits réservés.</p>
          <p className="mt-3">
            Developed by{' '}
            <a
              href="https://www.instagram.com/not.rpm/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition font-medium"
            >
              MOUMENE.H
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
