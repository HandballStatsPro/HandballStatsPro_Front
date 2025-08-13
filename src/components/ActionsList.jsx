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
      case 'Gol': return 'bg-green-100 text-green-800'
      case 'Perdida': return 'bg-red-100 text-red-800'
      case 'Lanzamiento_Parado': return 'bg-yellow-100 text-yellow-800'
      case 'Lanzamiento_Fuera': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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
      local: actions.filter(a => a.equipo_accion === 'LOCAL').length,
      visitante: actions.filter(a => a.equipo_accion === 'VISITANTE').length
    }
    return stats
  }

  const stats = getStats()

  const generateJSON = () => {
    return {
      datos_partido: matchData,
      acciones: actions
    }
  }

  if (actions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <img src={isotipo} alt="Logo" className="h-16 w-auto mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay acciones registradas
          </h3>
          <p className="text-gray-500">
            Regresa al formulario de acciones para comenzar a registrar jugadas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header con estadísticas */}
      <div className="bg-white shadow-lg rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <img src={isotipo} alt="Logo" className="h-8 w-auto mr-3" />
                Revisión de Acciones
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {matchData.equipo_propio} vs {matchData.equipo_rival} (ID: {matchData.id_partido})
              </p>
            </div>
            <button
              onClick={onSend}
              disabled={isLoading || actions.length === 0}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-brand-red text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Enviando...' : 'Enviar a Make'}
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.goles}</div>
              <div className="text-xs text-gray-600">Goles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.perdidas}</div>
              <div className="text-xs text-gray-600">Pérdidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.paradas}</div>
              <div className="text-xs text-gray-600">Paradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.fuera}</div>
              <div className="text-xs text-gray-600">Fuera</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">{stats.local}</div>
              <div className="text-xs text-gray-600">Local</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-red">{stats.visitante}</div>
              <div className="text-xs text-gray-600">Visitante</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de acciones */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Acciones Registradas ({actions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Ataque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cambio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actions.map((action, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {action.id_posesion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      action.equipo_accion === 'LOCAL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {action.equipo_accion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(action.evento)}`}>
                      {action.evento.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {action.tipo_ataque}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFieldValue('detalle_finalizacion', action.detalle_finalizacion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFieldValue('zona_lanzamiento', action.zona_lanzamiento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      action.cambio_posesion ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {action.cambio_posesion ? 'SÍ' : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-brand-blue hover:text-blue-900"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(index)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* JSON Preview */}
      <div className="mt-6 bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Vista previa JSON
          </h3>
        </div>
        <div className="p-6">
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
            {JSON.stringify(generateJSON(), null, 2)}
          </pre>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar la acción #{showDeleteConfirm + 1}? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionsList