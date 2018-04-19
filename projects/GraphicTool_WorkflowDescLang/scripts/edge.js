/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


function initEdge_forGraphic(edge){
  return {data: { source: edge.source, target: edge.target, label:edge.label} }
}

function findSourcesOfServiceNode(consider_node, list_of_nodes,init_node,goal_node){
  list_of_sources = []
  //console.log(consider_node)
  for (var j = 0 ; j < consider_node.data.inputs.length ; j++){
    if (consider_node.data.inputs[j].map_from_service === "initial_state"){
        list_of_sources.push(init_node) 
    }
  }
  
  for(var i = 0 ; i < list_of_nodes.length ; i++){
    if (consider_node.data.id !== list_of_nodes[i].data.id){
      var check_node = list_of_nodes[i]
      for (var j = 0 ; j < consider_node.data.inputs.length ; j++){

        if (consider_node.data.inputs[j].map_from_service === check_node.data.id){
           list_of_sources.push(check_node)
        }
        
      }
    }
  }
  return list_of_sources
}

function findCommonResource(service_node_source, service_nodes_destination){
  commons = []
  if (service_nodes_destination.data.type === "service_node"){
    for(var i = 0 ; i < service_nodes_destination.data.inputs.length ; i++){
      if (service_node_source.data.type === "service_node") {
         for(var j = 0 ; j < service_node_source.data.outputs.length; j++){
            if (service_nodes_destination.data.inputs[i].resource_id === service_node_source.data.outputs[j]){ //nen co them data format 
              if (commons.indexOf(service_nodes_destination.data.inputs[i].resource_id) == -1){
                commons.push(service_nodes_destination.data.inputs[i].resource_id)  
              }
              
            } else if (service_nodes_destination.data.inputs[i].map_to_resource_id === service_node_source.data.outputs[j]){ //nen co them data format
              if (commons.indexOf(service_nodes_destination.data.inputs[i].map_to_resource_id) == -1){
                commons.push(service_nodes_destination.data.inputs[i].map_to_resource_id)  
              }
            }
         }
      } else if (service_node_source.data.type === "initial_state_node"){
         for(var j = 0 ; j < service_node_source.data.components.length; j++){
            if (service_nodes_destination.data.inputs[i].resource_id === service_node_source.data.components[j]){
              if (commons.indexOf(service_nodes_destination.data.inputs[i].resource_id) == -1){
                commons.push(service_nodes_destination.data.inputs[i].resource_id)  
              }
            } else if (service_nodes_destination.data.inputs[i].map_to_resource_id === service_node_source.data.components[j]){
              if (commons.indexOf(service_nodes_destination.data.inputs[i].map_to_resource_id) == -1){
                commons.push(service_nodes_destination.data.inputs[i].map_to_resource_id)  
              }
            }
         }
      } 
    }
  } else if (service_nodes_destination.data.type === "goal_state_node"){
    for(var j = 0 ; j < service_nodes_destination.data.components.length; j++){
        for(var i = 0 ; i < service_node_source.data.outputs.length; i++){
          if (service_node_source.data.outputs[i] === service_nodes_destination.data.components[j]){
            if (commons.indexOf(service_nodes_destination.data.components[j]) == -1){
              commons.push(service_nodes_destination.data.components[j])  
            }   
          }
        }
     }
  }
  return commons
}

function setUpAllEdgesFor_ServiceNodes_From_WorkFlow(service_nodes,plan,init_node,goal_node){
  var service_nodes_edges = []
  var edge_temp = {}
  //console.log(service_nodes)
  for(var i = 0 ; i < service_nodes.length ; i++){
      var consider_service_node = {}
      consider_service_node = service_nodes[i]
      //console.log(consider_service_class_node)
      var service_nodes_sources = findSourcesOfServiceNode(consider_service_node,service_nodes,init_node,goal_node)
      //console.log("Souce of " + consider_service_class_node.data.id)
      //console.log(service_class_nodes_sources)
      if (!objectIsEmpty(service_nodes_sources) && service_nodes_sources.length > 0){
        for(var j = 0 ; j < service_nodes_sources.length ; j++){
          edge_temp = {}
          edge_temp.target = consider_service_node.data.id
          edge_temp.source = service_nodes_sources[j].data.id
          var commons = findCommonResource(service_nodes_sources[j],consider_service_node)
          edge_temp.label = commons.toString()
          var edge = initEdge_forGraphic(edge_temp)
          service_nodes_edges.push(edge)
        }
      }

  
  }
  

  for(var i = 0 ; i < goal_node.data.maps.length ; i++){
    for(var j = 0 ; j < service_nodes.length; j++){
      if (goal_node.data.maps[i].map_from_service === service_nodes[j].data.id){
          edge_temp = {}
          edge_temp.target = goal_node.data.id
          edge_temp.source = service_nodes[j].data.id
          edge_temp.label = findCommonResource(service_nodes[j],goal_node)
          var edge = initEdge_forGraphic(edge_temp)
          service_nodes_edges.push(edge)
      }
    }
  }

  return service_nodes_edges
}

function setUpEdge_FromInit_ToFirstOperation(initNode,operation_nodes,origin_input,origin_first_operation){
  var edge_temp = {}
  //console.log(operation_nodes.length)
  edge_temp.source = initNode.data.id
  edge_temp.target = operation_nodes[0].data.id
  var common_label = []
  var added_label = ""
  var origin_first_operation_input = origin_first_operation.operation_parameters.input.components

  
  for(var i = 0 ; i < origin_first_operation_input.length ; i++){
    for(var j = 0 ; j < origin_input.length ; j++){
          if (origin_input[j].resource_ontology_id.trim().toUpperCase() ===
              origin_first_operation_input[i].resource_ontology_id.trim().toUpperCase()){
            common_label.push(origin_input[j].resource_ontology_id)
          }
    }
  }
  edge_temp.label = common_label.toString()

  var edge = initEdge_forGraphic(edge_temp)
  return edge
}

function setUpEdge_FromLastOperation_ToGoal(goalNode,operation_nodes,origin_output,origin_last_operation){
  var edge_temp = {}
  edge_temp.source = operation_nodes[operation_nodes.length-1].data.id
  edge_temp.target = goalNode.data.id

  var common_label = []
  var added_label = ""
  var origin_last_operation_output = origin_last_operation.operation_parameters.output.components

  for(var i = 0 ; i < origin_last_operation_output.length ; i++){
    for(var j = 0 ; j < origin_output.length ; j++){
          if (origin_output[j].resource_ontology_id.trim().toUpperCase() ===
              origin_last_operation_output[i].resource_ontology_id.trim().toUpperCase()){
            common_label.push(origin_output[j].resource_ontology_id)
          }
    }
  }
  edge_temp.label = common_label.toString()

  var edge = initEdge_forGraphic(edge_temp)
  return edge
}
