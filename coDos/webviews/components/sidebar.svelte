<script lang="ts">
  import { onMount } from "svelte";

  import HelloWorld from "./HelloWorld.svelte";

  let todos: Array<{ text: string; completed: boolean }> = [];
  let count = 0;
  let text = "";

  onMount(() => {
    window.addEventListener("message", (event) => {
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

<h1>Sidebar</h1>
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

<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    myvscode.postMessage({
      type: "onInfo",
      value: "info message",
    });
  }}
>
  click me
</button>

<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    myvscode.postMessage({
      type: "onError",
      value: "Error message",
    });
  }}
>
  click me error
</button>

<style>
  h1 {
    color: blue;
  }
  .completed {
    text-decoration: line-through;
  }
</style>
