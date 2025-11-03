<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useUserStore } from '~/store/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useFormValidation, type ValidationRules } from '~/composables/useFormValidation'
import { useCPF } from '~/composables/useCPF'

const store = useUserStore()
const { formatCPF, validateCPF } = useCPF()

interface User {
  id?: string
  name: string
  email: string
  password: string
  cpf: string
  birthDate: string
  avatar?: string
}

const props = defineProps<{
  open: boolean
  userToEdit?: User
  onClose?: () => void
}>()

const emit = defineEmits<{
  saved: []
}>()

const confirmPassword = ref('')
const previewUrl = ref('')
const form = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  cpf: '',
  birthDate: '',
  avatar: ''
})

const { validate, clearErrors, hasError, getError, clearError, validateField } = useFormValidation()

// Regras de validação
const validationRules: ValidationRules = {
  name: [
    { required: true, message: 'Nome é obrigatório' },
    { minLength: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
    { maxLength: 100, message: 'Nome deve ter no máximo 100 caracteres' }
  ],
  email: [
    { required: true, message: 'Email é obrigatório' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Email inválido' 
    }
  ],
  password: [
    { required: true, message: 'Senha é obrigatória' },
    { minLength: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
  ],
  confirmPassword: [
    { required: true, message: 'Confirmação de senha é obrigatória' },
    {
      custom: (value) => value === form.value.password,
      message: 'As senhas não conferem'
    }
  ],
  cpf: [
    { required: true, message: 'CPF é obrigatório' },
    { 
      pattern: /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/, 
      message: 'CPF deve estar no formato 000.000.000-00' 
    },
    {
      custom: (value) => validateCPF(value),
      message: 'CPF inválido'
    }
  ],
  birthDate: [
    { required: true, message: 'Data de nascimento é obrigatória' },
    {
      custom: (value) => {
        if (!value) return false
        const birthDate = new Date(value)
        const today = new Date()
        
        // Verifica se a data é válida
        if (isNaN(birthDate.getTime())) return false
        
        // Não pode ser data futura
        if (birthDate > today) return false
        
        // Calcula idade considerando mês e dia
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        return age >= 18 && age <= 120
      },
      message: 'Você deve ter entre 18 e 120 anos'
    }
  ]
}

watch(
  () => props.userToEdit,
  (user) => {
    if (user) {
      Object.assign(form.value, user)
      previewUrl.value = user.avatar?.startsWith('data:')
        ? user.avatar
        : user.avatar
          ? `${useRuntimeConfig().public.apiURL}/uploads/${user.avatar}`
          : ''
    } else {
      resetForm()
    }
    // Limpa erros quando abre o formulário
    clearErrors()
  },
  { immediate: true }
)

// Cleanup de URLs criadas
onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  // Valida tipo de arquivo
  if (!file.type.startsWith('image/')) {
    store.error = 'Por favor, selecione apenas arquivos de imagem'
    return
  }
  
  if (file.size > 2 * 1024 * 1024) {
    store.error = 'A imagem deve ter no máximo 2MB'
    return
  }

  // Limpa URL anterior se existir
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = URL.createObjectURL(file)

  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const maxSize = 400
      let { width, height } = img
      
      if (width > height && width > maxSize) {
        height *= maxSize / width
        width = maxSize
      } else if (height > width && height > maxSize) {
        width *= maxSize / height
        height = maxSize
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      form.value.avatar = canvas.toDataURL('image/jpeg', 0.7)
    }
    img.onerror = () => {
      store.error = 'Erro ao processar a imagem'
    }
    img.src = event.target?.result as string
  }
  reader.onerror = () => {
    store.error = 'Erro ao ler o arquivo'
  }
  reader.readAsDataURL(file)
}

async function submitForm() {
  // Validar todos os campos incluindo confirmPassword
  const formToValidate = { ...form.value, confirmPassword: confirmPassword.value }
  const isValid = validate(formToValidate, validationRules)
  
  if (!isValid) {
    store.error = 'Por favor, corrija os erros no formulário'
    return
  }

  try {
    if (form.value.id) {
      await store.update(form.value.id, form.value)
    } else {
      await store.create(form.value)
    }

    emit('saved')
    props.onClose?.()
    resetForm()
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
    store.error = 'Erro ao salvar usuário. Tente novamente.'
  }
}

