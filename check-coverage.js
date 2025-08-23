const fs = require('fs');
const path = require('path');

// Umbrales mínimos de cobertura
const MIN_THRESHOLDS = {
  statements: 80,
  branches: 70,
  functions: 80,
  lines: 80
};

// Ruta al archivo de resumen de cobertura
const coverageSummaryPath = path.join(__dirname, 'coverage', 'coverage-summary.json');

// Leer el archivo de resumen de cobertura
if (!fs.existsSync(coverageSummaryPath)) {
  console.error('❌ No se encontró el archivo de resumen de cobertura.');
  process.exit(1);
}

const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
const totalCoverage = coverageSummary.total;

// Verificar cada categoría de cobertura
let failed = false;
for (const category of Object.keys(MIN_THRESHOLDS)) {
  const actual = totalCoverage[category].pct;
  const min = MIN_THRESHOLDS[category];

  if (actual < min) {
    console.error(`❌ Cobertura de ${category} insuficiente: ${actual}% (mínimo requerido: ${min}%)`);
    failed = true;
  } else {
    console.log(`✅ Cobertura de ${category}: ${actual}% (requerido: ${min}%)`);
  }
}

// Salir con error si no se cumplen los thresholds
if (failed) {
  console.error('\n❌ Los tests fallaron debido a cobertura insuficiente.');
  process.exit(1);
}

console.log('\n✅ Todos los thresholds de cobertura se cumplen.');
