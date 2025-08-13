import { useState, useEffect } from 'react'
import CourtGrid from './CourtGrid'
import ValidationSystem from './ValidationSystem'

const ActionForm = ({ onSubmit, actions, setErrors, matchData }) => {
  const [formData, setFormData] = useState({
    equipo_accion: matchData.equipo_propio || 'LOCAL',
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
      return [
        { value: 'Lanzamiento_Exterior', label: '🎯 Lanzamiento Exterior', icon: '🎯' },
        { value: 'Pivote', label: '⚡ Pivote', icon: '⚡' },
        { value: 'Penetracion', label: '💨 Penetración', icon: '💨' },
        { value: 'Extremo', label: '🏹 Extremo', icon: '🏹' },
        { value: '_7m', label: '🎱 7 Metros', icon: '🎱' }
      ]
    } else {
      return [
        { value: 'Contragol', label: '⚡ Contragol', icon: '⚡' },
        { value: 'Primera_Oleada', label: '🌊 Primera Oleada', icon: '🌊' },
        { value: 'Segunda_Oleada', label: '🌊🌊 Segunda Oleada', icon: '🌊' },
        { value: 'Tercera_Oleada', label: '🌊🌊🌊 Tercera Oleada', icon: '🌊' }
      ]
    }
  }

  const getDetalleEventoOptions = () => {
    if (formData.evento === 'Lanzamiento_Parado') {
      return [
        { value: 'Parada_Portero', label: '🥅 Parada Portero', icon: '🥅' },
        { value: 'Bloqueo_Defensor', label: '🛡️ Bloqueo Defensor', icon: '🛡️' }
      ]
    }
    if (formData.evento === 'Lanzamiento_Fuera') {
      return [
        { value: 'Palo', label: '🎯 Palo', icon: '🎯' },
        { value: 'Fuera_Directo', label: '📤 Fuera Directo', icon: '📤' }
      ]
    }
    if (formData.evento === 'Perdida') {
      return [
        { value: 'Pasos', label: '👣 Pasos', icon: '👣' },
        { value: 'Dobles', label: '✌️ Dobles', icon: '✌️' },
        { value: 'FaltaAtaque', label: '⚠️ Falta Ataque', icon: '⚠️' },
        { value: 'Pasivo', label: '😴 Pasivo', icon: '😴' },
        { value: 'InvasionArea', label: '🚫 Invasión Área', icon: '🚫' },
        { value: 'Robo', label: '🤏 Robo', icon: '🤏' },
        { value: 'Pie', label: '🦶 Pie', icon: '🦶' },
        { value: 'BalonFuera', label: '⚽ Balón Fuera', icon: '⚽' }
      ]
    }
    return []
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

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
  const detalleEventoOptions = getDetalleEventoOptions()
  const showDetalleEvento = ['Lanzamiento_Parado', 'Lanzamiento_Fuera', 'Perdida'].includes(formData.evento)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="xl:col-span-2 space-y-6">
          <div className="gradient-card card-hover shadow-2xl rounded-2xl p-8 border-l-4 border-brand-red">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-12 h-12 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                {actions.length + 1}
              </span>
              ⚽ Nueva Acción
            </h3>

            <div className="space-y-8">
              {/* Equipo Acción */}
              <div className="bounce-in">
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  🏠 Equipo en Acción
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('equipo_accion', matchData.equipo_propio)}
                    className={`btn-team ${formData.equipo_accion === matchData.equipo_propio ? 'active' : ''}`}
                  >
                    🏠 {matchData.equipo_propio || 'Equipo Local'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('equipo_accion', matchData.equipo_rival)}
                    className={`btn-team ${formData.equipo_accion === matchData.equipo_rival ? 'active' : ''}`}
                  >
                    ✈️ {matchData.equipo_rival || 'Equipo Visitante'}
                  </button>
                </div>
              </div>

              {/* Tipo de Ataque */}
              <div className="bounce-in" style={{animationDelay: '0.1s'}}>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  ⚔️ Tipo de Ataque
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('tipo_ataque', 'Posicional')}
                    disabled={formData.origen_accion === '_7m'}
                    className={`btn-option ${formData.tipo_ataque === 'Posicional' ? 'active' : ''} ${formData.origen_accion === '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    🏰 Posicional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('tipo_ataque', 'Contraataque')}
                    disabled={formData.origen_accion === '_7m'}
                    className={`btn-option ${formData.tipo_ataque === 'Contraataque' ? 'active' : ''} ${formData.origen_accion === '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ⚡ Contraataque
                  </button>
                </div>
              </div>

              {/* Origen de la Acción */}
              <div className="bounce-in" style={{animationDelay: '0.2s'}}>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  🎯 Origen de la Acción
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('origen_accion', 'Juego_Continuado')}
                    className={`btn-option text-sm ${formData.origen_accion === 'Juego_Continuado' ? 'active' : ''}`}
                  >
                    ▶️ Juego Continuado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('origen_accion', 'Rebote_Directo')}
                    className={`btn-option text-sm ${formData.origen_accion === 'Rebote_Directo' ? 'active' : ''}`}
                  >
                    🔄 Rebote Directo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('origen_accion', 'Rebote_Indirecto')}
                    className={`btn-option text-sm ${formData.origen_accion === 'Rebote_Indirecto' ? 'active' : ''}`}
                  >
                    🔄📐 Rebote Indirecto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('origen_accion', '_7m')}
                    className={`btn-option text-sm ${formData.origen_accion === '_7m' ? 'active' : ''}`}
                  >
                    🎱 7 Metros
                  </button>
                </div>
              </div>

              {/* Evento */}
              <div className="bounce-in" style={{animationDelay: '0.3s'}}>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  🎪 Evento
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('evento', 'Gol')}
                    className={`btn-option ${formData.evento === 'Gol' ? 'active' : ''}`}
                  >
                    ⚽ Gol
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('evento', 'Lanzamiento_Parado')}
                    className={`btn-option text-sm ${formData.evento === 'Lanzamiento_Parado' ? 'active' : ''}`}
                  >
                    🥅 Lanz. Parado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('evento', 'Lanzamiento_Fuera')}
                    className={`btn-option text-sm ${formData.evento === 'Lanzamiento_Fuera' ? 'active' : ''}`}
                  >
                    📤 Lanz. Fuera
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('evento', 'Perdida')}
                    className={`btn-option ${formData.evento === 'Perdida' ? 'active' : ''}`}
                  >
                    ❌ Pérdida
                  </button>
                </div>
              </div>

              {/* Detalle del Evento */}
              {showDetalleEvento && (
                <div className="bounce-in" style={{animationDelay: '0.4s'}}>
                  <label className="block text-lg font-bold text-gray-800 mb-4">
                    🔍 Detalle del Evento
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {detalleEventoOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFieldChange('detalle_evento', option.value)}
                        className={`btn-option text-sm ${formData.detalle_evento === option.value ? 'active' : ''}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Campos que se completan con la cancha */}
              {formData.evento !== 'Perdida' && (
                <div className="space-y-6">
                  <div className="bounce-in" style={{animationDelay: '0.5s'}}>
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      🎯 Detalle de Finalización
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {detalleOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFieldChange('detalle_finalizacion', option.value)}
                            disabled={formData.origen_accion === '_7m' && option.value !== '_7m'}
                            className={`btn-option text-sm ${formData.detalle_finalizacion === option.value ? 'active' : ''} ${formData.origen_accion === '_7m' && option.value !== '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShowCourt(true); setCourtMode('detalle') }}
                        disabled={formData.origen_accion === '_7m'}
                        className="w-full px-6 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-brand-blue disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                      >
                        🏟️ Seleccionar en Cancha
                      </button>
                    </div>
                  </div>

                  <div className="bounce-in" style={{animationDelay: '0.6s'}}>
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      📍 Zona de Lanzamiento
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('zona_lanzamiento', 'Izquierda')}
                          disabled={formData.origen_accion === '_7m'}
                          className={`btn-option ${formData.zona_lanzamiento === 'Izquierda' ? 'active' : ''} ${formData.origen_accion === '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          ⬅️ Izquierda
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('zona_lanzamiento', 'Centro')}
                          disabled={formData.origen_accion === '_7m'}
                          className={`btn-option ${formData.zona_lanzamiento === 'Centro' ? 'active' : ''} ${formData.origen_accion === '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          ⬆️ Centro
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('zona_lanzamiento', 'Derecha')}
                          disabled={formData.origen_accion === '_7m'}
                          className={`btn-option ${formData.zona_lanzamiento === 'Derecha' ? 'active' : ''} ${formData.origen_accion === '_7m' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          ➡️ Derecha
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('zona_lanzamiento', '_7m')}
                          className={`btn-option ${formData.zona_lanzamiento === '_7m' ? 'active' : ''}`}
                        >
                          🎱 7 Metros
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShowCourt(true); setCourtMode('zona') }}
                        disabled={formData.origen_accion === '_7m'}
                        className="w-full px-6 py-3 bg-gradient-to-r from-brand-red to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-brand-red disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                      >
                        🏟️ Seleccionar en Cancha
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-red-50 p-6 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">🔄 Cambio de Posesión:</span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    formData.cambio_posesion ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {formData.cambio_posesion ? '✅ SÍ' : '❌ NO'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Calculado automáticamente según las reglas del balonmano
                </p>
              </div>

              <button
                type="button"
                onClick={validateAndSubmit}
                className="w-full px-8 py-4 bg-gradient-to-r from-brand-red to-red-600 text-white text-xl font-bold rounded-xl hover:from-red-600 hover:to-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ✅ Registrar Acción
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de acciones */}
        <div className="xl:col-span-1">
          <div className="gradient-card card-hover shadow-2xl rounded-2xl p-6 border-l-4 border-brand-blue sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              📊 Acciones Registradas
              <span className="ml-2 px-3 py-1 bg-brand-blue text-white rounded-full text-sm">
                {actions.length}
              </span>
            </h3>
            
            {actions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚽</div>
                <p className="text-gray-500 font-medium">
                  No hay acciones registradas aún
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Las acciones aparecerán aquí conforme las registres
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {actions.slice(-10).reverse().map((action, index) => {
                  const realIndex = actions.length - 1 - index
                  return (
                    <div key={realIndex} className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          #{action.id_posesion} - {action.equipo_accion}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          action.evento === 'Gol' ? 'bg-green-500 text-white' :
                          action.evento === 'Perdida' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {action.evento === 'Gol' ? '⚽' : action.evento === 'Perdida' ? '❌' : '🎯'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">{action.tipo_ataque}</span> • {action.origen_accion.replace('_', ' ')}
                        {action.detalle_finalizacion && ` • ${action.detalle_finalizacion.replace('_', ' ')}`}
                        {action.zona_lanzamiento && ` • ${action.zona_lanzamiento}`}
                      </p>
                    </div>
                  )
                })}
                {actions.length > 10 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    ... y {actions.length - 10} acciones más
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de la cancha */}
      {showCourt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  🏟️ Seleccionar {courtMode === 'zona' ? 'Zona de Lanzamiento' : 'Detalle de Finalización'}
                </h3>
                <button
                  onClick={() => { setShowCourt(false); setCourtMode(null) }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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