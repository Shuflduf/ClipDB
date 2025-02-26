<script lang="ts">
  import Modal from "./Modal.svelte";
  import { createEventDispatcher } from "svelte";

  export let file: File;
  export let username: string;

  const dispatch = createEventDispatcher();
</script>

<Modal onclose={() => dispatch("cancel")}>
  <h3 class="text-lg font-semibold mb-4">Confirm Upload</h3>
  <video
    controls
    src={URL.createObjectURL(file)}
    crossorigin="anonymous"
    class="w-xl"
  >
    <track kind="captions" src="" label="English" />
  </video>

  <p class="text-gray-500 text-sm mt-2">{file.name}</p>
  <div class="flex justify-end space-x-3 mt-3">
    <input
      bind:value={username}
      type="text"
      placeholder="Username"
      class="self-start border-b-2 border-spacing-2 mr-auto h-auto my-auto"
    />
    <button
      class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
      onclick={() => dispatch("cancel")}
    >
      Cancel
    </button>
    <button
      class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      onclick={() => dispatch("confirm")}
    >
      Upload
    </button>
  </div>
</Modal>
