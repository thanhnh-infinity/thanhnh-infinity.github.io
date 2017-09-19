/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


/* Set up Nodes (Operation Node and Initial + Goal) FROM WORKFLOW DATA */
function initNode_forGraphic(node){
  return {data : {id : node.id, name : node.name, faveShape: node.shape, type:node.type}}
}

function setUpOneOperationNode(operation){
  var operation_node_temp = {}
  operation_node_temp.id = operation.operation_name
  operation_node_temp.name = operation.operation_name
  operation_node_temp.type = "operation_node"
  operation_node_temp.shape = "ellipse"
  var operation_node = initNode_forGraphic(operation_node_temp)
  return operation_node
}

function setUpInitialState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestInput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.input
  var initialState_Node_Temp = {}
  var id = ""
  var name = "Init State : "
  var type = "initial_state_node"
  for(var i = 0 ; i < requestInput.length ; i++){
    if (i < requestInput.length - 1) {
       id += requestInput[i].resource_ontology_id + "_"
       name += requestInput[i].name + ","
    } else {
       id = requestInput[i].resource_ontology_id
       name += requestInput[i].name
    }
  }
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = "triangle"
  var initialState_Node = initNode_forGraphic(initialState_Node_Temp)
  return initialState_Node
}

function setUpGoalState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestOutput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
  var goalState_Node_Temp = {}
  var id = ""
  var name = "Goal State : "
  var type = "goal_state_node"
  for(var i = 0 ; i < requestOutput.length ; i++){
    if (i < requestOutput.length - 1) {
       id += requestOutput[i].resource_ontology_id + "_"
       name += requestOutput[i].name + ","
    } else {
       id = requestOutput[i].resource_ontology_id
       name += requestOutput[i].name
    }
  }
  goalState_Node_Temp.id = id
  goalState_Node_Temp.name = name
  goalState_Node_Temp.type = type
  goalState_Node_Temp.shape = "triangle"
  var goalState_Node = initNode_forGraphic(goalState_Node_Temp)
  return goalState_Node

}

function setUpAllOperationNodes_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
   var plan = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan
   var operation_nodes = []
   for(var i = 0 ; i < plan.length ; i++){
     var operation_node = setUpOneOperationNode(plan[i])
     operation_nodes.push(operation_node)
   }
   return operation_nodes
}

function getFullNodeData_FromNodeID(node_id,origin_operations_nodes,added_operations_nodes){
  //console.log(origin_operations_nodes)
  for(var i = 0 ; i < origin_operations_nodes.length ; i++){
    if (node_id.trim().toUpperCase() === origin_operations_nodes[i].operation_name.trim().toUpperCase()){
      return origin_operations_nodes[i]
    }
  }
  for(var i = 0 ; i < added_operations_nodes.length ; i++){
    if (node_id.trim().toUpperCase() === added_operations_nodes[i].operation_name.trim().toUpperCase()){
      return added_operations_nodes[i]
    }
  }
  return null
}

/******************************************/
/**** Initial State from Ontology *********/
/******************************************/
function setUpInitialState_From_Ontology(initial_state_node){
  var initialState_Node_Temp = {}
  var id = ""
  var name = "Init State : "
  var type = "initial_state_node"
  for(var i = 0 ; i < initial_state_node.components.length ; i++){
    if (i < initial_state_node.components.length - 1) {
       id += initial_state_node.components[i].uri + "_"
       name += initial_state_node.components[i].local_name + ","
    } else {
       id = initial_state_node.components[i].uri
       name += initial_state_node.components[i].local_name
    }
  }
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = "triangle"
  var initialState_Node = initNode_forGraphic(initialState_Node_Temp)
  return initialState_Node
}

function displayInitialState_From_Ontology(initial_state_node){
  var graphic_initial_state_node = setUpInitialState_From_Ontology(initial_state_node)
  /* Save initial state data for Planning purpose */
  GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = initial_state_node
  /* Save to display initial state graphically */
  GLOBAL_NODES_DATA.push(graphic_initial_state_node)
  drawGraphicFrame_with_CurrentNodesEdge();
}

function setUpGoalState_From_Ontology(goal_state_node){
  var goalState_Node_Temp = {}
  var id = ""
  var name = "Goal State : "
  var type = "goal_state_node"
  for(var i = 0 ; i < goal_state_node.components.length ; i++){
    if (i < goal_state_node.components.length - 1) {
       id += goal_state_node.components[i].uri + "_"
       name += goal_state_node.components[i].local_name + ","
    } else {
       id = goal_state_node.components[i].uri
       name += goal_state_node.components[i].local_name
    }
  }
  goalState_Node_Temp.id = id
  goalState_Node_Temp.name = name
  goalState_Node_Temp.type = type
  goalState_Node_Temp.shape = "triangle"
  var goalState_Node = initNode_forGraphic(goalState_Node_Temp)
  return goalState_Node
}

function displayGoalState_From_Ontology(goal_state_node){
  var graphic_goal_state_node = setUpGoalState_From_Ontology(goal_state_node)
  /* Save goal state data to global data to planning */
  
  GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = goal_state_node
  /* Save to display purpose */
  GLOBAL_NODES_DATA.push(graphic_goal_state_node)
  /* Re-drawing */
  drawGraphicFrame_with_CurrentNodesEdge();
}
