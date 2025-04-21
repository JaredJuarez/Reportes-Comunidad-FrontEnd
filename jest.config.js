module.exports = {
    testEnvironment: 'node', // Define el entorno de prueba, puede ser 'jsdom' para pruebas en navegadores
    roots: ['<rootDir>/tests'], // Define la ubicación de la carpeta de pruebas
    collectCoverage: true, // Habilita la recolección de cobertura de código
    coverageDirectory: 'coverage', // Directorio donde se almacenará el reporte de cobertura
    coverageReporters: ['lcov', 'text'], // Tipos de reportes de cobertura
    testMatch: ['**/*.test.js'], // Coincide con todos los archivos de prueba que terminan en .test.js
  };