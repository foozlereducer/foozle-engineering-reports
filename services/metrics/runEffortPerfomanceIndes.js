import { KpiEffortPerformanceIndex } from './kpi-effortPerformanceIndex.js';
import { JiraRest } from '../adapters/jiraRest.js';
import { ActoValidator } from '../validators/ActoValidator.js';

const validator = new ActoValidator()
const jr = new JiraRest(validator);
const kepi = new KpiEffortPerformanceIndex(jr)

const res = await kepi.getData('/rest/agile/1.0/board')