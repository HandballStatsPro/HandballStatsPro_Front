class ValidationSystem {
  constructor() {
    this.eventosPerdida = [
      'Pasos', 'Dobles', 'FaltaAtaque', 'Pasivo', 
      'InvasionArea', 'Robo', 'Pie', 'BalonFuera'
    ]
  }

  validateAction(action, previousActions = []) {
    const errors = []

    // Validación de regla de 7 metros
    if (action.origen_accion === '_7m') {
      if (action.detalle_finalizacion !== '_7m') {
        errors.push('Si origen_accion es _7m, detalle_finalizacion debe ser _7m')
      }
      if (action.zona_lanzamiento !== '_7m') {
        errors.push('Si origen_accion es _7m, zona_lanzamiento debe ser _7m')
      }
      if (action.tipo_ataque !== 'Posicional') {
        errors.push('Si origen_accion es _7m, tipo_ataque debe ser Posicional')
      }
    }

    // Validación de tipo de ataque
    if (action.tipo_ataque === 'Contraataque') {
      const opcionesContraataque = ['Contragol', 'Primera_Oleada', 'Segunda_Oleada', 'Tercera_Oleada']
      if (!opcionesContraataque.includes(action.detalle_finalizacion)) {
        errors.push('Si tipo_ataque es Contraataque, detalle_finalizacion debe ser uno de: ' + 
                   opcionesContraataque.join(', '))
      }
    } else if (action.tipo_ataque === 'Posicional') {
      const opcionesPosicional = ['Lanzamiento_Exterior', 'Pivote', 'Penetracion', 'Extremo', '_7m']
      if (action.detalle_finalizacion && !opcionesPosicional.includes(action.detalle_finalizacion)) {
        errors.push('Si tipo_ataque es Posicional, detalle_finalizacion debe ser uno de: ' + 
                   opcionesPosicional.join(', '))
      }
    }

    // Validación de eventos
    if (action.evento === 'Gol') {
      if (!action.detalle_finalizacion) {
        errors.push('Para evento Gol, detalle_finalizacion es obligatorio')
      }
      if (!action.zona_lanzamiento) {
        errors.push('Para evento Gol, zona_lanzamiento es obligatorio')
      }
    }

    if (action.evento === 'Lanzamiento_Parado') {
      if (!action.detalle_finalizacion) {
        errors.push('Para evento Lanzamiento_Parado, detalle_finalizacion es obligatorio')
      }
      if (!action.zona_lanzamiento) {
        errors.push('Para evento Lanzamiento_Parado, zona_lanzamiento es obligatorio')
      }
      if (!['Parada_Portero', 'Bloqueo_Defensor'].includes(action.detalle_evento)) {
        errors.push('Para evento Lanzamiento_Parado, detalle_evento debe ser Parada_Portero o Bloqueo_Defensor')
      }
    }

    if (action.evento === 'Lanzamiento_Fuera') {
      if (!action.detalle_finalizacion) {
        errors.push('Para evento Lanzamiento_Fuera, detalle_finalizacion es obligatorio')
      }
      if (!action.zona_lanzamiento) {
        errors.push('Para evento Lanzamiento_Fuera, zona_lanzamiento es obligatorio')
      }
      if (!['Palo', 'Fuera_Directo'].includes(action.detalle_evento)) {
        errors.push('Para evento Lanzamiento_Fuera, detalle_evento debe ser Palo o Fuera_Directo')
      }
    }

    if (action.evento === 'Perdida') {
      if (action.detalle_finalizacion) {
        errors.push('Para evento Perdida, detalle_finalizacion debe ser null/vacío')
      }
      if (action.zona_lanzamiento) {
        errors.push('Para evento Perdida, zona_lanzamiento debe ser null/vacío')
      }
      if (!this.eventosPerdida.includes(action.detalle_evento)) {
        errors.push('Para evento Perdida, detalle_evento debe ser uno de: ' + 
                   this.eventosPerdida.join(', '))
      }
    }

    // Validación secuencial (solo si hay acciones previas)
    if (previousActions.length > 0) {
      const lastAction = previousActions[previousActions.length - 1]
      
      if (action.origen_accion === 'Juego_Continuado') {
        if (!lastAction.cambio_posesion) {
          errors.push('Si origen_accion es Juego_Continuado, la acción anterior debe tener cambio_posesion = true')
        }
      }

      if (['Rebote_Directo', 'Rebote_Indirecto'].includes(action.origen_accion)) {
        if (lastAction.cambio_posesion) {
          errors.push('Si origen_accion es Rebote_Directo o Rebote_Indirecto, la acción anterior debe tener cambio_posesion = false')
        }
      }
    }

    return errors
  }

  calculateCambioPosesion(evento, detalleEvento) {
    // cambio_posesion = false solo en casos específicos
    if (evento === 'Lanzamiento_Parado' && 
        ['Parada_Portero', 'Bloqueo_Defensor'].includes(detalleEvento)) {
      return false
    }
    
    if (evento === 'Lanzamiento_Fuera' && detalleEvento === 'Palo') {
      return false
    }

    // En cualquier otro caso, cambio_posesion = true
    return true
  }

  // Método para validar la secuencia completa de acciones
  validateActionSequence(actions) {
    const errors = []
    
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i]
      const previousActions = actions.slice(0, i)
      
      const actionErrors = this.validateAction(action, previousActions)
      actionErrors.forEach(error => {
        errors.push(`Acción ${i + 1}: ${error}`)
      })
    }

    return errors
  }

  // Método para obtener las opciones válidas para un campo dado el contexto
  getValidOptions(field, context) {
    switch (field) {
      case 'detalle_finalizacion':
        if (context.origen_accion === '_7m') {
          return ['_7m']
        }
        if (context.tipo_ataque === 'Posicional') {
          return ['Lanzamiento_Exterior', 'Pivote', 'Penetracion', 'Extremo', '_7m']
        } else {
          return ['Contragol', 'Primera_Oleada', 'Segunda_Oleada', 'Tercera_Oleada']
        }
      
      case 'zona_lanzamiento':
        if (context.origen_accion === '_7m') {
          return ['_7m']
        }
        return ['Izquierda', 'Centro', 'Derecha', '_7m']
      
      case 'detalle_evento':
        if (context.evento === 'Lanzamiento_Parado') {
          return ['Parada_Portero', 'Bloqueo_Defensor']
        }
        if (context.evento === 'Lanzamiento_Fuera') {
          return ['Palo', 'Fuera_Directo']
        }
        if (context.evento === 'Perdida') {
          return this.eventosPerdida
        }
        return []
      
      default:
        return []
    }
  }
}

export default ValidationSystem