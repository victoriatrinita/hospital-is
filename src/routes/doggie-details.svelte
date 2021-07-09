<script context="module">
  export async function preload(page, session) {
    const { token } = session;

    if (!token) {
      return this.redirect(302, "login");
    }

    const response = await this.fetch(`https://www.myapi.com/doggies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
    });

    const parsed = await response.json();

    if (parsed.error) {
      return this.error(response.status, parsed.error);
    }

    return { doggies: parsed.doggies };
  }
</script>

<script>
  export let doggies = [];
</script>

<h1>welcome to the doggie details page</h1>
<ul>
  {#each doggies as doggo}
    <li>{doggo.name} - {doggo.breed}</li>
  {/each}
</ul>
