import {
  SET_ALL_PROJECTS,
  SET_ALL_PROJECT_DISCUSSION,
  SET_ALL_PROJECT_DISCUSSION_COMMENTS,
  SET_SELECTED_MEMBERS,
  SET_ALL_PROJECT_COUNT,
  SET_PROJECT_OVERVIEW,
  SET_SINGLE_PROJECT_DATA,
  SET_GANTT_DATA,
  SET_ALL_FILES,
  SET_SCHEDULE_INDICATOR,
  SET_TASK_STATUS_BREAKDOWN,
  SET_BURNDOWN_CHART_DATA,
  SET_TASK_PROGRESS_CHART,
  SET_SCHEDULE_INDICATOR_TASK_COMPLETION,
  SET_AVG_COST_OF_EMP,
  SET_TOTAL_COST_OF_EMP,
  SET_ESTIMATED_COST_VS_ACTUAL_COST_CHART_DATA,
  SET_PLANNED_HOURS_VS_ACTUAL_HOURS_CHART_DATA,
  SET_HEALTH_STATUS_OF_MODULES,
  SET_HEALTH_STATUS_OF_SPRINTS,
  SET_TASK_STATUS_GROUPING,
  SET_PROJECT_SCRUMS,
  SET_ALL_PIN_PROJECTS,
  SET_PROJECT_ACTIVITY,
  SET_PROJECT_EXPENSE_OVERVIEW,
  SET_ALL_NOTES_OF_SINGLE_SCRUM,
  SET_UPCOMING_SCRUM,
  SET_ALL_PROJECT_TASK,
  SET_PROJECT_ALL_DOCS,
  SET_SIGNLE_SCRUM_DATA,
  SET_SINGLE_DOC_DATA,
  SET_PROJECT_CARD_COUNT_DATA,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  allProjects: {},
  allProjectDiscussions: {},
  allProjectDiscussionComments: {},
  selectedMembersForProject: [],
  allProjectCount: "",
  projectOverview: [],
  singleProjectData: [],
  ganttChartData: [],
  allTasks: [],

  allFiles: [],
  allScrums: [],
  singleScrumData: {},
  allNotesByScrum: [],
  projectScheduleIndicator: [],
  taskStatusBreakdown: [],
  burndownChartData: [],
  taskProgressChartData: [],
  indicatorTaskCompletionByWeek: [],
  avgCostOfEmployee: "",
  totalCostOfEmployee: "",
  estimatedVsActualCostChartData: [],
  plannedHoursVsActualHours: [],
  healthStatusOfModules: [],
  healthStatusOfSprints: [],
  taskStatusGroupingCount: [],
  pinProjects: [],
  allProjectActivity: [],
  projectExpenseOverview: [],
  upcomingScrum: [],
  allProjectDocs: [],
  singleProjectDoc: {},
  projectCardTaskCount: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_PROJECTS:
      return {
        ...state,
        allProjects: action.payload,
      };

    case SET_ALL_PROJECT_DISCUSSION:
      return {
        ...state,
        allProjectDiscussions: action.payload,
      };

    case SET_ALL_PROJECT_DISCUSSION_COMMENTS:
      return {
        ...state,
        allProjectDiscussionComments: action.payload,
      };
    case SET_SELECTED_MEMBERS:
      return {
        ...state,
        selectedMembersForProject: action.payload,
      };
    case SET_ALL_PROJECT_COUNT:
      return {
        ...state,
        allProjectCount: action.payload,
      };
    case SET_PROJECT_OVERVIEW:
      return {
        ...state,
        projectOverview: action.payload,
      };
    case SET_SINGLE_PROJECT_DATA:
      return {
        ...state,
        singleProjectData: action.payload,
      };
    case SET_GANTT_DATA:
      return {
        ...state,
        ganttChartData: action.payload,
      };
    case SET_ALL_PROJECT_TASK:
      return {
        ...state,
        allTasks: action.payload,
      };

    case SET_ALL_FILES:
      return {
        ...state,
        allFiles: action.payload,
      };
    case SET_SCHEDULE_INDICATOR:
      return {
        ...state,
        projectScheduleIndicator: action.payload,
      };
    case SET_TASK_STATUS_BREAKDOWN:
      return {
        ...state,
        taskStatusBreakdown: action.payload,
      };
    case SET_BURNDOWN_CHART_DATA:
      return {
        ...state,
        burndownChartData: action.payload,
      };
    case SET_TASK_PROGRESS_CHART:
      return {
        ...state,
        taskProgressChartData: action.payload,
      };
    case SET_SCHEDULE_INDICATOR_TASK_COMPLETION:
      return {
        ...state,
        indicatorTaskCompletionByWeek: action.payload,
      };
    case SET_AVG_COST_OF_EMP:
      return {
        ...state,
        avgCostOfEmployee: action.payload,
      };
    case SET_TOTAL_COST_OF_EMP:
      return {
        ...state,
        totalCostOfEmployee: action.payload,
      };
    case SET_ESTIMATED_COST_VS_ACTUAL_COST_CHART_DATA:
      return {
        ...state,
        estimatedVsActualCostChartData: action.payload,
      };
    case SET_PLANNED_HOURS_VS_ACTUAL_HOURS_CHART_DATA:
      return {
        ...state,
        plannedHoursVsActualHours: action.payload,
      };
    case SET_HEALTH_STATUS_OF_MODULES:
      return {
        ...state,
        healthStatusOfModules: action.payload,
      };
    case SET_HEALTH_STATUS_OF_SPRINTS:
      return {
        ...state,
        healthStatusOfSprints: action.payload,
      };
    case SET_TASK_STATUS_GROUPING:
      return {
        ...state,
        taskStatusGroupingCount: action.payload,
      };
    case SET_PROJECT_SCRUMS:
      return {
        ...state,
        allScrums: action.payload,
      };
    case SET_SIGNLE_SCRUM_DATA:
      return {
        ...state,
        singleScrumData: action.payload,
      };
    case SET_ALL_PIN_PROJECTS:
      return {
        ...state,
        pinProjects: action.payload,
      };
    case SET_PROJECT_ACTIVITY:
      return {
        ...state,
        allProjectActivity: action.payload,
      };
    case SET_PROJECT_EXPENSE_OVERVIEW:
      return {
        ...state,
        projectExpenseOverview: action.payload,
      };
    case SET_ALL_NOTES_OF_SINGLE_SCRUM:
      return {
        ...state,
        allNotesByScrum: action.payload,
      };
    case SET_UPCOMING_SCRUM:
      return {
        ...state,
        upcomingScrum: action.payload,
      };
    case SET_PROJECT_ALL_DOCS:
      return {
        ...state,
        allProjectDocs: action.payload,
      };
    case SET_SINGLE_DOC_DATA:
      return {
        ...state,
        singleProjectDoc: action.payload,
      };
    case SET_PROJECT_CARD_COUNT_DATA:
      return {
        ...state,
        projectCardTaskCount: action.payload,
      };
    default:
      return state;
  }
}
