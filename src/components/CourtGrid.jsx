import { useState } from 'react'
import pistaImage from '../assets/pista_bm.png'

const CourtGrid = ({ mode, tipoAtaque, onSelection }) => {
  const [hoveredZone, setHoveredZone] = useState(null)

  // Definir las zonas clickeables de la cancha
  const zones = {
    // Zonas de lanzamiento
    zona_izquierda: { x: 15, y: 40, width: 25, height: 35, value: 'Izquierda' },
    zona_centro: { x: 40, y: 45, width: 20, height: 30, value: 'Centro' },
    zona_derecha: { x: 60, y: 40, width: 25, height: 35, value: 'Derecha' },
    zona_7m: { x: 42, y: 55, width: 16, height: 8, value: '_7m' },
    
    // Detalles de finalización - Posicional
    detalle_exterior_izq: { x: 10, y: 35, width: 30, height: 15, value: 'Lanzamiento_Exterior' },
    detalle_exterior_der: { x: 60, y: 35, width: 30, height: 15, value: 'Lanzamiento_Exterior' },
    detalle_pivote: { x: 35, y: 50, width: 30, height: 20, value: 'Pivote' },
    detalle_penetracion: { x: 25, y: 45, width: 50, height: 15, value: 'Penetracion' },
    detalle_extremo_izq: { x: 5, y: 20, width: 20, height: 40, value: 'Extremo' },
    detalle_extremo_der: { x: 75, y: 20, width: 20, height: 40, value: 'Extremo' },
    detalle_7m: { x: 42, y: 55, width: 16, height: 8, value: '_7m' },
    
    // Detalles de finalización - Contraataque
    detalle_contragol: { x: 35, y: 25, width: 30, height: 15, value: 'Contragol' },
    detalle_primera: { x: 20, y: 30, width: 60, height: 20, value: 'Primera_Oleada' },
    detalle_segunda: { x: 15, y: 40, width: 70, height: 25, value: 'Segunda_Oleada' },
    detalle_tercera: { x: 10, y: 50, width: 80, height: 30, value: 'Tercera_Oleada' }
  }

  const getVisibleZones = () => {
    if (mode === 'zona') {
      return ['zona_izquierda', 'zona_centro', 'zona_derecha', 'zona_7m']
    } else if (mode === 'detalle') {
      if (tipoAtaque === 'Posicional') {
        return ['detalle_exterior_izq', 'detalle_exterior_der', 'detalle_pivote', 
                'detalle_penetracion', 'detalle_extremo_izq', 'detalle_extremo_der', 'detalle_7m']
      } else {
        return ['detalle_contragol', 'detalle_primera', 'detalle_segunda', 'detalle_tercera']
      }
    }
    return []
  }

  const handleZoneClick = (zoneKey) => {
    const zone = zones[zoneKey]
    const fieldType = mode === 'zona' ? 'zona_lanzamiento' : 'detalle_finalizacion'
    onSelection(fieldType, zone.value)
  }

  const getZoneColor = (zoneKey) => {
    if (mode === 'zona') {
      switch (zones[zoneKey].value) {
        case 'Izquierda': return 'rgba(102, 155, 188, 0.6)'
        case 'Centro': return 'rgba(120, 0, 0, 0.6)'
        case 'Derecha': return 'rgba(102, 155, 188, 0.6)'
        case '_7m': return 'rgba(255, 215, 0, 0.8)'
        default: return 'rgba(102, 155, 188, 0.6)'
      }
    } else {
      // Colores para detalles de finalización
      if (tipoAtaque === 'Posicional') {
        switch (zones[zoneKey].value) {
          case 'Lanzamiento_Exterior': return 'rgba(0, 100, 255, 0.6)'
          case 'Pivote': return 'rgba(255, 100, 0, 0.6)'
          case 'Penetracion': return 'rgba(0, 200, 100, 0.6)'
          case 'Extremo': return 'rgba(200, 0, 200, 0.6)'
          case '_7m': return 'rgba(255, 215, 0, 0.8)'
          default: return 'rgba(102, 155, 188, 0.6)'
        }
      } else {
        switch (zones[zoneKey].value) {
          case 'Contragol': return 'rgba(255, 0, 0, 0.7)'
          case 'Primera_Oleada': return 'rgba(255, 100, 0, 0.6)'
          case 'Segunda_Oleada': return 'rgba(255, 200, 0, 0.6)'
          case 'Tercera_Oleada': return 'rgba(100, 255, 0, 0.6)'
          default: return 'rgba(102, 155, 188, 0.6)'
        }
      }
    }
  }

  const visibleZones = getVisibleZones()

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          {mode === 'zona' ? 'Selecciona la zona de lanzamiento' : 
           `Selecciona el detalle de finalización (${tipoAtaque})`}
        </h4>
        <p className="text-sm text-gray-600">
          Haz clic en las áreas coloreadas de la cancha
        </p>
      </div>

      <div className="relative court-container">
        <img 
          src={pistaImage} 
          alt="Cancha de balonmano" 
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '60vh' }}
        />
        
        {/* Overlay para las zonas clickeables */}
        <div className="absolute inset-0">
          {visibleZones.map(zoneKey => {
            const zone = zones[zoneKey]
            return (
              <div
                key={zoneKey}
                className="absolute cursor-pointer border-2 border-white transition-all duration-200 hover:border-yellow-400 hover:shadow-lg"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                  backgroundColor: hoveredZone === zoneKey ? 
                    getZoneColor(zoneKey).replace('0.6', '0.8') : 
                    getZoneColor(zoneKey),
                  borderColor: hoveredZone === zoneKey ? '#fbbf24' : 'white'
                }}
                onClick={() => handleZoneClick(zoneKey)}
                onMouseEnter={() => setHoveredZone(zoneKey)}
                onMouseLeave={() => setHoveredZone(null)}
                title={zone.value.replace('_', ' ')}
              />
            )
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 max-w-lg">
        <h5 className="text-sm font-semibold text-gray-700 mb-2">Leyenda:</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {visibleZones.map(zoneKey => {
            const zone = zones[zoneKey]
            return (
              <div key={zoneKey} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded border border-gray-300 mr-2"
                  style={{ backgroundColor: getZoneColor(zoneKey) }}
                />
                <span className="text-gray-700">
                  {zone.value.replace('_', ' ')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {hoveredZone && (
        <div className="mt-2 text-center">
          <span className="inline-block px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
            {zones[hoveredZone].value.replace('_', ' ')}
          </span>
        </div>
      )}
    </div>
  )
}

export default CourtGrid