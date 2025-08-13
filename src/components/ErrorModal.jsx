import { useEffect } from 'react'

const ErrorModal = ({ errors, onClose }) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg 
                  className="h-6 w-6 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Errores de Validación
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Se encontraron los siguientes errores que deben corregirse:
          </p>
          
          <div className="space-y-3">
            {errors.map((error, index) => (
              <div 
                key={index} 
                className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <svg 
                    className="h-4 w-4 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 font-medium">
                    Error {index + 1}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Total: {errors.length} error{errors.length !== 1 ? 'es' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal