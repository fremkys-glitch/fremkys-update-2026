import { Instagram } from 'lucide-react';

const WhatsAppIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const whatsappUrl = `https://wa.me/213552864430?text=${encodeURIComponent("Bonjour, j'ai vu le site Fremkys et je voudrais un site similaire pour mon projet 🚀")}`;

  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-light tracking-[0.3em] mb-4">FREMKYS</h3>
            <p className="text-gray-400 text-sm">Mode féminine élégante et intemporelle</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition">Boutique</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">À propos</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact</button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition">Suivre ma commande</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition">FAQ</button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Politique de confidentialité</button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">Conditions générales</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/fremkys.boutique/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FREMKYS. Tous droits réservés.</p>
          <p className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-gray-500 text-xs">💻 Vous voulez un site comme celui-ci ?</span>
            
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs px-2.5 py-1 rounded-full transition font-medium"
            >
              <WhatsAppIcon size={13} />
              MOUMENE.H — Développeur web
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
