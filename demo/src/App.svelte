<script>
  import RadioButtonGroup from "../../src/RadioButtonGroup.svelte";
  let value = 10;

  import PanAndZoom from "../../src/PanAndZoom.svelte";

  import InteractiveLabel from "../../src/InteractiveLabel.svelte";
  let value_2 = 10;

  import Tooltip from "../../src/Tooltip.svelte";
</script>

<main>
  <h2>RadioButtonGroup</h2>
  <section>
    <RadioButtonGroup
      items={[1, 5, 10, 25, 50, 100].map((i) => ({ l: `${i}x`, v: i }))}
      bind:value
    />
    <br />
    value: {value}
  </section>

  <h2>PanAndZoom</h2>
  <section style="padding: 0px;">
    <PanAndZoom>
      <img src="https://placekitten.com/g/200/300" alt="demo" />
    </PanAndZoom>
  </section>

  <h2>InteractiveLabel</h2>
  <section>
    <InteractiveLabel bind:value={value_2} />
    <br />
    value: {value_2}
  </section>

  <h2>Tooltip</h2>
  <section>
    <Tooltip tooltip="test">
      <div>hover pointer here</div>
    </Tooltip>
  </section>
</main>

<style>
  section {
    border: solid 1px;
    padding: 30px;
  }
</style>
