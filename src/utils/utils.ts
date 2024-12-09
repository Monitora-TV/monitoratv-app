export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}



// Função para remover acentos e transformar em maiúsculas
export function gerarNoFiltro(descricao: string): string {
  // Substitui os acentos e transforma para maiúsculas
  return descricao
    .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toUpperCase(); // Transforma em maiúsculas
}