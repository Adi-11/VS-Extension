<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  export let user: User;
  export let accessToken: string;
  let todos: Array<{ text: string; completed: boolean; _id: string }> = [];
  let text = "";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo":
          const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "POST",
            body: JSON.stringify({
              text: message.value,
            }),
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          });
          const { todo } = await response.json();
          todos = [todo, ...todos];
          break;
      }
    });

    const response = await fetch(`${apiBaseUrl}/todo`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const payload = await response.json();
    console.log(payload.todos);
    todos = payload.todos;
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
    const { todo } = await response.json();
    todos = [todo, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>
<!-- svelte-ignore missing-declaration -->
<ul>
  {#each todos as todo (todo._id)}
    <li
      on:click={async () => {
        todo.completed = !todo.completed;
        const response = await fetch(`${apiBaseUrl}/todo`, {
          method: "PUT",
          body: JSON.stringify({
            id: todo._id,
          }),
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(await response.json());
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
