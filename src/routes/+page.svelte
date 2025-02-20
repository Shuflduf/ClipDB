<script lang="ts">
  import { Client, Storage, ID, Account } from "appwrite";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67b777e00031574783b9");

  const account = new Account(client);
  const result = account.createEmailPasswordSession(
    "shuflduf@gmail.com",
    "password",
  );

  const storage = new Storage(client);

  function submit(event: Event) {
    event.preventDefault();
    const fileInput = document.getElementById("uploader") as HTMLInputElement;
    const file = fileInput?.files?.[0] ?? new File([], "empty");

    const promise = storage.createFile("main", ID.unique(), file);

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
      },
    );
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
<input type="file" id="uploader" />
<input type="submit" value="Upload" onclick={submit} />
