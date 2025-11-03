export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message: string
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export interface ValidationErrors {
  [key: string]: string[]
}

export function useFormValidation() {
  const errors = ref<ValidationErrors>({})

  const validateField = (fieldName: string, value: any, rules: ValidationRule[]): string[] => {
    const fieldErrors: string[] = []

    for (const rule of rules) {
      // Validação de campo obrigatório
      if (rule.required && (!value || value.toString().trim() === '')) {
        fieldErrors.push(rule.message)
        continue
      }

      // Se não é obrigatório e está vazio, pula outras validações
      if (!value || value.toString().trim() === '') {
        continue
      }

      // Validação de tamanho mínimo
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(rule.message)
      }

      // Validação de tamanho máximo
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(rule.message)
      }

      // Validação por expressão regular
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        fieldErrors.push(rule.message)
      }

      // Validação customizada
      if (rule.custom) {
        const result = rule.custom(value)
        if (result === false) {
          fieldErrors.push(rule.message)
        } else if (typeof result === 'string') {
          fieldErrors.push(result)
        }
      }
    }

    return fieldErrors
  }

  const validate = (formData: any, rules: ValidationRules): boolean => {
    errors.value = {}
    let isValid = true

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const fieldErrors = validateField(fieldName, formData[fieldName], fieldRules)
      
      if (fieldErrors.length > 0) {
        errors.value[fieldName] = fieldErrors
        isValid = false
      }
    }

    return isValid
  }

  const clearError = (fieldName: string) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const hasError = (fieldName: string): boolean => {
    return !!errors.value[fieldName]?.length
  }

  const getError = (fieldName: string): string => {
    return errors.value[fieldName]?.[0] || ''
  }

  const getErrors = (fieldName: string): string[] => {
    return errors.value[fieldName] || []
  }

  return {
    errors: readonly(errors),
    validate,
    validateField,
    clearError,
    clearErrors,
    hasError,
    getError,
    getErrors
  }
}
