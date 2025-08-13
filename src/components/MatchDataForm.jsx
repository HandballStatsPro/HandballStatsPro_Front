import { useState } from 'react'
import imagotipo from '../assets/imagotipo_sin_fondo.png'

const MatchDataForm = ({ onSubmit, initialData, setErrors }) => {
  const [formData, setFormData] = useState({
    gmail: initialData.gmail || '',
    equipo_propio: initialData.equipo_propio || '',
    equipo_rival: initialData.equipo_rival || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.gmail || !formData.gmail.includes('@')) {
      errors.push('El email debe ser válido')
    }
    
    if (!formData.equipo_propio.trim()) {
      errors.push('El equipo propio es obligatorio')
    }
    
    if (!formData.equipo_rival.trim()) {
      errors.push('El equipo rival es obligatorio')
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validateForm()
    
    if (errors.length > 0) {
      setErrors(errors)
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="gradient-card card-hover shadow-2xl rounded-2xl overflow-hidden border-t-4 border-brand-blue">
        <div className="gradient-header px-8 py-6">
          <div className="flex items-center">
            <img src={imagotipo} alt="Handball Stats Pro" className="h-12 w-auto mr-4 drop-shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">Datos del Partido</h2>
              <p className="text-blue-100 mt-1">Configura la información básica del encuentro</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="bounce-in">
              <label htmlFor="gmail" className="block text-lg font-bold text-gray-800 mb-3">
                📧 Email del Responsable *
              </label>
              <input
                type="email"
                id="gmail"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-300 text-lg bg-gradient-to-r from-white to-blue-50"
                placeholder="entrenador@equipo.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bounce-in" style={{animationDelay: '0.1s'}}>
                <label htmlFor="equipo_propio" className="block text-lg font-bold text-gray-800 mb-3">
                  🏠 Equipo Local *
                </label>
                <input
                  type="text"
                  id="equipo_propio" 
                  name="equipo_propio"
                  value={formData.equipo_propio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-300 text-lg bg-gradient-to-r from-white to-blue-50"
                  placeholder="Nombre del equipo local"
                />
              </div>

              <div className="bounce-in" style={{animationDelay: '0.2s'}}>
                <label htmlFor="equipo_rival" className="block text-lg font-bold text-gray-800 mb-3">
                  ✈️ Equipo Visitante *
                </label>
                <input
                  type="text"
                  id="equipo_rival"
                  name="equipo_rival"
                  value={formData.equipo_rival}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-red/30 focus:border-brand-red transition-all duration-300 text-lg bg-gradient-to-r from-white to-red-50"
                  placeholder="Nombre del equipo visitante"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🚀 Continuar a Registro de Acciones
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MatchDataForm