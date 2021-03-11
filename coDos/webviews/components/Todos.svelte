<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  export let user: User;
  export let accessToken: string;
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo":
          todos = [{ text: message.value, completed: false }, ...todos];
          break;
      }
    });

    const response = await fetch(`${apiBaseUrl}/todo`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const payload = await response.json();

    await payload.forEach((element: any) => {
      todos.push({ text: element.text, completed: element.completed });
    });
    console.log(todos);
  });
</script>

<h3>{user.name}</h3>
<!-- svelte-ignore missing-declaration  -->
<form
  on:submit|preventDefault={async (e) => {
    // todos = [{ text, completed: false }, ...todos];
    const response = await fetch(`${apiBaseUrl}/todo`, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    text = "";
    const { todo } = await response.json();
    todos = [todo, ...todos];
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
