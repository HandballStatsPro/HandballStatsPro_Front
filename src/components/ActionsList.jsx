import { useState } from 'react'
import isotipo from '../assets/isotipo_sin_fondo.png'

const ActionsList = ({ actions, onEdit, onDelete, onSend, isLoading, matchData }) => {
  const [editingIndex, setEditingIndex] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const formatFieldName = (field) => {
    const fieldNames = {
      'equipo_accion': 'Equipo',
      'tipo_ataque': 'Tipo Ataque',
      'origen_accion': 'Origen',
      'evento': 'Evento',
      'detalle_finalizacion': 'Detalle Finalización',
      'zona_lanzamiento': 'Zona Lanzamiento',
      'detalle_evento': 'Detalle Evento',
      'cambio_posesion': 'Cambio Posesión'
    }
    return fieldNames[field] || field
  }

  const formatFieldValue = (field, value) => {
    if (field === 'cambio_posesion') {
      return value ? 'SÍ' : 'NO'
    }
    if (value === null || value === '') {
      return '-'
    }
    return value.toString().replace('_', ' ')
  }

  const getEventColor = (evento) => {
    switch (evento) {
      case 'Gol': return 'bg-green-500 text-white'
      case 'Perdida': return 'bg-red-500 text-white'
      case 'Lanzamiento_Parado': return 'bg-yellow-500 text-white'
      case 'Lanzamiento_Fuera': return 'bg-orange-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getEventIcon = (evento) => {
    switch (evento) {
      case 'Gol': return '⚽'
      case 'Perdida': return '❌'
      case 'Lanzamiento_Parado': return '🥅'
      case 'Lanzamiento_Fuera': return '📤'
      default: return '🎯'
    }
  }

  const handleDelete = (index) => {
    onDelete(index)
    setShowDeleteConfirm(null)
  }

  // Generar resumen de estadísticas
  const getStats = () => {
    const stats = {
      total: actions.length,
      goles: actions.filter(a => a.evento === 'Gol').length,
      perdidas: actions.filter(a => a.evento === 'Perdida').length,
      paradas: actions.filter(a => a.evento === 'Lanzamiento_Parado').length,
      fuera: actions.filter(a => a.evento === 'Lanzamiento_Fuera').length,
      local: actions.filter(a => a.equipo_accion === matchData.equipo_propio).length,
      visitante: actions.filter(a => a.equipo_accion === matchData.equipo_rival).length
    }
    return stats
  }

  const generateJSON = () => {
    return {
      datos_partido: matchData,
      acciones: actions
    }
  }

  if (actions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="gradient-card card-hover shadow-2xl rounded-2xl p-12 text-center">
          <img src={isotipo} alt="Logo" className="h-20 w-auto mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📊 No hay acciones registradas
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Regresa al formulario de acciones para comenzar a registrar jugadas.
          </p>
          <div className="text-6xl mb-4">⚽🏟️🎯</div>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header con estadísticas */}
      <div className="gradient-card card-hover shadow-2xl rounded-2xl border-t-4 border-purple-500 overflow-hidden">
        <div className="gradient-header px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={isotipo} alt="Logo" className="h-12 w-auto mr-4 drop-shadow-lg" />
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  📊 Revisión de Acciones
                </h2>
                <p className="text-blue-100 mt-1">
                  {matchData.equipo_propio} vs {matchData.equipo_rival}
                </p>
              </div>
            </div>
            <button
              onClick={onSend}
              disabled={isLoading || actions.length === 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-white text-brand-red hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? '📤 Enviando...' : '🚀 Enviar a Make'}
            </button>
          </div>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 via-white to-red-50">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-brand-blue">
              <div className="text-3xl font-bold text-brand-blue">{stats.total}</div>
              <div className="text-sm font-semibold text-gray-600">📊 Total</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600">{stats.goles}</div>
              <div className="text-sm font-semibold text-gray-600">⚽ Goles</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-red-500">
              <div className="text-3xl font-bold text-red-600">{stats.perdidas}</div>
              <div className="text-sm font-semibold text-gray-600">❌ Pérdidas</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-yellow-500">
              <div className="text-3xl font-bold text-yellow-600">{stats.paradas}</div>
              <div className="text-sm font-semibold text-gray-600">🥅 Paradas</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-orange-500">
              <div className="text-3xl font-bold text-orange-600">{stats.fuera}</div>
              <div className="text-sm font-semibold text-gray-600">📤 Fuera</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-brand-blue">
              <div className="text-3xl font-bold text-brand-blue">{stats.local}</div>
              <div className="text-sm font-semibold text-gray-600">🏠 {matchData.equipo_propio?.substring(0, 8) || 'Local'}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-md border-l-4 border-brand-red">
              <div className="text-3xl font-bold text-brand-red">{stats.visitante}</div>
              <div className="text-sm font-semibold text-gray-600">✈️ {matchData.equipo_rival?.substring(0, 8) || 'Visitante'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de acciones mejorada */}
      <div className="gradient-card card-hover shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-brand-red px-8 py-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">
            📋 Acciones Registradas ({actions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  # Pos.
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Zona
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Cambio
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actions.map((action, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-blue text-white rounded-full text-sm font-bold">
                      {action.id_posesion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      action.equipo_accion === matchData.equipo_propio 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {action.equipo_accion === matchData.equipo_propio ? '🏠' : '✈️'} 
                      {action.equipo_accion?.substring(0, 10) || action.equipo_accion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getEventColor(action.evento)}`}>
                      {getEventIcon(action.evento)} {action.evento.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {action.tipo_ataque}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFieldValue('detalle_finalizacion', action.detalle_finalizacion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFieldValue('zona_lanzamiento', action.zona_lanzamiento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      action.cambio_posesion ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {action.cambio_posesion ? '✅ SÍ' : '❌ NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-brand-blue hover:text-blue-700 transition-colors duration-200"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(index)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Preview mejorado */}
      <div className="gradient-card card-hover shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-8 py-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">
            💻 Vista previa JSON
          </h3>
        </div>
        <div className="p-8">
          <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto text-sm font-mono border-2 border-gray-700">
            {JSON.stringify(generateJSON(), null, 2)}
          </pre>
        </div>
      </div>

      {/* Modal de confirmación de eliminación mejorado */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Confirmar eliminación
              </h3>
              <p className="text-gray-600 mb-8">
                ¿Estás seguro de que quieres eliminar la acción #{showDeleteConfirm + 1}? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200"
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all duration-200"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionsList