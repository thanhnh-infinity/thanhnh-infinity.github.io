/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


/* Set up Nodes (Operation Node and Initial + Goal) FROM WORKFLOW DATA */
function initNode_forGraphic(node){
  return {data : {id : node.id, name : node.name, faveShape: node.shape, type:node.type, components:node.components, data_formats:node.data_formats, inputs:node.inputs,outputs:node.outputs,maps:node.maps}}
}

function setUpOneServiceClassNode(service_class){
  var service_class_node_temp = {}
  service_class_node_temp.id = service_class.service_class_name
  service_class_node_temp.name = service_class.service_class_name
  service_class_node_temp.type = "service_class_node"
  service_class_node_temp.shape = "ellipse"

  service_class_node_temp.inputs = []
  raw_input_components = service_class.service_class_parameters.input.components
  if (!objectIsEmpty(raw_input_components) && raw_input_components.length > 0){
    for(var i = 0 ; i < raw_input_components.length ; i++){
       input_object = {}
       input_object.resource_id = raw_input_components[i].resource_ontology_id
       input_object.map_to_resource_id = raw_input_components[i].map.resource_ontology_id
       input_object.map_from_service_class = raw_input_components[i].map.from
       service_class_node_temp.inputs.push(input_object)
    }
  }

  service_class_node_temp.outputs = []
  raw_output_components = service_class.service_class_parameters.output.components
  if (!objectIsEmpty(raw_output_components) && raw_output_components.length > 0){
    for(var i = 0 ; i < raw_output_components.length ; i++){
      service_class_node_temp.outputs.push(raw_output_components[i].resource_ontology_id)
    }
  }
  //console.log("Temp")
  //console.log(service_class_node_temp)
  var service_class_node = initNode_forGraphic(service_class_node_temp)
  service_class_node.data.type = "service_class_node"
  //console.log("Thayt")
  //console.log(service_class_node)
  return service_class_node
}

function setUpInitialState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestInput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.input
  var initialState_Node_Temp = {}
  var id = ""
  var name = "Init State : "
  var type = "initial_state_node"
  var components = []
  var data_formats = []
  for(var i = 0 ; i < requestInput.length ; i++){
    if (i < requestInput.length - 1) {
       id += requestInput[i].resource_ontology_id + "_"
       name += requestInput[i].resource_ontology_id + ", "
       components.push(requestInput[i].resource_ontology_id)
       data_formats.push(requestInput[i].resource_data_format_id)
    } else {
       id += requestInput[i].resource_ontology_id
       name += requestInput[i].resource_ontology_id
       components.push(requestInput[i].resource_ontology_id)
       data_formats.push(requestInput[i].resource_data_format_id)
    }
  }
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = "triangle"
  initialState_Node_Temp.components = components
  initialState_Node_Temp.data_formats = data_formats
  var initialState_Node = initNode_forGraphic(initialState_Node_Temp)
  //console.log(initialState_Node)
  return initialState_Node
}

function setUpGoalState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestOutput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
  var goalState_Node_Temp = {}
  var id = ""
  var name = "Goal State : "
  var type = "goal_state_node"
  var components = []
  var data_formats = []
  for(var i = 0 ; i < requestOutput.length ; i++){
    if (i < requestOutput.length - 1) {
       id += requestOutput[i].resource_ontology_id + "_"
       name += requestOutput[i].resource_ontology_id + ","
       components.push(requestInput[i].resource_ontology_id)
       data_formats.push(requestInput[i].resource_data_format_id)
    } else {
       id += requestOutput[i].resource_ontology_id
       name += requestOutput[i].resource_ontology_id
       components.push(requestOutput[i].resource_ontology_id)
       data_formats.push(requestOutput[i].resource_data_format_id)
    }
  }
  goalState_Node_Temp.id = id
  goalState_Node_Temp.name = name
  goalState_Node_Temp.type = type
  goalState_Node_Temp.shape = "triangle"
  goalState_Node_Temp.components = components
  goalState_Node_Temp.data_formats = data_formats

  goalState_Node_Temp.maps = []
  if (!objectIsEmpty(requestOutput) && requestOutput.length > 0){
    for(var i = 0 ; i < requestOutput.length ; i++){
       output_object = {}
       output_object.resource_id = requestOutput[i].resource_ontology_id
       output_object.map_to_resource_id = requestOutput[i].map.resource_ontology_id
       output_object.map_from_service_class = requestOutput[i].map.from
       goalState_Node_Temp.maps.push(output_object)
    }
  }  

  var goalState_Node = initNode_forGraphic(goalState_Node_Temp)
  return goalState_Node

}

