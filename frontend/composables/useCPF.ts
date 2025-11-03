/**
 * Composable para formatação e validação de CPF
 */
export function useCPF() {
  /**
   * Formata o CPF aplicando a máscara 000.000.000-00
   */
  function formatCPF(value: string): string {
    const cpf = value.replace(/\D/g, '').slice(0, 11)
    
    if (cpf.length > 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    } else if (cpf.length > 6) {
      return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    } else if (cpf.length > 3) {
      return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    }
    
    return cpf
  }

  /**
   * Remove a formatação do CPF, retornando apenas os dígitos
   */
  function cleanCPF(value: string): string {
    return value.replace(/\D/g, '')
  }

  /**
   * Valida o CPF verificando os dígitos verificadores
   */
  function validateCPF(cpf: string): boolean {
    const cleaned = cleanCPF(cpf)
    
    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleaned.charAt(9))) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleaned.charAt(10))) return false
    
    return true
  }

  return {
    formatCPF,
    cleanCPF,
    validateCPF
  }
}
