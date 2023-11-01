import Handlebars from 'handlebars/runtime';
import './precompiled'; // load precompiled templates
import { date } from '../utils';

// @ts-ignore
Handlebars.partials = Handlebars.templates;
Handlebars.registerHelper('date', date);
export default Handlebars;
