/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


/* Set up Nodes (Operation Node and Initial + Goal) FROM WORKFLOW DATA */
function initNode_forGraphic(node){
  return {data : 
           {id : node.id, name : node.name, description: node.description ,faveShape: node.shape, type:node.type, color:node.color,text_color:node.text_color,components:node.components, data_formats:node.data_formats, inputs:node.inputs,outputs:node.outputs,maps:node.maps}}
}

function setUpOneServiceNode(service){
  var service_node_temp = {}
  service_node_temp.id = service.service_name
  service_node_temp.name = service.service_name
  service_node_temp.type = "service_node"
  service_node_temp.shape = SERIVE_NODE_CONFIG.shape
  service_node_temp.color = SERIVE_NODE_CONFIG.color
  service_node_temp.text_color = SERIVE_NODE_CONFIG.text_color
  service_node_temp.description = service.service_description

  service_node_temp.inputs = []
  raw_input_components = service.service_parameters.input.components
  if (!objectIsEmpty(raw_input_components) && raw_input_components.length > 0){
    for(var i = 0 ; i < raw_input_components.length ; i++){
       input_object = {}
       input_object.resource_id = raw_input_components[i].resource_ontology_id
       input_object.data_format_id = raw_input_components[i].resource_data_format
       input_object.map_to_resource_id = raw_input_components[i].map.resource_ontology_id
       input_object.map_from_service = raw_input_components[i].map.from_service
       input_object.map_to_resource_data_format = raw_input_components[i].map.resource_data_format
       service_node_temp.inputs.push(input_object)
    }
  }

  service_node_temp.outputs = []
  raw_output_components = service.service_parameters.output.components
  if (!objectIsEmpty(raw_output_components) && raw_output_components.length > 0){
    for(var i = 0 ; i < raw_output_components.length ; i++){
      service_node_temp.outputs.push(raw_output_components[i].resource_ontology_id)
    }
  }
  
  var service_node = initNode_forGraphic(service_node_temp)
  service_node.data.type = "service_node"
  
  return service_node
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
  initialState_Node_Temp.shape = INIT_GOAL_NODE_CONFIG.shape
  initialState_Node_Temp.color = INIT_GOAL_NODE_CONFIG.color
  initialState_Node_Temp.text_color = INIT_GOAL_NODE_CONFIG.text_color
  initialState_Node_Temp.components = components
  initialState_Node_Temp.data_formats = data_formats
  initialState_Node_Temp.description = "Initial State"
  var initialState_Node = initNode_forGraphic(initialState_Node_Temp)
  console.log(initialState_Node)
  return initialState_Node
}

function setUpGoalState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestOutput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
  var list_services = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].full_plan
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
       components.push(requestOutput[i].resource_ontology_id)
       data_formats.push(requestOutput[i].resource_data_format_id)
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
  goalState_Node_Temp.shape = INIT_GOAL_NODE_CONFIG.shape
  goalState_Node_Temp.color = INIT_GOAL_NODE_CONFIG.color
  goalState_Node_Temp.text_color = INIT_GOAL_NODE_CONFIG.text_color
  goalState_Node_Temp.components = components
  goalState_Node_Temp.data_formats = data_formats
  goalState_Node_Temp.description = "Goal State"
  goalState_Node_Temp.maps = []
  if (!objectIsEmpty(requestOutput) && requestOutput.length > 0){
    for(var i = 0 ; i < requestOutput.length ; i++){
       output_object = {}
       output_object.resource_id = requestOutput[i].resource_ontology_id
       for(var j = 0 ; j < list_services.length ; j++){
          var consider_service = list_services[j]
          var output_comps = consider_service.service_parameters.output.components
          for(var k = 0 ; k < output_comps.length ; k++){
             if ((output_comps[k].resource_ontology_id.trim().toUpperCase() === requestOutput[i].resource_ontology_id.trim().toUpperCase()) 
                 && (output_comps[k].resource_data_format.trim().toUpperCase() === requestOutput[i].resource_data_format_id.trim().toUpperCase())){
                output_object.map_to_resource_id = output_comps[k].resource_ontology_id
                output_object.map_to_data_format = output_comps[k].resource_data_format
                output_object.map_from_service = consider_service.service_name
             }
          }
            

       }
         
       goalState_Node_Temp.maps.push(output_object)
    }
  }  

  var goalState_Node = initNode_forGraphic(goalState_Node_Temp)
  return goalState_Node

}

function setUpAll_ServiceNodes_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA){
   var workflow_plan = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].full_plan
   var service_nodes = []
   for(var i = 0 ; i < workflow_plan.length ; i++){
     var service_node = setUpOneServiceNode(workflow_plan[i])
     service_nodes.push(service_node)
   }
   //console.log(service_nodes)
   return service_nodes
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
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = INIT_GOAL_NODE_CONFIG.shape
  initialState_Node_Temp.color = INIT_GOAL_NODE_CONFIG.color
  initialState_Node_Temp.text_color = INIT_GOAL_NODE_CONFIG.text_color
  initialState_Node_Temp.components = components
  initialState_Node_Temp.data_formats = data_formats
  initialState_Node_Temp.description = "Initial State"
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
  goalState_Node_Temp.shape = INIT_GOAL_NODE_CONFIG.shape
  goalState_Node_Temp.color = INIT_GOAL_NODE_CONFIG.color
  goalState_Node_Temp.text_color = INIT_GOAL_NODE_CONFIG.text_color
  goalState_Node_Temp.components = components
  goalState_Node_Temp.data_formats = data_formats
  goalState_Node_Temp.description = "Goal State"
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
