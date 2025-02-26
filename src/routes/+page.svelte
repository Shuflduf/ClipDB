<script lang="ts">
  import type { Models } from "appwrite";
  import { onMount } from "svelte";
  import { appwriteService } from "$lib/services/appwrite";
  import UploadModal from "$lib/components/UploadModal.svelte";
  import ViewModal from "$lib/components/ViewModal.svelte";

  let files: Models.File[] = [];
  let isUploading = false;
  let showConfirmDialog = false;
  let selectedFile: File | null = null;
  let username: string = "";
  let showViewDialog = false;
  let selectedVideoFile: Models.File | null = null;
  let selectedVideoMetadata: Models.Document | null = null;

  onMount(async () => {
    try {
      files = (await appwriteService.listFiles()).reverse();
    } catch (error) {
      console.log(error);
    }
  });

  function handleFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    selectedFile = fileInput?.files?.[0] ?? null;
    if (selectedFile) {
      showConfirmDialog = true;
    }
  }

  async function handleConfirmUpload() {
    if (!selectedFile) return;

    isUploading = true;
    showConfirmDialog = false;

    try {
      const response = await appwriteService.uploadFile(selectedFile);
      await appwriteService.addMetadata(response.$id, username);
      files = (await appwriteService.listFiles()).reverse();
    } catch (error) {
      console.log(error);
    } finally {
      isUploading = false;
      selectedFile = null;
    }
  }

  function handleCancelUpload() {
    showConfirmDialog = false;
    selectedFile = null;
    const fileInput = document.getElementById("uploader") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  async function handleVideoClick(file: Models.File) {
    selectedVideoFile = file;
    showViewDialog = true;
    try {
      selectedVideoMetadata = await appwriteService.getMetadata(file.$id);
    } catch (error) {
      console.log(error);
      selectedVideoMetadata = null;
    }
  }

  function handleCloseView() {
    showViewDialog = false;
    selectedVideoFile = null;
    selectedVideoMetadata = null;
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      if (showConfirmDialog) handleCancelUpload();
      if (showViewDialog) handleCloseView();
    }
  }

  onMount(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirmDialog) handleCancelUpload();
        if (showViewDialog) handleCloseView();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  });
</script>

<div class="container mx-auto p-4">
  <div class="mb-4 flex items-center space-x-4">
    <input
      type="file"
      id="uploader"
      accept=".mp4, .m4v"
      class="cursor-pointer block w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      on:change={handleFileChange}
      disabled={isUploading}
    />
    {#if isUploading}
      <p class="text-blue-500">Uploading file, please wait...</p>
    {/if}
  </div>

  {#if showConfirmDialog && selectedFile}
    <UploadModal
      file={selectedFile}
      bind:username
      on:cancel={handleCancelUpload}
      on:confirm={handleConfirmUpload}
    />
  {/if}

  <div class="video-grid">
    {#each files as file}
      <div
        class="border p-4 rounded shadow-md hover:shadow-lg transition cursor-pointer"
        on:click={() => handleVideoClick(file)}
        on:keydown={(e) => e.key === "Enter" && handleVideoClick(file)}
        role="button"
        tabindex="0"
      >
        <video
          controls
          src={appwriteService.getFileUrl(file.$id)}
          crossorigin="anonymous"
          class="w-full h-auto"
        >
          <track kind="captions" src="" label="English" />
        </video>
        <p class="text-gray-500 text-sm mt-2">{file.name}</p>
      </div>
    {/each}
  </div>

  {#if showViewDialog && selectedVideoFile}
    <ViewModal
      file={selectedVideoFile}
      metadata={selectedVideoMetadata}
      getFileUrl={appwriteService.getFileUrl}
      on:close={handleCloseView}
    />
  {/if}
</div>

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