function resetForm() {
  // Limpa URL da imagem antes de resetar
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  
  Object.assign(form.value, { id: '', name: '', email: '', password: '', cpf: '', birthDate: '', avatar: '' })
  confirmPassword.value = ''
  previewUrl.value = ''
  clearErrors()
}

// Função para validar campo individual ao sair do campo
function handleFieldBlur(fieldName: string) {
  const rules = validationRules[fieldName]
  if (rules) {
    const value = fieldName === 'confirmPassword' ? confirmPassword.value : form.value[fieldName as keyof typeof form.value]
    const fieldErrors = validateField(fieldName, value, rules)
    
    if (fieldErrors.length === 0) {
      clearError(fieldName)
    }
  }
}

// Função otimizada para formatar CPF
function handleCPFInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.value.cpf = formatCPF(input.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="onClose?.()">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-center text-lg font-bold">
          {{ form.id ? 'Editar Usuário' : 'Cadastrar Usuário' }}
        </DialogTitle>
        <DialogDescription class="text-center text-sm text-gray-600">
          Preencha todos os campos obrigatórios marcados com <span class="text-red-500">*</span>
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col md:flex-row gap-8 py-4">
        <form @submit.prevent="submitForm" class="flex-1 grid md:grid-cols-2 gap-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              Nome <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="form.name" 
              placeholder="Digite o nome completo"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('name') }"
              @blur="handleFieldBlur('name')"
            />
            <p v-if="hasError('name')" class="text-sm text-red-500">
              {{ getError('name') }}
            </p>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              Email <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="form.email" 
              type="email"
              placeholder="exemplo@email.com"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('email') }"
              @blur="handleFieldBlur('email')"
            />
            <p v-if="hasError('email')" class="text-sm text-red-500">
              {{ getError('email') }}
            </p>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              Senha <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="form.password" 
              type="password"
              placeholder="Mínimo 6 caracteres"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('password') }"
              @blur="handleFieldBlur('password')"
            />
            <p v-if="hasError('password')" class="text-sm text-red-500">
              {{ getError('password') }}
            </p>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              Confirmar senha <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="confirmPassword" 
              type="password"
              placeholder="Digite a senha novamente"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('confirmPassword') }"
              @blur="handleFieldBlur('confirmPassword')"
            />
            <p v-if="hasError('confirmPassword')" class="text-sm text-red-500">
              {{ getError('confirmPassword') }}
            </p>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              CPF <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="form.cpf"
              placeholder="000.000.000-00"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('cpf') }"
              @input="handleCPFInput"
              @blur="handleFieldBlur('cpf')"
              maxlength="14"
            />
            <p v-if="hasError('cpf')" class="text-sm text-red-500">
              {{ getError('cpf') }}
            </p>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium">
              Data de Nascimento <span class="text-red-500">*</span>
            </label>
            <Input 
              v-model="form.birthDate" 
              type="date"
              :class="{ 'border-red-500 focus-visible:ring-red-500': hasError('birthDate') }"
              @blur="handleFieldBlur('birthDate')"
            />
            <p v-if="hasError('birthDate')" class="text-sm text-red-500">
              {{ getError('birthDate') }}
            </p>
          </div>
        </form>

        <div class="flex flex-col items-center justify-center border border-gray-300 rounded-md p-4 w-full md:w-64">
          <div class="w-32 h-32 border border-dashed border-gray-400 relative flex items-center justify-center rounded-md mb-2 overflow-hidden">
            <Input
              type="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @change="onFileChange"
            />
            <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
            <span v-else class="text-3xl text-green-500">+</span>
          </div>
          <p class="text-sm text-center text-gray-600">Escolha a imagem</p>
          <p class="text-xs text-center text-gray-500 mt-1">(Opcional - Max: 2MB)</p>
        </div>
      </div>

      <DialogFooter class="flex justify-center mt-4">
        <Button variant="outline" @click="onClose?.()">Cancelar</Button>
        <Button :disabled="store.loading" @click="submitForm">
          {{ store.loading ? 'Salvando...' : (form.id ? 'Salvar Alterações' : 'Cadastrar') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
