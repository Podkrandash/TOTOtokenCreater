const theme = {
  colors: {
    primary: '#00A3FF', // Более яркий голубой
    secondary: '#007BFF', // Классический синий для акцентов
    accent: '#8A2BE2', // Фиолетовый акцент (пример)
    
    background: '#0D0F12',      // Очень темный, почти черный фон
    backgroundSecondary: '#1A1D21', // Чуть светлее для карточек/панелей
    backgroundGlass: 'rgba(20, 22, 26, 0.7)', // Для эффекта стекла

    text: '#EAEAEA',          // Светло-серый текст, не чисто белый
    textSecondary: '#A0A0A0', // Более темный серый для вторичного текста
    
    border: '#2A2D31',       // Темная граница
    borderLight: 'rgba(255, 255, 255, 0.1)', // Светлая граница для glassmorphism

    error: '#FF4D4D',
    success: '#33CC33',
    warning: '#FFC107',
  },
  fonts: {
    body: '\'Eurostile Bold Extended\', Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    heading: '\'Eurostile Bold Extended\', Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    round: '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.15)',
    md: '0 4px 12px rgba(0,0,0,0.2)',
    lg: '0 10px 20px rgba(0,0,0,0.2), 0 0 15px rgba(0, 163, 255, 0.1)', // Добавлен легкий отсвет от primary
    xl: '0 15px 30px rgba(0,0,0,0.25), 0 0 25px rgba(0, 163, 255, 0.15)',
  },
  // Можно добавить градиенты
  gradients: {
    primary: 'linear-gradient(45deg, #00A3FF, #007BFF)',
    accent: 'linear-gradient(45deg, #8A2BE2, #4B0082)',
  }
}

export default theme; 