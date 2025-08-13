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
      id_partido: matchData.id_partido,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logotipo} alt="HandballStats Pro" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === 'match' ? 'bg-brand-blue' : currentStep === 'actions' ? 'bg-brand-red' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {currentStep === 'match' ? 'Datos del Partido' : 
                   currentStep === 'actions' ? 'Registro de Acciones' : 'Revisión'}
                </span>
              </div>
              {(currentStep === 'actions' || currentStep === 'review') && (
                <button
                  onClick={resetData}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reiniciar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentStep('match')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentStep === 'match'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Datos del Partido
            </button>
            <button
              onClick={() => Object.keys(matchData).length > 0 && setCurrentStep('actions')}
              disabled={Object.keys(matchData).length === 0}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentStep === 'actions'
                  ? 'border-brand-blue text-brand-blue'
                  : Object.keys(matchData).length === 0
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registro de Acciones ({actions.length})
            </button>
            <button
              onClick={() => actions.length > 0 && setCurrentStep('review')}
              disabled={actions.length === 0}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentStep === 'review'
                  ? 'border-brand-blue text-brand-blue'
                  : actions.length === 0
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Revisión y Envío
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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