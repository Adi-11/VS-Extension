<script lang="ts">
  import { onMount } from "svelte";
  import { bubble } from "svelte/internal";
  import type { User } from "../types";
  import Todos from "./Todos.svelte";

  let loading = true;
  let user: User | null = null;
  let accessToken: any = "";
  let page: "todos" | "contact" = myvscode.getState()?.page || "todos";

  /**
   * this code block is executed every single time whenever the variables used inside this is changed
   * kind of dependency array in @useEffect hooks(REACT)
   */
  $: {
    myvscode.setState({ page });
  }

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "get-token":
          accessToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          console.log(data);
          user = data.user;
          loading = false;
      }
    });

    myvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

<h4>coDos</h4>

{#if loading}
  <div>loading....</div>
{:else if user}
  {#if page === "todos"}
    <Todos {user} {accessToken} />
    <button
      on:click={() => {
        page = "contact";
      }}>To to contact</button
    >
  {:else}
    <div>Contact Author</div>
    <button
      on:click={() => {
        page = "todos";
      }}>go back</button
    >
  {/if}
  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      user = null;
      accessToken = "";
      myvscode.postMessage({ type: "logout", value: undefined });
    }}>logout</button
  >
{:else}
  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      myvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Login with github</button
  >
{/if}

<style>
  h4 {
    color: rgba(250, 250, 250, 0.726);
  }
</style>