function setUpAll_ServiceClassNodes_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
   var abstract_plan = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].abstract_plan
   var service_class_nodes = []
   for(var i = 0 ; i < abstract_plan.length ; i++){
     var service_class_node = setUpOneServiceClassNode(abstract_plan[i])
     service_class_nodes.push(service_class_node)
   }
   //console.log("A1")
   //console.log(service_class_nodes)
   return service_class_nodes
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
  var components = []
  var data_formats = []
  for(var i = 0 ; i < initial_state_node.components.length ; i++){
    if (i < initial_state_node.components.length - 1) {
       id += initial_state_node.components[i].local_name + "_"
       name += initial_state_node.components[i].local_name + ", "
       components.push(initial_state_node.components[i].local_name)
       data_formats.push(initial_state_node.components[i].data_format)
    } else {
       id += initial_state_node.components[i].local_name
       name += initial_state_node.components[i].local_name
       components.push(initial_state_node.components[i].local_name)
       data_formats.push(initial_state_node.components[i].data_format)
    }
  }
  //console.log(id)
  //console.log(name)
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = "triangle"
  initialState_Node_Temp.components = components
  initialState_Node_Temp.data_formats = data_formats

  var initialState_Node = initNode_forGraphic(initialState_Node_Temp)
  //console.log(initialState_Node)
  return initialState_Node
}

function displayInitialState_From_Ontology(initial_state_node){
  var graphic_initial_state_node = setUpInitialState_From_Ontology(initial_state_node)
  /* Save initial state data for Planning purpose */
  GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = initial_state_node
  /* remove old initial state node */
  removeNodeByType("initial_state_node")
  /* Save to display initial state graphically */
  GLOBAL_NODES_DATA.push(graphic_initial_state_node)
  drawGraphicFrame_with_CurrentNodesEdge();
}

function setUpGoalState_From_Ontology(goal_state_node){
  var goalState_Node_Temp = {}
  var id = ""
  var name = "Goal State : "
  var type = "goal_state_node"
  var components = []
  var data_formats = []
  for(var i = 0 ; i < goal_state_node.components.length ; i++){
    if (i < goal_state_node.components.length - 1) {
       id += goal_state_node.components[i].local_name + "_"
       name += goal_state_node.components[i].local_name + ", "
       components.push(goal_state_node.components[i].local_name)
       data_formats.push(goal_state_node.components[i].data_format)
    } else {
       id += goal_state_node.components[i].local_name
       name += goal_state_node.components[i].local_name
       components.push(goal_state_node.components[i].local_name)
       data_formats.push(goal_state_node.components[i].data_format)
    }
  }
  goalState_Node_Temp.id = id
  goalState_Node_Temp.name = name
  goalState_Node_Temp.type = type
  goalState_Node_Temp.shape = "triangle"
  goalState_Node_Temp.components = components
  goalState_Node_Temp.data_formats = data_formats

  var goalState_Node = initNode_forGraphic(goalState_Node_Temp)
  return goalState_Node
}

function displayGoalState_From_Ontology(goal_state_node){
  var graphic_goal_state_node = setUpGoalState_From_Ontology(goal_state_node)
  /* Save goal state data to global data to planning */
  
  GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = goal_state_node
  /* remove old initial state node */
  removeNodeByType("goal_state_node")
  /* Save to display purpose */
  GLOBAL_NODES_DATA.push(graphic_goal_state_node)
  /* Re-drawing */
  //console.log("Nodes List")
  //console.log(GLOBAL_NODES_DATA)
  drawGraphicFrame_with_CurrentNodesEdge();
}
