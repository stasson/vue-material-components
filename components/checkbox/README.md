
## Usage

```html
<mdc-checkbox  :label="label" v-model="checked"/>
```

```javascript
var vm = new Vue({
  data: {
    label: 'This is a checkbox',
    checked: true
  }
})
```

### Indeterminate checkbox
```html
<mdc-checkbox  :label="label" v-model="checked"
    :indeterminate.sync="indeterminate" />
```

```javascript
var vm = new Vue({
  data: {
    label: 'This is a checkbox',
    checked: false,
    indeterminate: true
  }
})
```

### Custom label markup

```html
<mdc-checkbox v-model="agreed">
  <span>I agree with </span>
  <a @click.stop href="...">Terms of Serivce</a>
</mdc-checkbox>
```

> use `@click.stop` to prevent triggering checkbox ripple

### props

| props | Type | Default | Description |
|-------|------|---------|-------------|
|`checked`|Boolean|| whether the checkbox is checked, bind with `v-model` |
|`indeterminate`|Boolean|| whether the checkbox is in an indeterminate state bind with `.sync` modifier | |
|`disabled`| Boolean|| whether the checkbox is disabled |
|`label`| String|| checkbox label |
|`align-end`| Boolean|| whether to align the checkbox after the label |
|`value`|String| `'on'`| checkbox value |
|`name`|String|| input name |


### events

| event | args | Description |
|-------|------|-------------|
|`@focus`| - |emitted on focus gained |
|`@blur`| - |emitted on focus lost |

### Reference
- <https://material.io/components/web/catalog/input-controls/checkboxes>
