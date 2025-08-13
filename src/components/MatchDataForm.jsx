import { useState } from 'react'
import imagotipo from '../assets/imagotipo_sin_fondo.png'

const MatchDataForm = ({ onSubmit, initialData, setErrors }) => {
  const [formData, setFormData] = useState({
    gmail: initialData.gmail || '',
    equipo_propio: initialData.equipo_propio || '',
    equipo_rival: initialData.equipo_rival || '',
    id_partido: initialData.id_partido || ''
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
    
    if (!formData.id_partido || isNaN(formData.id_partido) || formData.id_partido <= 0) {
      errors.push('El ID del partido debe ser un número positivo')
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

    onSubmit({
      ...formData,
      id_partido: parseInt(formData.id_partido)
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-brand-red px-6 py-4">
          <div className="flex items-center">
            <img src={imagotipo} alt="Handball Stats Pro" className="h-8 w-auto mr-3" />
            <h2 className="text-xl font-bold text-white">Datos del Partido</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="equipo_propio" className="block text-sm font-medium text-gray-700 mb-2">
              Equipo Propio *
            </label>
            <input
              type="text"
              id="equipo_propio"
              name="equipo_propio"
              value={formData.equipo_propio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Nombre del equipo local"
            />
          </div>

          <div>
            <label htmlFor="equipo_rival" className="block text-sm font-medium text-gray-700 mb-2">
              Equipo Rival *
            </label>
            <input
              type="text"
              id="equipo_rival"
              name="equipo_rival"
              value={formData.equipo_rival}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Nombre del equipo visitante"
            />
          </div>

          <div>
            <label htmlFor="id_partido" className="block text-sm font-medium text-gray-700 mb-2">
              ID del Partido *
            </label>
            <input
              type="number"
              id="id_partido"
              name="id_partido"
              value={formData.id_partido}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="12345"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-colors duration-200"
            >
              Continuar a Acciones
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MatchDataForm