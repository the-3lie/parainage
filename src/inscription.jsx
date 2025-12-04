import React, { useState } from "react";
import logo from './assets/logos.png';
import axios from "axios";

export default function Inscription() {
  const [formData, setFormData] = useState({
    matricule: "",
    nom_prenom: "",
    telephone: "",
    email: "",
    niveau: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await axios.post(
        "https://form-parrainage.onrender.com/api/etudiants",
        formData,
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      setMessage(response.data?.message || "Inscription réussie ✅");
      setFormData({ matricule: "", nom_prenom: "", telephone: "", email: "", niveau: "" });
    } catch (error) {
      const apiMsg = error?.response?.data?.message;
      if (apiMsg) setMessage(`❌ ${apiMsg}`);
      else if (error.code === "ECONNABORTED") setMessage("⏱️ Délai dépassé.");
      else if (error.request && !error.response) setMessage("🌐 Serveur injoignable.");
      else setMessage("❌ Erreur lors de l’inscription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* ─────── NAVBAR ─────── */}
      <nav className="w-full bg-slate-900/70 border-b border-white/10 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-12 w-auto rounded" />
          <ul className="hidden md:flex space-x-6 text-slate-300 font-medium">
            <li className="hover:text-white cursor-pointer">Accueil</li>
            <li className="hover:text-white cursor-pointer">À propos</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>
      </nav>

      {/* ─────── FORMULAIRE ─────── */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg p-10 rounded-3xl">

          <h2 className="text-4xl text-center font-bold text-white">Formulaire d’inscription</h2>
          <p className="mt-2 text-center text-sky-300 text-sm">Veuillez remplir vos informations</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {[
              { id:"matricule", label:"26INF015170S", name:"matricule"},
              { id:"nom_prenom", label:"Nom et Prénom", name:"nom_prenom"},
              { id:"telephone", label:"070000000", name:"telephone"},
              { id:"email", label:"inconu.lui@iua.ci", name:"email"}
            ].map((field) => (
              <div key={field.id} className="relative">
                <input 
                  id={field.id}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="peer w-full px-4 py-3 rounded-xl bg-white/90 text-slate-900 
                             border border-slate-300 focus:border-sky-500 focus:ring-4 
                             focus:ring-sky-500/30 outline-none"
                />
                <label 
                  htmlFor={field.id}
                  className="absolute left-4 top-3 text-slate-500 transition-all 
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                             peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-400">
                  {field.label}
                </label>
              </div>
            ))}

            <div>
              <label className="text-slate-300 text-sm">Niveau</label>
              <select 
                name="niveau" 
                value={formData.niveau} 
                onChange={handleChange} 
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/90 text-slate-900 
                           border border-slate-300 focus:ring-4 focus:ring-sky-500/30"
              >
                <option value="">— sélectionner —</option>
                <option value="L1GI">L1 Génie Informatique</option>
                <option value="L1M">L1 MIAGE</option>
                <option value="L2GI">L2 Génie Informatique</option>
                <option value="L2M">L2 MIAGE</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-semibold text-white text-lg shadow-md 
                ${submitting ? "bg-sky-600 opacity-70" : "bg-sky-600 hover:bg-sky-700 active:scale-95"}`}
            >
              {submitting ? "Envoi..." : "S’inscrire"}
            </button>
          </form>

          {message && (
            <p className={`mt-6 text-center text-sm font-medium 
                 ${message.includes("réuss") ? "text-emerald-400" : "text-red-300"}`}>
              {message}
            </p>
          )}

        </div>
      </div>

      {/* ─────── FOOTER ─────── */}
      <footer className="w-full bg-slate-900/80 py-4 border-t border-white/10 text-center text-slate-400">
        © {new Date().getFullYear()} IUA — Parrainage. Tous droits réservés.
      </footer>
    </div>
  );
}
