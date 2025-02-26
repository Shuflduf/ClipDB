<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  onMount(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch("close");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  });

  function handleClose() {
    dispatch("close");
  }
</script>

<div
  class="fixed inset-0 bg-[#00000080] flex items-center justify-center"
  transition:fade
  role="dialog"
  aria-modal="true"
>
  <div class="fixed inset-0" role="presentation">
    <button
      class="w-full h-full bg-transparent"
      onclick={handleClose}
      onkeydown={(e) => e.key === "Enter" && handleClose()}
    >
      <span class="sr-only">Close modal</span>
    </button>
  </div>

  <div
    class="bg-white p-6 rounded-lg shadow-xl relative z-10"
    transition:fly={{ y: 20, duration: 300 }}
  >
    <slot />
  </div>
</div>
