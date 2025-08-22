import React, { useState } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonIcon, IonToast, IonSpinner
} from '@ionic/react'
import { cloudOutline, alertCircleOutline, searchOutline } from 'ionicons/icons'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export default function App() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(null)

  const fetchWeather = async () => {
    const q = city.trim()
    if (!q) {
      setError('Ingresa el nombre de una ciudad.')
      return
    }
    if (!API_KEY) {
      setError('Falta la API key (configura VITE_OPENWEATHER_API_KEY en .env).')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric&lang=es`
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        // Manejo de errores comunes (ej. 404 ciudad no encontrada)
        const msg = data?.message || 'Error al consultar el clima.'
        throw new Error(msg)
      }

      // Datos mínimos requeridos: temperatura y descripción
      const result = {
        name: data.name,
        country: data.sys?.country,
        temp: Math.round(data.main?.temp),
        feels: Math.round(data.main?.feels_like),
        desc: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        humidity: data.main?.humidity,
        wind: Math.round(data.wind?.speed)
      }

      setWeather(result)
    } catch (e) {
      // Ej: "city not found"
      const msg = String(e.message || e)
      setError(msg.charAt(0).toUpperCase() + msg.slice(1))
    } finally {
      setLoading(false)
    }
  }

  const onEnter = (ev) => {
    if (ev.key === 'Enter') fetchWeather()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Clima • OpenWeather</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonItem>
          <IonLabel position="floating">Ciudad</IonLabel>
          <IonInput
            value={city}
            onIonChange={(e) => setCity(e.detail.value || '')}
            onKeyDown={onEnter}
            clearInput
            placeholder="Ej: La Paz, Madrid, Buenos Aires..."
          />
        </IonItem>

        <div className="ion-text-right" style={{ marginTop: 12 }}>
          <IonButton onClick={fetchWeather} disabled={loading}>
            {loading ? <IonSpinner name="dots" /> : <IonIcon icon={searchOutline} slot="start" />}
            Buscar
          </IonButton>
        </div>

        {/* Resultado */}
        {weather && (
          <IonCard className="ion-margin-top">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={cloudOutline} style={{ marginRight: 8 }} />
                {weather.name}{weather.country ? `, ${weather.country}` : ''}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="ion-text-center" style={{ marginBottom: 8 }}>
                {weather.icon && (
                  <img
                    alt="icono clima"
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    style={{ width: 80, height: 80 }}
                  />
                )}
                <div style={{ fontSize: 48, fontWeight: 800 }}>
                  {weather.temp}°C
                </div>
                <div style={{ textTransform: 'capitalize', opacity: 0.8 }}>
                  {weather.desc}
                </div>
              </div>

              <div className="ion-text-center" style={{ opacity: 0.9 }}>
                Sensación: {weather.feels}°C • Humedad: {weather.humidity}% • Viento: {weather.wind} m/s
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Mensaje de error */}
        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError('')}
          message={`${error}`}
          duration={2200}
          color="danger"
          icon={alertCircleOutline}
        />
      </IonContent>
    </IonPage>
  )
}
