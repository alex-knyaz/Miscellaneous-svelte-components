Miscellaneous svelte components
===

This is collection of miscellaneous svelte components I often use in my projects.

How to use
---

I recommend to just copy code file of component you are going to use in your project.
Because you often need to modify it to suite your needs or style.

[DEMO](https://alex-knyaz.github.io/Miscellaneous-svelte-components/)
---

[RadioButtonGroup](src/RadioButtonGroup.svelte)
---

<img width="347" alt="Screenshot 2022-02-23 at 02 51 30" src="https://user-images.githubusercontent.com/52626785/155239391-d72a8006-6a64-40a3-a0ca-c6ac2a9ef560.png">

```svelte
<script>
  import RadioButtonGroup from "../../src/RadioButtonGroup.svelte";
  let value = 10;
</script>

<RadioButtonGroup
      items={[1, 5, 10, 25, 50, 100].map((i) => ({ l: `${i}x`, v: i }))}
      bind:value
    />
<br />
value: {value}
```

[PanAndZoom](src/PanAndZoom.svelte)
---

![gif](https://user-images.githubusercontent.com/52626785/155239892-1399427e-c204-4bfa-8682-dccafc3cb069.gif)

```svelte
<script>
  import PanAndZoom from "../../src/PanAndZoom.svelte";
</script>
<PanAndZoom>
    <img src="https://placekitten.com/g/200/300" alt="demo" />
</PanAndZoom>
```

[InteractiveLabel](src/InteractiveLabel.svelte)
---

![gif](https://user-images.githubusercontent.com/52626785/155240661-d8176a4d-9397-4942-9ac8-ed4c5246e937.gif)

```svelte
<script>
  import InteractiveLabel from "../../src/InteractiveLabel.svelte";
  let value = 10;
</script>
<InteractiveLabel bind:value />
<br />
value: {value}
```

[Tooltip](src/Tooltip.svelte)
---

![gif](https://user-images.githubusercontent.com/52626785/155241471-59a95aed-2e1a-4f85-9dd3-b7da49eb7041.gif)

```svelte
<script>
  import Tooltip from "../../src/Tooltip.svelte";
</script>
<Tooltip tooltip="test">
      <div>hover pointer here</div>
</Tooltip>
```
