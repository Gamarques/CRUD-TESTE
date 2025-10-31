<template>
  <div class="flex items-center justify-center h-48">
    <svg
      class="animate-spin h-6 w-6 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
    <span class="ml-3 text-gray-600">Carregando...</span>
  </div>
</template>
