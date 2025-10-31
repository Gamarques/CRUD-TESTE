<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/store/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const store = useUserStore()

const props = defineProps({
  open: Boolean,
  userToEdit: Object,
  onClose: Function
})

const emit = defineEmits(['saved'])

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
  },
  { immediate: true }
)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    store.error = 'A imagem deve ter no máximo 2MB.'
    return
  }

  previewUrl.value = URL.createObjectURL(file)

  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const maxSize = 400
      let { width, height } = img
      if (width > height && width > maxSize) height *= maxSize / width, width = maxSize
      else if (height > width && height > maxSize) width *= maxSize / height, height = maxSize

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      form.value.avatar = canvas.toDataURL('image/jpeg', 0.7)
    }
    img.src = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function submitForm() {
  if (form.value.password !== confirmPassword.value) {
    store.error = 'As senhas não conferem'
    return
  }

  if (form.value.id) {
    await store.update(form.value.id, form.value)
  } else {
    await store.create(form.value)
  }

  emit('saved')
  props.onClose?.()
  resetForm()
}

function resetForm() {
  Object.assign(form.value, { id: '', name: '', email: '', password: '', cpf: '', birthDate: '', avatar: '' })
  confirmPassword.value = ''
  previewUrl.value = ''
}
</script>

<template>
  <Dialog :open="open" @update:open="onClose?.()">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle class="text-center text-lg font-bold">
          {{ form.id ? 'Editar Usuário' : 'Cadastrar Usuário' }}
        </DialogTitle>
      </DialogHeader>

      <div class="flex flex-col md:flex-row gap-8 py-4">
        <form @submit.prevent="submitForm" class="flex-1 grid md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="text-sm font-medium">Nome</label>
            <Input v-model="form.name" placeholder="Digite o nome" required />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">Email</label>
            <Input v-model="form.email" type="email" required />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">Senha</label>
            <Input v-model="form.password" type="password" required />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">Confirmar senha</label>
            <Input v-model="confirmPassword" type="password" required />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">CPF</label>
            <Input v-model="form.cpf" required />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">Data de Nascimento</label>
            <Input v-model="form.birthDate" type="date" required />
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
