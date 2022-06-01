const example = `const scrollBehavior = (to, from, savedPosition) => {
  const { scrollBehavior = {} } = to['meta'] || {};
  const { disable, filter } = scrollBehavior || {};

  if (disable && to.query[filter]) return;

  return to.hash
    ? ({
      selector: to.hash,
      behavior: 'smooth',
    })
    : ({
      x: 0,
      y: 0,
      behavior: 'smooth',
    })
};`;

module.exports = {
  selected: true,
  title: 'scroll behavior',

  value: example,
  type: "code",
  example,
  description: "router.scrollBehavior：滚动行为，默认跳转页面滚动条回到最顶部，并且兼容了锚点处理",
};