import { useState, useEffect } from 'react'
import MatchDataForm from './components/MatchDataForm'
import ActionForm from './components/ActionForm'
import ActionsList from './components/ActionsList'
import ErrorModal from './components/ErrorModal'
import logotipo from './assets/logotipo_fondo_blanco.png'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState('match') // 'match', 'actions', 'review'
  const [matchData, setMatchData] = useState({})
  const [actions, setActions] = useState([])
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedMatchData = localStorage.getItem('handballMatchData')
    const savedActions = localStorage.getItem('handballActions')
    
    if (savedMatchData) {
      setMatchData(JSON.parse(savedMatchData))
    }
    if (savedActions) {
      setActions(JSON.parse(savedActions))
    }
  }, [])

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (Object.keys(matchData).length > 0) {
      localStorage.setItem('handballMatchData', JSON.stringify(matchData))
    }
  }, [matchData])

  useEffect(() => {
    localStorage.setItem('handballActions', JSON.stringify(actions))
  }, [actions])

  const handleMatchSubmit = (data) => {
    setMatchData(data)
    setCurrentStep('actions')
  }

  const handleActionSubmit = (action) => {
    const newAction = {
      ...action,
      id_posesion: actions.length + 1
    }
    setActions([...actions, newAction])
  }

  const handleActionEdit = (index, updatedAction) => {
    const newActions = [...actions]
    newActions[index] = { ...updatedAction, id_posesion: index + 1 }
    setActions(newActions)
  }

  const handleActionDelete = (index) => {
    const newActions = actions.filter((_, i) => i !== index)
    // Reajustar id_posesion
    const reindexedActions = newActions.map((action, i) => ({
      ...action,
      id_posesion: i + 1
    }))
    setActions(reindexedActions)
  }

  const handleSendToWebhook = async () => {
    setIsLoading(true)
    try {
      const payload = {
        datos_partido: matchData,
        acciones: actions
      }

      // URL de ejemplo para webhook de Make
      const webhookUrl = 'https://hook.eu2.make.com/example-webhook-url'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        // Limpiar datos después del envío exitoso
        setMatchData({})
        setActions([])
        localStorage.removeItem('handballMatchData')
        localStorage.removeItem('handballActions')
        setCurrentStep('match')
        alert('Datos enviados correctamente!')
      } else {
        throw new Error('Error en el envío')
      }
    } catch (error) {
      setErrors(['Error al enviar los datos al webhook: ' + error.message])
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors([])
  }

  const resetData = () => {
    setMatchData({})
    setActions([])
    localStorage.removeItem('handballMatchData')
    localStorage.removeItem('handballActions')
    setCurrentStep('match')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-blue via-blue-600 to-brand-red shadow-lg border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={logotipo} alt="HandballStats Pro" className="h-12 w-auto drop-shadow-lg" />
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  currentStep === 'match' ? 'bg-yellow-400' : 
                  currentStep === 'actions' ? 'bg-green-400' : 'bg-purple-400'
                }`}></div>
                <span className="text-lg font-bold text-white drop-shadow-md">
                  {currentStep === 'match' ? 'Datos del Partido' : 
                   currentStep === 'actions' ? 'Registro de Acciones' : 'Revisión'}
                </span>
              </div>
              {(currentStep === 'actions' || currentStep === 'review') && (
                <button
                  onClick={resetData}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  🔄 Reiniciar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-0">
            <button
              onClick={() => setCurrentStep('match')}
              className={`py-4 px-6 border-b-4 font-bold text-sm transition-all duration-200 ${
                currentStep === 'match'
                  ? 'border-brand-blue text-brand-blue bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-brand-blue hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              📋 Datos del Partido
            </button>
            <button
              onClick={() => Object.keys(matchData).length > 0 && setCurrentStep('actions')}
              disabled={Object.keys(matchData).length === 0}
              className={`py-4 px-6 border-b-4 font-bold text-sm transition-all duration-200 ${
                currentStep === 'actions'
                  ? 'border-brand-red text-brand-red bg-red-50'
                  : Object.keys(matchData).length === 0
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-brand-red hover:border-red-300 hover:bg-red-25'
              }`}
            >
              ⚽ Registro de Acciones ({actions.length})
            </button>
            <button
              onClick={() => actions.length > 0 && setCurrentStep('review')}
              disabled={actions.length === 0}
              className={`py-4 px-6 border-b-4 font-bold text-sm transition-all duration-200 ${
                currentStep === 'review'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : actions.length === 0
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              📊 Revisión y Envío
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currentStep === 'match' && (
          <div className="fade-in">
            <MatchDataForm 
              onSubmit={handleMatchSubmit} 
              initialData={matchData}
              setErrors={setErrors}
            />
          </div>
        )}

        {currentStep === 'actions' && (
          <div className="fade-in">
            <ActionForm 
              onSubmit={handleActionSubmit}
              actions={actions}
              setErrors={setErrors}
              matchData={matchData}
            />
          </div>
        )}

        {currentStep === 'review' && (
          <div className="fade-in">
            <ActionsList
              actions={actions}
              onEdit={handleActionEdit}
              onDelete={handleActionDelete}
              onSend={handleSendToWebhook}
              isLoading={isLoading}
              matchData={matchData}
            />
          </div>
        )}
      </main>

      {/* Error Modal */}
      {errors.length > 0 && (
        <ErrorModal 
          errors={errors} 
          onClose={clearErrors} 
        />
      )}
    </div>
  )
}

export default App