<script lang="ts">
  import { Client, Storage, ID, Databases } from "appwrite";
  import type { Models } from "appwrite";
  import { onMount } from "svelte";
  import { PROJECT_ID } from "../lib/constants";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

  const storage = new Storage(client);
  const databases = new Databases(client);

  let files: Models.File[] = [];
  let isUploading = false;
  let showConfirmDialog = false;
  let selectedFile: File | null = null;
  let username: String = "";

  onMount(async () => {
    try {
      const result = await storage.listFiles("main");
      files = result.files.reverse();
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

  function handleConfirmUpload() {
    if (!selectedFile) return;

    isUploading = true;
    showConfirmDialog = false;

    const promise = storage.createFile("main", ID.unique(), selectedFile);

    promise.then(
      function (response) {
        console.log(response);
        addMetadata(response);
        storage.listFiles("main").then((result) => {
          files = result.files.reverse();
          isUploading = false;
          selectedFile = null;
        });
      },
      function (error) {
        console.log(error);
        isUploading = false;
        selectedFile = null;
      },
    );
  }

  function handleCancelUpload() {
    showConfirmDialog = false;
    selectedFile = null;
    const fileInput = document.getElementById("uploader") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  function getFileUrl(fileId: string) {
    return `https://cloud.appwrite.io/v1/storage/buckets/main/files/${fileId}/view?project=${PROJECT_ID}`;
  }

  async function addMetadata(response: Models.File) {
    const promise: Models.Document = await databases.createDocument(
      "main",
      "metadata",
      response.$id,
      {
        creator: username.trim().length > 0 ? username.trim() : "Anonymous",
      },
    );
    console.log(promise);
  }
</script>

<div class="container mx-auto p-4">
  <div class="mb-4 flex items-center space-x-4">
    <input
      type="file"
      id="uploader"
      accept=".mp4, .m4v"
      class="cursor-pointer block w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      onchange={handleFileChange}
      disabled={isUploading}
    />
    {#if isUploading}
      <p class="text-blue-500">Uploading file, please wait...</p>
    {/if}
  </div>

  {#if showConfirmDialog}
    <div class="fixed inset-0 bg-[#00000080] flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold mb-4">Confirm Upload</h3>
        <video
          controls
          src={selectedFile ? URL.createObjectURL(selectedFile) : ""}
          crossorigin="anonymous"
          class="w-xl"
        >
          <track kind="captions" src="" label="English" />
        </video>

        <p class="text-gray-500 text-sm mt-2">
          {selectedFile?.name}
        </p>
        <div class="flex justify-end space-x-3 mt-3">
          <input
            bind:value={username}
            type="text"
            placeholder="Username"
            class="self-start border-b-2 border-spacing-2 mr-auto h-auto my-auto"
          />
          <button
            class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onclick={handleCancelUpload}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
            onclick={handleConfirmUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="video-grid">
    {#each files as file}
      <div class="border p-4 rounded shadow-md">
        {#if file.mimeType.startsWith("image/")}
          <img
            src={getFileUrl(file.$id)}
            alt={file.name}
            class="max-w-full h-auto"
          />
        {:else if file.mimeType.startsWith("video/")}
          <video
            controls
            src={getFileUrl(file.$id)}
            crossorigin="anonymous"
            class="w-full h-auto"
          >
            <track kind="captions" src="" label="English" />
          </video>
        {:else}
          <a
            href={getFileUrl(file.$id)}
            target="_blank"
            class="text-blue-500 hover:underline">{file.name}</a
          >
        {/if}
        <p class="text-gray-500 text-sm mt-2">{file.name}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
