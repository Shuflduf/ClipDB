<script lang="ts">
  import { Client, Storage, ID } from "appwrite";
  import type { Models } from "appwrite";
  import { onMount } from "svelte";
  import { PROJECT_ID } from "../lib/constants";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

  const storage = new Storage(client);

  let files: Models.File[] = [];
  let isUploading = false;

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
    const file = fileInput?.files?.[0] ?? new File([], "empty");

    isUploading = true;

    const promise = storage.createFile("main", ID.unique(), file);

    promise.then(
      function (response) {
        console.log(response);
        storage.listFiles("main").then((result) => {
          files = result.files.reverse();
          isUploading = false;
        });
      },
      function (error) {
        console.log(error);
        isUploading = false;
      },
    );
  }

  function getFileUrl(fileId: string) {
    return `https://cloud.appwrite.io/v1/storage/buckets/main/files/${fileId}/view?project=${PROJECT_ID}`;
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

  <div class="video-grid">
    {#each files as file}
      <div class="border p-4 rounded shadow">
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
