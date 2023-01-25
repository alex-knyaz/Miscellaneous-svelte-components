<script>
  export let value = "";
  export let disabled = false;
  export let no_border = false;
</script>

<div class="container" style={no_border ? "border: none;" : ""}>
  <pre aria-hidden="true">{value + "\n"}</pre>
  <textarea bind:value {disabled} on:change />
</div>

<style>
  .container {
    position: relative;
    border: solid 1px;
  }

  pre,
  textarea {
    font-size: 1em;
    line-height: 1;

    overflow: hidden;
    box-sizing: border-box;

    min-height: auto;
    padding: 0.5em;
  }

  textarea {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    resize: none;
    outline: none !important;
    border: none !important;
  }
</style>
