<script>
  export let value = "";
  export let query = "";
  let highlightTextSpan = (text, query) => {
    if (!query) return [{ key: 0, match: false, text }];

    let query_result = [];
    let lower_text = text.toLowerCase();
    let lower_query = query.toLowerCase();
    let query_index = lower_text.indexOf(lower_query);

    while (query_index !== -1) {
      query_result.push(query_index);
      query_index = lower_text.indexOf(lower_query, query_index + 1);
    }

    let result = [];
    let last_index = 0;
    for (let i = 0; i < query_result.length; i++) {
      result.push({ key: 2 * i, match: false, text: text.slice(last_index, query_result[i]) });
      last_index = query_result[i] + query.length;
      result.push({ key: 2 * i + 1, match: true, text: text.slice(query_result[i], last_index) });
    }
    result.push({ key: 2 * query_result.length, match: false, text: text.slice(last_index) });
    return result;
  }

  $: chunks = highlightTextSpan(value, query);
</script>

<span>
  {#each chunks as chunk (chunk.key)}
    <span class:highlight={chunk.match}>{chunk.text}</span>
  {/each}
</span>

<style>
  .highlight {
    background-color: rgba(255, 255, 0, 0.5);
    color: black;
  }
</style>
