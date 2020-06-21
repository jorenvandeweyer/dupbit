<template>
  <div class="w-full md:w-3/4 lg:w-2/3 pt-20 mx-auto">
    <h1 class="text-4xl">Apps</h1>
    <div class="flex flex-row flex-wrap p-8">
      <div class="w-full md:w-1/2 lg:w-1/3 p-4">
        <div class="p-4 border border-white rounded">
          <h2 class="text-2xl">Connect</h2>
          <div class="h-20">Interact with your connected devices through the web browser</div>
          <div>
            <router-link class="inline-block bg-white rounded text-black py-1 px-2 mt-4 hover:bg-gray-400" to="/portal/connect">Open</router-link>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 p-4">
        <div class="p-4 border border-white rounded">
          <h2 class="text-2xl">Connect API</h2>
          <div class="h-20">Interact with your connected devices through the web browser</div>
          <div>
            <router-link class="inline-block bg-white rounded text-black py-1 px-2 mt-4 hover:bg-gray-400" to="/portal/connect-api">Open</router-link>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 p-4">
        <div class="p-4 border border-white rounded">
          <h2 class="text-2xl">Dupbot</h2>
          <div class="h-20">A discord bot for discord</div>
          <button class="bg-white rounded text-black py-1 px-2 mt-4 hover:bg-gray-400">Open</button>
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 p-4">
        <div class="p-4 border border-white rounded">
          <h2 class="text-2xl">Snitch</h2>
          <div class="h-20">A discord bot that snitches</div>
          <button class="bg-white rounded text-black py-1 px-2 mt-4 hover:bg-gray-400">Open</button>
        </div>
      </div>
    </div>
  </div>
</template>
