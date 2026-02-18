import Conf from 'conf';

const config = new Conf({
  projectName: 'pideploy-cli',
  schema: {
    token: { type: 'string', default: '' },
    email: { type: 'string', default: '' },
    apiUrl: { type: 'string', default: 'http://localhost:3000' },
  },
});

export default config;
