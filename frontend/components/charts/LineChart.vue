<template>
  <div class="h-64 w-full flex items-center justify-center">
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else class="text-sm text-gray-500">Carregando gráfico...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useUserStore } from '~/store/users'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useUserStore()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      ticks: { color: '#6b7280', font: { size: 12 } },
      grid: { color: 'rgba(107,114,128,0.1)' }
    },
    y: {
      ticks: { color: '#6b7280', font: { size: 12 } },
      grid: { color: 'rgba(107,114,128,0.1)' }
    }
  }
}

// Computed — reage automaticamente ao store.list
const chartData = computed(() => {
  if (!store.list.length) return null

  const grouped = store.list.reduce((acc, user) => {
    if (!user.createdAt) return acc
    const date = new Date(user.createdAt).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sortedDates = Object.keys(grouped).sort()

  return {
    labels: sortedDates.map(d => new Date(d).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Novos Usuários',
        data: sortedDates.map(d => grouped[d]),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.15)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
})
</script>

<style scoped>
canvas {
  max-height: 300px;
}
</style>
