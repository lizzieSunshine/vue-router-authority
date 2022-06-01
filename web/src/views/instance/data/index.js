import mode from './mode';
import base from './base';
import failuresRepeat from './failuresRepeat';
import scroll from './scroll';
import formatComponent from './formatComponent';
import beforeEach from './beforeEach';

export const getDefaultOptions = () => ({
  mode,
});

export const getDefaultQueue = () => {
  return [
    { key: 'mode', ...mode },
    { key: 'base', ...base },
    { key: 'failuresRepeat', ...failuresRepeat },
    { key: 'scroll', ...scroll },
    { key: 'formatComponent', ...formatComponent },
    { key: 'beforeEach', ...beforeEach },
  ];
};

// export default {
//   getDefaultOptions,
//   getDefaultQueue
// };