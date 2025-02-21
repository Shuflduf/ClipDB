<script lang="ts">
  import { Client, Storage, ID, Account } from "appwrite";
  import { onMount } from "svelte";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67b777e00031574783b9");

  const storage = new Storage(client);

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
</script>

<input type="file" id="uploader" />
<input type="submit" value="Upload" onclick={submit} />
<img
  alt="shuflduf gaming"
  src="https://cloud.appwrite.io/v1/storage/buckets/main/files/67b82aee000cc5c01a48/view?project=67b777e00031574783b9"
/>
<video
  controls
  src="https://cloud.appwrite.io/v1/storage/buckets/main/files/67b82cc7003584a62ce9/view?project=67b777e00031574783b9"
  crossorigin="anonymous"
>
  <track kind="captions" src="" label="English" />
</video>
