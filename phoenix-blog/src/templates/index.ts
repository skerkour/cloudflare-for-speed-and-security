import Handlebars from 'handlebars/runtime';
import './precompiled'; // load precompiled templates
// @ts-ignore
Handlebars.partials = Handlebars.templates;
Handlebars.registerHelper('date', (val) => {
  if (!val) {
    return val;
  }
  const date = new Date(val);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
});
export default Handlebars;
