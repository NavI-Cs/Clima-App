import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

/* Ionic core CSS */
import '@ionic/react/css/core.css'

/* Optional Ionic CSS utils (recomendado) */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import { setupIonicReact, IonApp } from '@ionic/react'

setupIonicReact()

ReactDOM.createRoot(document.getElementById('root')).render(
  <IonApp>
    <App />
  </IonApp>
)
