<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  export let user: User;
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      console.log({ message });
      switch (message.type) {
        case "new-todo":
          todos = [{ text: message.value, completed: false }, ...todos];
          break;
      }
    });
  });
</script>

<h3>{user.name}</h3>
<form
  on:submit|preventDefault={(e) => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.text)}
    <li
      on:click={() => {
        todo.completed = !todo.completed;
      }}
      class={todo.completed ? "completed" : ""}
    >
      {todo.text}
    </li>
  {/each}
</ul>

<style>
  .completed {
    text-decoration: line-through;
  }
</style>
