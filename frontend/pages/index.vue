<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total de Usuários</CardTitle>
          <Users class="w-5 h-5 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ store.loading ? '...' : store.list.length }}
          </div>
          <p class="text-xs text-muted-foreground">Total cadastrado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Novos Usuários</CardTitle>
          <UserPlus class="w-5 h-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ store.loading ? '...' : store.total }}
          </div>
          <p class="text-xs text-muted-foreground">Cadastrados recentemente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Média de Idade</CardTitle>
          <BarChart2 class="w-5 h-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ store.loading ? '...' : `${store.averageAge} anos` }}
          </div>
          <p class="text-xs text-muted-foreground">Média geral dos usuários</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Estatísticas dos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent class="pl-2">
          <LineChart />
        </CardContent>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-green-500"></div>
              <div class="flex-1 text-sm">Novo usuário cadastrado</div>
              <span class="text-xs text-muted-foreground">Há 2 min</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <div class="flex-1 text-sm">Atualização concluída</div>
              <span class="text-xs text-muted-foreground">Há 15 min</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div class="flex-1 text-sm">Backup agendado</div>
              <span class="text-xs text-muted-foreground">Há 1 hora</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, BarChart2 } from 'lucide-vue-next'
import LineChart from '~/components/charts/LineChart.vue'

definePageMeta({ layout: 'default' })

const store = useUserStore()

</script>
