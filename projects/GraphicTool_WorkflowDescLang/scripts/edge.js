/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


function initEdge_forGraphic(edge){
  return {data: { source: edge.source, target: edge.target, label:edge.label} }
}

function setUpAllEdgesForOperationNodes_From_WorkFlow(operation_nodes,plan){
  var operation_nodes_edges = []
  var edge_temp = {}
  for(var i = 0 ; i < operation_nodes.length ; i++){
    if (i < operation_nodes.length - 1){
      edge_temp = {}
      edge_temp.source = operation_nodes[i].data.id
      edge_temp.target = operation_nodes[i+1].data.id

      var common_label = []
      var operation_i = plan[i]
      var operation_iplus1 = plan[i+1]
      for(var k = 0 ; k < operation_i.operation_parameters.output.components.length ; k++){
        for(var h = 0 ; h < operation_iplus1.operation_parameters.input.components.length ; h++){
          var consider_out_op_1 = operation_i.operation_parameters.output.components[k]
          var consider_in_op_2 = operation_iplus1.operation_parameters.input.components[h]
          if (consider_out_op_1.ontology_resource_id.trim().toUpperCase()
              === consider_in_op_2.ontology_resource_id.trim().toUpperCase()){
              common_label.push(consider_out_op_1.ontology_resource_id)
          }
        }
      }

      edge_temp.label = common_label.toString()
      var edge = initEdge_forGraphic(edge_temp)
      operation_nodes_edges.push(edge)
    }
  }
  return operation_nodes_edges
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
          if (origin_input[j].ontology_resource_id.trim().toUpperCase() ===
              origin_first_operation_input[i].ontology_resource_id.trim().toUpperCase()){
            common_label.push(origin_input[j].ontology_resource_id)
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
          if (origin_output[j].ontology_resource_id.trim().toUpperCase() ===
              origin_last_operation_output[i].ontology_resource_id.trim().toUpperCase()){
            common_label.push(origin_output[j].ontology_resource_id)
          }
    }
  }
  edge_temp.label = common_label.toString()

  var edge = initEdge_forGraphic(edge_temp)
  return edge
}
