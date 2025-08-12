import { useState, useEffect } from 'react'
import CourtGrid from './CourtGrid'
import ValidationSystem from './ValidationSystem'

const ActionForm = ({ onSubmit, actions, setErrors }) => {
  const [formData, setFormData] = useState({
    equipo_accion: 'LOCAL',
    tipo_ataque: 'Posicional',
    origen_accion: 'Juego_Continuado',
    evento: 'Gol',
    detalle_finalizacion: '',
    zona_lanzamiento: '',
    detalle_evento: null,
    cambio_posesion: true
  })

  const [showCourt, setShowCourt] = useState(false)
  const [courtMode, setCourtMode] = useState(null) // 'zona' or 'detalle'

  const validator = new ValidationSystem()

  // Opciones dinámicas según tipo_ataque
  const getDetalleFinalizacionOptions = () => {
    if (formData.tipo_ataque === 'Posicional') {
      return ['Lanzamiento_Exterior', 'Pivote', 'Penetracion', 'Extremo', '_7m']
    } else {
      return ['Contragol', 'Primera_Oleada', 'Segunda_Oleada', 'Tercera_Oleada']
    }
  }

  // Calcular cambio_posesion automáticamente
  useEffect(() => {
    const cambio = validator.calculateCambioPosesion(formData.evento, formData.detalle_evento)
    setFormData(prev => ({ ...prev, cambio_posesion: cambio }))
  }, [formData.evento, formData.detalle_evento])

  // Aplicar reglas de 7 metros
  useEffect(() => {
    if (formData.origen_accion === '_7m') {
      setFormData(prev => ({
        ...prev,
        detalle_finalizacion: '_7m',
        zona_lanzamiento: '_7m',
        tipo_ataque: 'Posicional'
      }))
    }
  }, [formData.origen_accion])

  // Limpiar campos cuando cambia el evento
  useEffect(() => {
    if (formData.evento === 'Perdida') {
      setFormData(prev => ({
        ...prev,
        detalle_finalizacion: '',
        zona_lanzamiento: ''
      }))
    }
  }, [formData.evento])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCourtSelection = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }))
    setShowCourt(false)
    setCourtMode(null)
  }

  const validateAndSubmit = () => {
    const errors = validator.validateAction(formData, actions)
    
    if (errors.length > 0) {
      setErrors(errors)
      return
    }

    onSubmit(formData)
    
    // Reset form
    setFormData({
      equipo_accion: formData.equipo_accion, // Mantener el equipo
      tipo_ataque: 'Posicional',
      origen_accion: 'Juego_Continuado',
      evento: 'Gol',
      detalle_finalizacion: '',
      zona_lanzamiento: '',
      detalle_evento: null,
      cambio_posesion: true
    })
  }

  const detalleOptions = getDetalleFinalizacionOptions()
  const showDetalleEvento = ['Lanzamiento_Parado', 'Lanzamiento_Fuera', 'Perdida'].includes(formData.evento)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              {actions.length + 1}
            </span>
            Nueva Acción
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo Acción
              </label>
              <select
                name="equipo_accion"
                value={formData.equipo_accion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              >
                <option value="LOCAL">LOCAL</option>
                <option value="VISITANTE">VISITANTE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ataque
              </label>
              <select
                name="tipo_ataque"
                value={formData.tipo_ataque}
                onChange={handleChange}
                disabled={formData.origen_accion === '_7m'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
              >
                <option value="Posicional">Posicional</option>
                <option value="Contraataque">Contraataque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origen de la Acción
              </label>
              <select
                name="origen_accion"
                value={formData.origen_accion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              >
                <option value="Juego_Continuado">Juego Continuado</option>
                <option value="Rebote_Directo">Rebote Directo</option>
                <option value="Rebote_Indirecto">Rebote Indirecto</option>
                <option value="_7m">7 Metros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evento
              </label>
              <select
                name="evento"
                value={formData.evento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              >
                <option value="Gol">Gol</option>
                <option value="Lanzamiento_Parado">Lanzamiento Parado</option>
                <option value="Lanzamiento_Fuera">Lanzamiento Fuera</option>
                <option value="Perdida">Pérdida</option>
              </select>
            </div>

            {showDetalleEvento && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalle del Evento
                </label>
                <select
                  name="detalle_evento"
                  value={formData.detalle_evento || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                >
                  <option value="">Seleccionar...</option>
                  {formData.evento === 'Lanzamiento_Parado' && (
                    <>
                      <option value="Parada_Portero">Parada Portero</option>
                      <option value="Bloqueo_Defensor">Bloqueo Defensor</option>
                    </>
                  )}
                  {formData.evento === 'Lanzamiento_Fuera' && (
                    <>
                      <option value="Palo">Palo</option>
                      <option value="Fuera_Directo">Fuera Directo</option>
                    </>
                  )}
                  {formData.evento === 'Perdida' && (
                    <>
                      <option value="Pasos">Pasos</option>
                      <option value="Dobles">Dobles</option>
                      <option value="FaltaAtaque">Falta Ataque</option>
                      <option value="Pasivo">Pasivo</option>
                      <option value="InvasionArea">Invasión Área</option>
                      <option value="Robo">Robo</option>
                      <option value="Pie">Pie</option>
                      <option value="BalonFuera">Balón Fuera</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Campos que se completan con la cancha */}
            {formData.evento !== 'Perdida' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalle de Finalización
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="detalle_finalizacion"
                      value={formData.detalle_finalizacion}
                      onChange={handleChange}
                      disabled={formData.origen_accion === '_7m'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar...</option>
                      {detalleOptions.map(option => (
                        <option key={option} value={option}>
                          {option.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => { setShowCourt(true); setCourtMode('detalle') }}
                      disabled={formData.origen_accion === '_7m'}
                      className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancha
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona de Lanzamiento
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="zona_lanzamiento"
                      value={formData.zona_lanzamiento}
                      onChange={handleChange}
                      disabled={formData.origen_accion === '_7m'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Izquierda">Izquierda</option>
                      <option value="Centro">Centro</option>
                      <option value="Derecha">Derecha</option>
                      <option value="_7m">7 Metros</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => { setShowCourt(true); setCourtMode('zona') }}
                      disabled={formData.origen_accion === '_7m'}
                      className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancha
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cambio de Posesión:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  formData.cambio_posesion ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {formData.cambio_posesion ? 'SÍ' : 'NO'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Calculado automáticamente según las reglas
              </p>
            </div>

            <button
              type="button"
              onClick={validateAndSubmit}
              className="w-full px-4 py-2 bg-brand-red text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 transition-colors duration-200"
            >
              Registrar Acción
            </button>
          </div>
        </div>

        {/* Resumen de acciones */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Acciones Registradas ({actions.length})
          </h3>
          
          {actions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay acciones registradas aún
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {actions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      #{action.id_posesion} - {action.equipo_accion}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.evento === 'Gol' ? 'bg-green-100 text-green-800' :
                      action.evento === 'Perdida' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {action.evento}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {action.tipo_ataque} • {action.origen_accion}
                    {action.detalle_finalizacion && ` • ${action.detalle_finalizacion}`}
                    {action.zona_lanzamiento && ` • ${action.zona_lanzamiento}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de la cancha */}
      {showCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Seleccionar {courtMode === 'zona' ? 'Zona de Lanzamiento' : 'Detalle de Finalización'}
                </h3>
                <button
                  onClick={() => { setShowCourt(false); setCourtMode(null) }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <CourtGrid
                mode={courtMode}
                tipoAtaque={formData.tipo_ataque}
                onSelection={handleCourtSelection}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionForm