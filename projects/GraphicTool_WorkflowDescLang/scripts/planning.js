/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


function executePlanner_toGet_WorkFlow(){
  var initial_state_data = {}
  var goal_state_data = {}

  /* Step 1  : Read data from initial_state_data */
  initial_state_data = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
  goal_state_data =   GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE

  /* Step 2 : Send POST METHOD API
     http:<planning_ontology_server:8080>/getPlanningWorkflow (Python + CherryPy)
     Input : Initial State, Goal State, Condition, etx
     Output: plan - workflow in JSON format
     POST METHOD with Initial State Data and Goal State Data - All Step about Create LP files and
     run planning are ON SERVER */
  console.log("Send API POST planning Engine Initial State :")
  console.log(initial_state_data)
  console.log("Send API POST planning Engine Goal State :")
  console.log(goal_state_data)
  /* Step 3 : Retrive Plan as JSON format from planning_ontology_server:8080 */
  
  /* Simulator - Gia lap thoi - Phai lay tu API result */
  var result_workflow = GLOBAL_WORKFLOW_PLAN_DATA
  /* Step 4 : Display origin planning */
  DisplayWorkflow_Graphic_From_Source(result_workflow)
}
