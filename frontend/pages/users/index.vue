<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/store/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import userTable from '~/components/user/UserTable.vue'
import UserForm from '~/components/user/UserForm.vue'

definePageMeta({ layout: 'default' })

const store = useUserStore()
await useAsyncData('users', () => store.fetch())

const openDialog = ref(false)
const userToEdit = ref(undefined)

function handleNew() {
  userToEdit.value = undefined
  openDialog.value = true
}

function handleEdit(user: any) {
  userToEdit.value = { ...user }
  openDialog.value = true
}

function handleSaved() {
  store.fetch(true)
  store.fetchNewUsers(true)
  store.fetchAverageAge(true)
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Usuários</h2>
        <p class="text-muted-foreground">Gerencie os usuários do sistema</p>
      </div>
      <Button @click="handleNew">➕ Novo Usuário</Button>
    </header>

    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuários</CardTitle>
        <CardDescription>Todos os usuários cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <userTable @edit="handleEdit" />
      </CardContent>
    </Card>

    <UserForm
      :open="openDialog"
      :user-to-edit="userToEdit"
      @saved="handleSaved"
      :onClose="() => (openDialog = false)"
    />
  </div>
</template>
