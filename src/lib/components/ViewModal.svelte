<script lang="ts">
  import type { Models } from "appwrite";
  import Modal from "./Modal.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let file: Models.File;
  export let metadata: Models.Document | null;
  export let getFileUrl: (fileId: string) => string;
</script>

<Modal onclose>
  <div class="max-w-2xl w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">{file.name}</h3>
      <button
        class="text-gray-500 hover:text-gray-700 cursor-pointer"
        onclick={() => dispatch("close")}
      >
        ✕
      </button>
    </div>
    <video
      controls
      src={getFileUrl(file.$id)}
      crossorigin="anonymous"
      class="w-full"
    >
      <track kind="captions" src="" label="English" />
    </video>
    <div class="mt-4">
      <p class="text-gray-700">
        <span class="font-semibold">Uploaded by:</span>
        {metadata?.creator || "Unknown"}
      </p>
    </div>
  </div>
</Modal>
