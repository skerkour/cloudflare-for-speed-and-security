import Handlebars from 'handlebars/runtime';
import './precompiled'; // load precompiled templates
// @ts-ignore
Handlebars.partials = Handlebars.templates;
export default Handlebars;
