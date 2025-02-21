<script lang="ts">
  import { Client, Storage, ID, Account } from "appwrite";
  import type { Models } from "appwrite";
  import { onMount } from "svelte";
  import { PROJECT_ID } from "../lib/constants";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

  const storage = new Storage(client);

  let files: Models.File[] = [];

  onMount(async () => {
    try {
      const result = await storage.listFiles("main");
      files = result.files;
    } catch (error) {
      console.log(error);
    }
  });

  function submit(event: Event) {
    event.preventDefault();

    const fileInput = document.getElementById("uploader") as HTMLInputElement;
    const file = fileInput?.files?.[0] ?? new File([], "empty");

    const promise = storage.createFile("main", ID.unique(), file);

    promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log(error);
      },
    );
  }

  function getFileUrl(fileId: string) {
    return `https://cloud.appwrite.io/v1/storage/buckets/main/files/${fileId}/view?project=${PROJECT_ID}`;
  }
</script>

<input type="file" id="uploader" />
<input type="submit" value="Upload" onclick={submit} />

<ul>
  {#each files as file}
    <li>
      {#if file.mimeType.startsWith("image/")}
        <img src={getFileUrl(file.$id)} alt={file.name} />
      {:else if file.mimeType.startsWith("video/")}
        <video controls src={getFileUrl(file.$id)} crossorigin="anonymous">
          <track kind="captions" src="" label="English" />
        </video>
      {:else}
        <a href={getFileUrl(file.$id)} target="_blank">{file.name}</a>
      {/if}
    </li>
  {/each}
</ul>
