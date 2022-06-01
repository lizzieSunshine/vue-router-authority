export default {
  selected: false,
  title: 'mode',

  value: "hash",
  type: "radio",
  options: [{
      label: "hash",
      value: "hash",
    },
    {
      label: "history",
      value: "history",
    }
  ],
  description: "router.mode选项，可选值为hash、history。默认为hash模式",
};