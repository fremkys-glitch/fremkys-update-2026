import { useState } from 'react';
import { Mail, Phone, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl font-light text-center mb-12">Contactez-nous</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-light mb-6">Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 hover:bg-gray-800 transition"
            >
              Envoyer
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-light mb-6">Informations de contact</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">fremkysboutique@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Téléphone</h3>
                <p className="text-gray-600">+213 792221056</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-100">
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <a
              href="https://www.instagram.com/fremkys.boutique/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-700 hover:text-black transition group"
            >
              <Instagram size={24} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">@fremkys.boutique</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
