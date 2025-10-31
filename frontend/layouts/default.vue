<template>
  <SidebarProvider>
    <div class="flex h-screen w-full overflow-hidden">
      <!-- Sidebar -->
      <Sidebar collapsible="icon">
        <!-- Header da Sidebar -->
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" as-child>
                <div class="flex items-center gap-2">
                  <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Fan />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">CRUD</span>
                    <span class="truncate text-xs text-muted-foreground">Enterprise</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <!-- Itens Sidebar -->
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Home</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                    <NuxtLink
                        v-for="item in menuItems"
                        :key="item.title"
                        :to="item.url"
                        class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        <component :is="item.icon" class="w-5 h-5" />
                        <span>{{ item.title }}</span>
                    </NuxtLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator>
            <SidebarGroup>
                <SidebarGroupLabel>Users</SidebarGroupLabel>
            </SidebarGroup>
          </SidebarSeparator>
        </SidebarContent>


        <!-- Footer da Sidebar -->
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" as-child>
                <NuxtLink to="/" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
                 <Settings class="w-5 h-5" /> Configurações
                </NuxtLink>
                <div class="flex items-center gap-2 cursor-pointer">
                  <Avatar class="h-8 w-8">
                    <AvatarImage 
                      src="https://avatars.githubusercontent.com/u/75293856?s=96&v=4" 
                      alt="User" 
                    />
                    <AvatarFallback>GA</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">Gabriel Marques</span>
                    <span class="truncate text-xs text-muted-foreground">gabrielgamarques1@gmail.com</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <!-- Main Content -->
      <div class="flex flex-1 flex-col">
        <!-- Topbar -->
        <header class="h-16 flex items-center justify-between border-b bg-white px-6 shadow-sm">
          <div class="flex items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" class="h-6" />
            <h1 class="text-xl font-semibold text-gray-800">Painel de Controle</h1>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
          <slot />
        </main>
      </div>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { 
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Home, Users, Settings, ChartNoAxesCombined, CircleGauge, Fan } from 'lucide-vue-next'
import { useUserStore } from '~/store/users'

const store = useUserStore()

// Menu items
const menuItems = [
  {
    title: 'Dashboard',
    icon: CircleGauge,
    url: '/',
  },
  {
    title: 'Usuários',
    icon: Users,
    url: '/users',
  },
  // {
  //   title: 'Analise',
  //   icon: ChartNoAxesCombined,
  //   url: '/analytics'
  // },
]

</script>