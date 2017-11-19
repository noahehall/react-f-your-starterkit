// best random generator: https://www.mockaroo.com/

function getRxNormDefaultState () {
  return new Map([
    [ 'status',
      {
        error: false,
        loading: false,
      }]
  ]);
}

export default {
  blah: {},
  queries: {},
  router: {},
  rxNorm: getRxNormDefaultState(),
};
