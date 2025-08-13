import { useState } from 'react'
import pistaImage from '../assets/pista_bm.png'

const CourtGrid = ({ mode, tipoAtaque, onSelection }) => {
  const [hoveredZone, setHoveredZone] = useState(null)

  // Grid detallado para ataque POSICIONAL basado en la imagen adjunta
  const posicionalZones = {
    // Fila superior: EXTREMOS y 7M
    extremo_izq_sup: { x: 5, y: 15, width: 25, height: 20, value: 'Extremo', label: 'EXTREMO IZQUIERDA' },
    zona_7m: { x: 35, y: 15, width: 30, height: 15, value: '_7m', label: '7M' },
    extremo_der_sup: { x: 70, y: 15, width: 25, height: 20, value: 'Extremo', label: 'EXTREMO DERECHA' },
    
    // Fila media superior: PIVOTES
    pivote_izq: { x: 15, y: 35, width: 25, height: 20, value: 'Pivote', label: 'PIVOTE IZQUIERDA' },
    pivote_centro: { x: 40, y: 40, width: 20, height: 20, value: 'Pivote', label: 'PIVOTE CENTRO' },
    pivote_der: { x: 60, y: 35, width: 25, height: 20, value: 'Pivote', label: 'PIVOTE DERECHA' },
    
    // Fila media inferior: PENETRACIONES
    penetracion_izq: { x: 10, y: 55, width: 25, height: 20, value: 'Penetracion', label: 'PENETRACION IZQUIERDA' },
    penetracion_centro: { x: 37.5, y: 60, width: 25, height: 20, value: 'Penetracion', label: 'PENETRACION CENTRO' },
    penetracion_der: { x: 65, y: 55, width: 25, height: 20, value: 'Penetracion', label: 'PENETRACION DERECHA' },
    
    // Fila inferior: LANZAMIENTOS EXTERIORES
    le_izq: { x: 5, y: 75, width: 25, height: 20, value: 'Lanzamiento_Exterior', label: 'L.E IZQUIERDA' },
    le_centro: { x: 37.5, y: 80, width: 25, height: 15, value: 'Lanzamiento_Exterior', label: 'L.E CENTRO' },
    le_der: { x: 70, y: 75, width: 25, height: 20, value: 'Lanzamiento_Exterior', label: 'L.E DERECHA' }
  }

  // Grid para CONTRAATAQUE (4 filas x 3 columnas)
  const contrataqueZones = {
    // CONTRAGOL (fila 1)
    contragol_izq: { x: 10, y: 20, width: 25, height: 15, value: 'Contragol', label: 'CONTRAGOL IZQUIERDA' },
    contragol_centro: { x: 37.5, y: 20, width: 25, height: 15, value: 'Contragol', label: 'CONTRAGOL CENTRO' },
    contragol_der: { x: 65, y: 20, width: 25, height: 15, value: 'Contragol', label: 'CONTRAGOL DERECHA' },
    
    // PRIMERA OLEADA (fila 2)
    primera_izq: { x: 10, y: 37, width: 25, height: 15, value: 'Primera_Oleada', label: 'PRIMERA OLEADA IZQUIERDA' },
    primera_centro: { x: 37.5, y: 37, width: 25, height: 15, value: 'Primera_Oleada', label: 'PRIMERA OLEADA CENTRO' },
    primera_der: { x: 65, y: 37, width: 25, height: 15, value: 'Primera_Oleada', label: 'PRIMERA OLEADA DERECHA' },
    
    // SEGUNDA OLEADA (fila 3)
    segunda_izq: { x: 10, y: 54, width: 25, height: 15, value: 'Segunda_Oleada', label: 'SEGUNDA OLEADA IZQUIERDA' },
    segunda_centro: { x: 37.5, y: 54, width: 25, height: 15, value: 'Segunda_Oleada', label: 'SEGUNDA OLEADA CENTRO' },
    segunda_der: { x: 65, y: 54, width: 25, height: 15, value: 'Segunda_Oleada', label: 'SEGUNDA OLEADA DERECHA' },
    
    // TERCERA OLEADA (fila 4)
    tercera_izq: { x: 10, y: 71, width: 25, height: 15, value: 'Tercera_Oleada', label: 'TERCERA OLEADA IZQUIERDA' },
    tercera_centro: { x: 37.5, y: 71, width: 25, height: 15, value: 'Tercera_Oleada', label: 'TERCERA OLEADA CENTRO' },
    tercera_der: { x: 65, y: 71, width: 25, height: 15, value: 'Tercera_Oleada', label: 'TERCERA OLEADA DERECHA' }
  }

  // Zonas simples para ZONA DE LANZAMIENTO
  const zonaLanzamientoZones = {
    zona_izquierda: { x: 15, y: 40, width: 25, height: 35, value: 'Izquierda', label: 'ZONA IZQUIERDA' },
    zona_centro: { x: 40, y: 45, width: 20, height: 30, value: 'Centro', label: 'ZONA CENTRO' },
    zona_derecha: { x: 60, y: 40, width: 25, height: 35, value: 'Derecha', label: 'ZONA DERECHA' },
    zona_7m: { x: 42, y: 55, width: 16, height: 8, value: '_7m', label: '7 METROS' }
  }

  const getVisibleZones = () => {
    if (mode === 'zona') {
      return zonaLanzamientoZones
    } else if (mode === 'detalle') {
      if (tipoAtaque === 'Posicional') {
        return posicionalZones
      } else {
        return contrataqueZones
      }
    }
    return {}
  }

  const handleZoneClick = (zoneKey) => {
    const zones = getVisibleZones()
    const zone = zones[zoneKey]
    const fieldType = mode === 'zona' ? 'zona_lanzamiento' : 'detalle_finalizacion'
    onSelection(fieldType, zone.value)
  }

  const getZoneColor = (zoneKey, zone) => {
    if (mode === 'zona') {
      switch (zone.value) {
        case 'Izquierda': return 'rgba(102, 155, 188, 0.7)'
        case 'Centro': return 'rgba(120, 0, 0, 0.7)'
        case 'Derecha': return 'rgba(102, 155, 188, 0.7)'
        case '_7m': return 'rgba(255, 215, 0, 0.9)'
        default: return 'rgba(102, 155, 188, 0.7)'
      }
    } else {
      // Colores para detalles de finalización
      if (tipoAtaque === 'Posicional') {
        switch (zone.value) {
          case 'Lanzamiento_Exterior': return 'rgba(59, 130, 246, 0.8)' // Azul
          case 'Pivote': return 'rgba(239, 68, 68, 0.8)' // Rojo
          case 'Penetracion': return 'rgba(34, 197, 94, 0.8)' // Verde
          case 'Extremo': return 'rgba(168, 85, 247, 0.8)' // Púrpura
          case '_7m': return 'rgba(255, 215, 0, 0.9)' // Dorado
          default: return 'rgba(102, 155, 188, 0.7)'
        }
      } else {
        switch (zone.value) {
          case 'Contragol': return 'rgba(239, 68, 68, 0.9)' // Rojo intenso
          case 'Primera_Oleada': return 'rgba(245, 101, 101, 0.8)' // Rojo medio
          case 'Segunda_Oleada': return 'rgba(252, 165, 165, 0.8)' // Rojo claro
          case 'Tercera_Oleada': return 'rgba(254, 202, 202, 0.8)' // Rojo muy claro
          default: return 'rgba(102, 155, 188, 0.7)'
        }
      }
    }
  }

  const visibleZones = getVisibleZones()

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h4 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center">
          {mode === 'zona' ? '📍 Selecciona la zona de lanzamiento' : 
           `🎯 Selecciona el detalle de finalización`}
        </h4>
        <div className="bg-gradient-to-r from-blue-50 to-red-50 p-4 rounded-xl border-2 border-blue-200">
          <p className="text-lg font-semibold text-gray-700">
            {mode === 'detalle' && tipoAtaque === 'Posicional' && '🏰 Ataque Posicional - Grid Detallado'}
            {mode === 'detalle' && tipoAtaque === 'Contraataque' && '⚡ Contraataque - Grid 4x3'}
            {mode === 'zona' && '📍 Zonas de Lanzamiento'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Haz clic en las áreas coloreadas de la cancha
          </p>
        </div>
      </div>

      <div className="relative court-container">
        <img 
          src={pistaImage} 
          alt="Cancha de balonmano" 
          className="max-w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
          style={{ maxHeight: '70vh', minHeight: '500px' }}
        />
        
        {/* Overlay para las zonas clickeables */}
        <div className="absolute inset-0">
          {Object.entries(visibleZones).map(([zoneKey, zone]) => (
            <div
              key={zoneKey}
              className="absolute cursor-pointer border-3 border-white transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl court-zone rounded-lg"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                backgroundColor: hoveredZone === zoneKey ? 
                  getZoneColor(zoneKey, zone).replace('0.7', '0.9').replace('0.8', '1.0') : 
                  getZoneColor(zoneKey, zone),
                borderColor: hoveredZone === zoneKey ? '#fbbf24' : 'white',
                borderWidth: hoveredZone === zoneKey ? '4px' : '3px'
              }}
              onClick={() => handleZoneClick(zoneKey)}
              onMouseEnter={() => setHoveredZone(zoneKey)}
              onMouseLeave={() => setHoveredZone(null)}
              title={zone.label}
            >
              {/* Etiqueta interna para zonas grandes */}
              {hoveredZone === zoneKey && zone.width > 20 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-bold text-center leading-tight">
                    {zone.label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda mejorada */}
      <div className="mt-8 w-full max-w-4xl">
        <h5 className="text-xl font-bold text-gray-800 mb-4 text-center">🎨 Leyenda de Colores</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(visibleZones).reduce((acc, [zoneKey, zone]) => {
            // Agrupar por valor para evitar duplicados
            const existing = acc.find(item => item.value === zone.value)
            if (!existing) {
              acc.push({ key: zoneKey, ...zone })
            }
            return acc
          }, []).map(zone => (
            <div key={zone.key} className="flex items-center p-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div 
                className="w-6 h-6 rounded-lg border-2 border-white shadow-md mr-3 flex-shrink-0"
                style={{ backgroundColor: getZoneColor(zone.key, zone) }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {zone.value.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Información de zona seleccionada */}
      {hoveredZone && (
        <div className="mt-6 text-center">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-red text-white text-lg font-bold rounded-2xl shadow-lg">
            🎯 {visibleZones[hoveredZone].label}
          </div>
        </div>
      )}
    </div>
  )
}

export default CourtGrid