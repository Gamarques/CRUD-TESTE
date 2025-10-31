<script setup lang="ts">
import { useUserStore } from '~/store/users'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const store = useUserStore()
const { public: { apiURL } } = useRuntimeConfig()

const emit = defineEmits(['edit'])

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function getAvatarUrl(avatar: string) {
  if (!avatar) return ''
  if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar
  return `${apiURL}/uploads/${avatar}`
}
</script>

<template>
  <Table v-if="!store.loading && store.list.length">
    <TableHeader>
      <TableRow>
        <TableHead>Usuário</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>CPF</TableHead>
        <TableHead>Cadastro</TableHead>
        <TableHead class="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <TableRow v-for="user in store.list" :key="user.id">
        <TableCell class="font-medium">
          <div class="flex items-center gap-3">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="getAvatarUrl(user.avatar)" />
              <AvatarFallback>{{ user.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            {{ user.name }}
          </div>
        </TableCell>
        <TableCell>{{ user.email }}</TableCell>
        <TableCell>{{ user.cpf }}</TableCell>
        <TableCell>{{ formatDate(user.createdAt) }}</TableCell>
        <TableCell class="text-right space-x-2">
          <Button variant="ghost" size="sm" @click="emit('edit', user)">Editar</Button>
          <Button
            variant="ghost"
            size="sm"
            class="text-red-600"
            @click="store.remove(user.id)"
          >
            Excluir
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <p v-else-if="!store.loading" class="text-gray-500 text-center py-6">
    Nenhum usuário encontrado.
  </p>
</template>
