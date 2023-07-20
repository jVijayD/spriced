const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

const sharedTailwindConfig = require('../../libs/themes/tailwind.config');

const spricedData = '../spriced-data/src/**/!(*.stories|*.spec).{ts,html}';
const spricedDataDefinition =
  '../spriced-data-definition/src/**/!(*.stories|*.spec).{ts,html}';
const spricedReports =
  '../spriced-reports/src/**/!(*.stories|*.spec).{ts,html}';
const spricedUserManagement =
  '../spriced-user-management/src/**/!(*.stories|*.spec).{ts,html}';
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    spricedData,
    spricedDataDefinition,
    spricedReports,
    spricedUserManagement,
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/container-queries')],
};
