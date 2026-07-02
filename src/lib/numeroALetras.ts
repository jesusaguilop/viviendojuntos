const unidades = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const decenas = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function convertirGrupo(n: number): string {
  let result = "";
  if (n >= 100) {
    const c = Math.floor(n / 100);
    if (n === 100) return "cien";
    result += centenas[c] + " ";
    n %= 100;
  }
  if (n >= 20) {
    const d = Math.floor(n / 10);
    result += decenas[d];
    n %= 10;
    if (n > 0) result += " y " + unidades[n];
    else result += " ";
  } else if (n >= 10) {
    result += especiales[n - 10] + " ";
  } else if (n > 0) {
    result += unidades[n] + " ";
  }
  return result.trim();
}

export function numeroALetras(num: number): string {
  if (num === 0) return "cero";

  const entero = Math.floor(Math.abs(num));
  const decimales = Math.round((Math.abs(num) - entero) * 100);

  let result = num < 0 ? "menos " : "";

  const millones = Math.floor(entero / 1000000);
  const miles = Math.floor((entero % 1000000) / 1000);
  const resto = entero % 1000;

  if (millones > 0) {
    if (millones === 1) result += "un millón ";
    else result += convertirGrupo(millones) + " millones ";
  }
  if (miles > 0) {
    if (miles === 1) result += "mil ";
    else result += convertirGrupo(miles) + " mil ";
  }
  if (resto > 0) {
    result += convertirGrupo(resto);
  }

  result = result.replace(/\s+/g, " ").trim();

  if (decimales > 0) {
    result += ` con ${decimales}/100`;
  }

  return result;
}
