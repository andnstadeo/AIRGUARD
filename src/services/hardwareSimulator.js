// Mock hardware simulation service
// Generates realistic sensor data

export class HardwareSimulator {
  constructor() {
    this.isRunning = false
    this.interval = null
    this.baseData = {
      dustLevel: 150,
      pm25: 25,
      pm10: 50,
      temperature: 22,
      humidity: 45,
    }
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.interval = setInterval(() => {
      // Simulate realistic variations
    }, 1000)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.isRunning = false
    }
  }

  generateData() {
    const variance = (base, percent = 10) => {
      const change = (Math.random() - 0.5) * base * (percent / 100)
      return Math.max(0, base + change)
    }

    const dustLevel = variance(this.baseData.dustLevel, 15)
    const pm25 = variance(this.baseData.pm25, 20)
    const pm10 = variance(this.baseData.pm10, 20)
    const temperature = variance(this.baseData.temperature, 5)
    const humidity = Math.max(20, Math.min(90, variance(this.baseData.humidity, 15)))

    // Calculate AQI (simplified US EPA method)
    let aqi
    if (pm25 <= 12) aqi = (pm25 / 12) * 50
    else if (pm25 <= 35.4) aqi = ((pm25 - 12) / 23.4) * 50 + 50
    else if (pm25 <= 55.4) aqi = ((pm25 - 35.4) / 20) * 50 + 100
    else if (pm25 <= 150.4) aqi = ((pm25 - 55.4) / 95) * 50 + 150
    else aqi = ((pm25 - 150.4) / 250.4) * 50 + 200

    return {
      dustLevel: Math.round(dustLevel * 10) / 10,
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      aqi: Math.round(aqi),
    }
  }

  setBaseData(data) {
    this.baseData = { ...this.baseData, ...data }
  }
}

export const hwSimulator = new HardwareSimulator()
