/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/
var GLOBAL_NODES_DATA = [];
var cy;
var CURRENT_X;
var CURRENT_Y;
var GLOBAL_EDGES_DATA = [];
var ORIGIN_INIT_INPUT = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.input
var ORIGIN_GOAL_OUTPUT = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
var ORIGIN_FIRST_OPERATION = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan[0]
var ORIGIN_OPERATION_NODE_LIST = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan
var ORIGIN_LAST_OPERATION = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan[GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan.length - 1]
var ADDED_OPERATION_NODES_LIST = []
function clearData(){
  GLOBAL_NODES_DATA = [];
  GLOBAL_EDGES_DATA = [];
  //GLOBAL_WORKFLOW_PLAN_DATA = {};
  document.getElementById('cy').style.visibility = "visible";
  console.log("Clear")
}

function setOperationNodeData_FromOWL(selectOperationOWLObject){
  var owl_resource_link = selectOperationOWLObject.value
  var owl_resource_id = getResourceID_FromOWLLink(owl_resource_link)
  if (!isEmpty(owl_resource_id)){
    //document.getElementById('txtNewOperationNodeName').value = owl_resource_id
    document.getElementById('txtOntologyResourceID_Node').value = owl_resource_id
  } else {
    //document.getElementById('txtNewOperationNodeName').value = GLOBAL_NO_ONTOLOGY_DATA
    document.getElementById('txtOntologyResourceID_Node').value = GLOBAL_NO_ONTOLOGY_DATA
  }

  /* MAke ontology API request to fill Input and Output forms */
  /*
  $.ajax({
        type: "GET",
        url: "http://128.123.177.21:8080/query?version=0.2&action=get&object=landcover_landinfo&recorder_name=phihuongthanh@gmail.com&quantity=100",
        dataType: "json",
        async:false,
        data: JSON.stringify({ version: '0.2.1', action: 'get', object:'landcover_landinfo',recorder_name:'phihuongthanh@gmail.com', quantity:100 }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
              console.log(data)
        },
        error: function (textStatus, errorThrown) {
                console.log(textStatus)
        }

  });
  */
  if (!isEmpty(owl_resource_link)){
    var input_data = TEST_OPERATION_API_JSON.operation_parameters.input
    var output_data = TEST_OPERATION_API_JSON.operation_parameters.output
    generateInputPartData(input_data)
    generateOutputPartData(output_data)
  } else {
    generateInputPartData("")
    generateOutputPartData("")
  }
}
function generateOutputPartData(output_data){
  var html = ""
  if (!isEmpty(output_data)){
      html += "<p>Operation Output params</p>"
      html += "<p>Data format : &nbsp;&nbsp;&nbsp; <text id='txtOutputDataFormat'>" + output_data.info.data_format + "</text></p>"

      for(var i = 0 ; i < output_data.components.length ; i++){
        var component = output_data.components[i]
        html += "<p>Output Param component " + (i+1) + "</p>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Name :  <text name='txtOutputComponentName'>" + component.name + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource ID :  <text name='txtOutputComponentOntologyResourceID'>" + component.ontology_resource_id + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource Link :  <text name='txtOutputComponentOntologyResourceLink'>" + component.ontology_resource_link + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology param name :  <text name='txtOutputComponentOntologyParamName'>" + component.ontology_param_name + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology param link :  <text name='txtOutputComponentOntologyParamLink'>" + component.ontology_param_link + "</text><br/>"
      }
  } else {
    html = ""
  }
  document.getElementById('divOutputParams').innerHTML = html
}
function generateInputPartData(input_data){
  if (!isEmpty(input_data)){
    var html = "<p>Operation input params</p>"
    html += "<p>Data format : &nbsp;&nbsp;&nbsp;<text id='txtInputDataFormat'>" + input_data.info.data_format + "</text></p>"

    for(var i = 0 ; i < input_data.components.length ; i++){
      var component = input_data.components[i]
      html += "<p>Input Param component " + (i+1) + "</p>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Name :  <text name='txtInputComponentName'>" + component.name + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource ID :  <text name='txtInputComponentOntologyResourceID'>" + component.ontology_resource_id + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource Link :  <text name='txtInputComponentOntologyResourceLink'>" + component.ontology_resource_link + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology param name :  <text name='txtInputComponentOntologyParamName'>" + component.ontology_param_name + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology param link :  <text name='txtInputComponentOntologyParamLink'>" + component.ontology_param_link + "</text><br/>"
    }
    document.getElementById('divInputParams').innerHTML = html
  } else {
    document.getElementById('divInputParams').innerHTML = ""
  }
}

function openAddOperationNodeData_Modal(){
    document.getElementById('cy').style.visibility = "hidden";
    var addOperationNodeData_modal = document.getElementById('addOperationNodeDataModal');
    addOperationNodeData_modal.style.display = "block";
}

function closeAddOperationNodeData_Modal(){
  var addOperationNodeData_modal = document.getElementById('addOperationNodeDataModal');
  addOperationNodeData_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
  return;
}

function saveAddOperationNodeData_Modal(){
   var addOperationNodeData_modal = document.getElementById('addOperationNodeDataModal');
   addOperationNodeData_modal.style.display = "none";
   document.getElementById('cy').style.visibility = "visible";

   var ontology_resource_id = document.getElementById('txtOntologyResourceID_Node').value
   var ontology_resource_link = document.getElementById('selectOntologyReferenceLink_Node').value
   //console.log(ontology_resouce_id)
   var object_type = 'operation_node'
   var object_shape = 'ellipse'
   var input_data_format = document.getElementById('txtInputDataFormat').innerText
   //console.log(input_data_format)
   var output_data_format = document.getElementById('txtOutputDataFormat').innerText
   //console.log(output_data_format)
   var input_components_names = document.getElementsByName('txtInputComponentName')
   //console.log(input_components_names)
   var input_components_resource_ids = document.getElementsByName('txtInputComponentOntologyResourceID')
   var input_components_resource_links = document.getElementsByName('txtInputComponentOntologyResourceLink')
   var input_components_param_names = document.getElementsByName('txtInputComponentOntologyParamName')
   var input_components_param_links = document.getElementsByName('txtInputComponentOntologyParamLink')

   var input_components_length = 0
   //console.log(input_components_resource_ids.length )
   //if (input_components_names.length == input_components_resource_ids.length == input_components_resource_links.length == input_components_param_names.length == input_components_param_links.length){
     input_components_length = input_components_resource_ids.length
   //}
   //console.log(input_components_length)

   var output_components_names = document.getElementsByName('txtOutputComponentName')
   //console.log(output_components_names)
   var output_components_resource_ids = document.getElementsByName('txtOutputComponentOntologyResourceID')
   var output_components_resource_links = document.getElementsByName('txtOutputComponentOntologyResourceLink')
   var output_components_param_names = document.getElementsByName('txtOutputComponentOntologyParamName')
   var output_components_param_links = document.getElementsByName('txtOutputComponentOntologyParamLink')

   var output_components_length = 0
   //console.log(output_components_resource_ids.length)
   //if (output_components_names.length == output_components_resource_ids.length == output_components_resource_links.length == output_components_param_names.length == output_components_param_links.length){
   output_components_length = output_components_resource_ids.length
   //}
   //console.log(output_components_length)

   var operation_node_ont_data = initOperationNode_Ontology()
   operation_node_ont_data.operation_name = ontology_resource_id
   operation_node_ont_data.operation_ontology_link = ontology_resource_link
   operation_node_ont_data.operation_parameters.input.info.data_format = input_data_format
   operation_node_ont_data.operation_parameters.output.info.data_format = output_data_format
   for(var i = 0 ; i < input_components_length ;i++){
     var component_for_node_ont_data = initComponent_forNode_Ontology()
     component_for_node_ont_data.name = input_components_names[i].innerText
     component_for_node_ont_data.ontology_resource_id = input_components_resource_ids[i].innerText
     component_for_node_ont_data.ontology_resource_link = input_components_resource_links[i].innerText
     component_for_node_ont_data.ontology_param_name = input_components_param_names[i].innerText
     component_for_node_ont_data.ontology_param_link = input_components_param_links[i].innerText
     operation_node_ont_data.operation_parameters.input.components.push(component_for_node_ont_data)
   }
   for(var i = 0 ; i < output_components_length ;i++){
     var component_for_node_ont_data = initComponent_forNode_Ontology()
     component_for_node_ont_data.name = output_components_names[i].innerText
     component_for_node_ont_data.ontology_resource_id = output_components_resource_ids[i].innerText
     component_for_node_ont_data.ontology_resource_link = output_components_resource_links[i].innerText
     component_for_node_ont_data.ontology_param_name = output_components_param_names[i].innerText
     component_for_node_ont_data.ontology_param_link = output_components_param_links[i].innerText
     operation_node_ont_data.operation_parameters.output.components.push(component_for_node_ont_data)
   }

   //console.log(operation_node_ont_data)
   ADDED_OPERATION_NODES_LIST.push(operation_node_ont_data)

   if (ontology_resource_id == null) {
       return;
   }

   var data = {
       group: 'nodes',
       id: ontology_resource_id,
       name:ontology_resource_id,
       type:'operation_node',
       faveShape:'ellipse'
   };

   var new_node = {}
   new_node.id = ontology_resource_id
   new_node.name = ontology_resource_id
   new_node.shape = 'ellipse'
   new_node.type = 'operation_node'
   GLOBAL_NODES_DATA.push(initNode(new_node))



   cy.add({
       data: data,
       position: {
           x: CURRENT_X,
           y: CURRENT_Y
       }
   });
}

function openAddEdgeData_Modal(){
    document.getElementById('cy').style.visibility = "hidden";
    var addEdgeData_modal = document.getElementById('addEdgeDataModal');
    addEdgeData_modal.style.display = "block";

    document.getElementById('sourceOperationNode').innerHTML = getHTMLdocOption_ListOfNodes(GLOBAL_NODES_DATA)
    document.getElementById('targetOperationNode').innerHTML = getHTMLdocOption_ListOfNodes(GLOBAL_NODES_DATA)
}

function mapCommonComponents(Output_Source_Node, Input_Target_Node){
  try{
        var common = []

        var outputSource_Components = Output_Source_Node.operation_parameters.output.components;
        var inputTarget_Components = Input_Target_Node.operation_parameters.input.components;

        for(var i = 0 ; i < outputSource_Components.length ; i++){
          for(var j = 0 ; j < inputTarget_Components.length ; j++){
            if (outputSource_Components[i].ontology_resource_id.trim().toUpperCase() === inputTarget_Components[j].ontology_resource_id.trim().toUpperCase()){
              common.push(outputSource_Components[i].ontology_resource_id.trim().toUpperCase())
            }
          }
        }
        return common
  } catch(ex){
    return []
  }
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

function saveAddNewEdgeData_Modal(){
  //console.log("Vao day")
  var addEdgeData_Modal = document.getElementById('addEdgeDataModal');
  addEdgeData_Modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";

  source_node_id = document.getElementById('sourceOperationNode').value
  target_node_id = document.getElementById('targetOperationNode').value

  //console.log(source_node_id)
  //console.log(target_node_id)
  source_node  = getFullNodeData_FromNodeID(source_node_id,ORIGIN_OPERATION_NODE_LIST,ADDED_OPERATION_NODES_LIST)
  target_node  = getFullNodeData_FromNodeID(target_node_id,ORIGIN_OPERATION_NODE_LIST,ADDED_OPERATION_NODES_LIST)

  var common = mapCommonComponents(source_node,target_node)

  console.log(target_node)
  if (!isEmpty(source_node_id) && !isEmpty(target_node_id)){
    edge_data = { group: "edges", data: { source: source_node_id, target: target_node_id, label:common.toString() } }
    cy.add(edge_data)
  }
  //console.log("Tai sao ko vao day????")
  return
}

function closeAddEdgeData_Modal(){
   var addEdgeData_modal = document.getElementById('addEdgeDataModal');
   addEdgeData_modal.style.display = "none";
   document.getElementById('cy').style.visibility = "visible";
}

function initNode(node){
  return {data : {id : node.id, name : node.name, faveShape: node.shape, type:node.type}}
}

function initEdge(edge){
  return {data: { source: edge.source, target: edge.target, label:edge.label} }
}

function AddNodeData(){
  var new_node =   { data: { id: 'n4',name:'WebService NEW',faveShape:'triangle' } };
  GLOBAL_NODES_DATA.push(new_node)
  DisplayWorkflow_Graphic();
}

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      console.log(file)
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      lines = e.target.result;
      var newArr = JSON.parse(lines);
      clearData();
      GLOBAL_WORKFLOW_PLAN_DATA = newArr
    }
  }

function setUpInitalState(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestInput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.input
  var initialState_Node_Temp = {}
  var id = ""
  var name = "Init State : "
  var type = "initial_state_node"
  for(var i = 0 ; i < requestInput.length ; i++){
    if (i < requestInput.length - 1) {
       id += requestInput[i].ontology_resource_id + "_"
       name += requestInput[i].name + ","
    } else {
       id = requestInput[i].ontology_resource_id
       name += requestInput[i].name
    }
  }
  initialState_Node_Temp.id = id
  initialState_Node_Temp.name = name
  initialState_Node_Temp.type = type
  initialState_Node_Temp.shape = "triangle"
  var initialState_Node = initNode(initialState_Node_Temp)
  return initialState_Node
}

function setUpOneOperationNode(operation){
  var operation_node_temp = {}
  operation_node_temp.id = operation.operation_name
  operation_node_temp.name = operation.operation_name
  operation_node_temp.type = "operation_node"
  operation_node_temp.shape = "ellipse"
  var operation_node = initNode(operation_node_temp)
  return operation_node
}

function setUpAllEdgesForOperationNodes(operation_nodes,plan){
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
      var edge = initEdge(edge_temp)
      operation_nodes_edges.push(edge)
    }
  }
  return operation_nodes_edges
}

function checkExisted(item, list){
  for(var i = 0 ; i < list.length ; i++){
    if (item.ontology_resource_id.trim().toUpperCase === list[i].ontology_resource_id.trim().toUpperCase()){
      return true
    }
  }
  return false
}

function setUpEdge_FromInit_ToFirstOperation(initNode,operation_nodes,origin_input,origin_first_operation){
  var edge_temp = {}
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

  var edge = initEdge(edge_temp)
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

  var edge = initEdge(edge_temp)
  return edge
}

function setUpAllOperationNodes(GLOBAL_WORKFLOW_PLAN_DATA){
   var plan = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan
   var operation_nodes = []
   for(var i = 0 ; i < plan.length ; i++){
     var operation_node = setUpOneOperationNode(plan[i])
     operation_nodes.push(operation_node)
   }
   return operation_nodes
}

function setUpGoalState(GLOBAL_WORKFLOW_PLAN_DATA){
  var requestOutput = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
  var goalState_Node_Temp = {}
  var id = ""
  var name = "Goal State : "
  var type = "goal_state_node"
  for(var i = 0 ; i < requestOutput.length ; i++){
    if (i < requestOutput.length - 1) {
       id += requestOutput[i].ontology_resource_id + "_"
       name += requestOutput[i].name + ","
    } else {
       id = requestOutput[i].ontology_resource_id
       name += requestOutput[i].name
    }
  }
  goalState_Node_Temp.id = id
  goalState_Node_Temp.name = name
  goalState_Node_Temp.type = type
  goalState_Node_Temp.shape = "triangle"
  var goalState_Node = initNode(goalState_Node_Temp)
  return goalState_Node

}

function interactiveNode(action,node){
  if (action.trim().toUpperCase() == "TAP"){
    console.log("Taped " + node.id())
  }
}


function DisplayWorkflow_Graphic(){
  /* Init GLOBAL_NODES_DATA object and GLOBAL_EDGES_DATA objects from workflow_plan.json or worflow_plan.js*/
  console.log(GLOBAL_WORKFLOW_PLAN_DATA)


  /* Add node for Input request */
  var initNode = setUpInitalState(GLOBAL_WORKFLOW_PLAN_DATA)
  GLOBAL_NODES_DATA.push(initNode)

  /* Add Goal State */
  var goalNode = setUpGoalState(GLOBAL_WORKFLOW_PLAN_DATA)
  GLOBAL_NODES_DATA.push(goalNode)

  /* Set up action */
  var operation_nodes = setUpAllOperationNodes(GLOBAL_WORKFLOW_PLAN_DATA)
  for(var i = 0 ; i < operation_nodes.length ; i++){
    GLOBAL_NODES_DATA.push(operation_nodes[i])
  }

  /* Set up all edge for operation nodes */
  var operation_nodes_edges = setUpAllEdgesForOperationNodes(operation_nodes,GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan)
  for(var i = 0 ; i < operation_nodes_edges.length ; i++){
    GLOBAL_EDGES_DATA.push(operation_nodes_edges[i])
  }

  var first_edge = setUpEdge_FromInit_ToFirstOperation(initNode,operation_nodes,ORIGIN_INIT_INPUT,ORIGIN_FIRST_OPERATION)
  GLOBAL_EDGES_DATA.push(first_edge)

  var last_edge = setUpEdge_FromLastOperation_ToGoal(goalNode,operation_nodes,ORIGIN_GOAL_OUTPUT,ORIGIN_LAST_OPERATION)
  GLOBAL_EDGES_DATA.push(last_edge)

  cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    layout: {
      name: 'dagre'
    },
    style: [
      {
        selector: 'node',
        style: {
          'content': 'data(name)',
          'label' : 'data(name)',
          'shape': 'data(faveShape)',
          'text-opacity': 3,
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color': '#11479e'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'label' : 'data(label)',
          'target-arrow-shape': 'triangle',
          'line-color': '#ad1a66',
          'target-arrow-color': '#ad1a66',
          'curve-style': 'bezier',
          'edge-text-rotation': 'autorotate',
          'font-size' : 12
        }
      }

    ],
    elements: {
      nodes: GLOBAL_NODES_DATA,
      edges: GLOBAL_EDGES_DATA
    },
  });

  cy.on('tap', 'node', function(evt){
      var node = evt.cyTarget;
      interactiveNode('tap',node)
  });
  /* Traditonal Right Click Context Menus */
  cy.contextMenus({
    menuItems: [
           {
              id: 'remove-node-edge',
              title: 'Remove node or edge',
              selector: 'node, edge',
              onClickFunction: function (event) {
                event.cyTarget.remove();
              },
              hasTrailingDivider: true
            },
            {
               id: 'info-node',
               title: 'Info node',
               selector: 'node',
               onClickFunction: function (event) {
                 //event.cyTarget.remove();
                 console.log("Info node")
               },
               hasTrailingDivider: true
            },
            {
               id: 'info-edge',
               title: 'Info edge',
               selector: 'edge',
               onClickFunction: function (event) {
                 //event.cyTarget.remove();
                 console.log("Info edge")
               },
               hasTrailingDivider: true
            },
            {
              id: 'add-node-operation',
              title: 'Add operation node',
              coreAsWell: true,
              onClickFunction: function (event) {
                openAddOperationNodeData_Modal();
                CURRENT_X = event.cyPosition.x;
                CURRENT_Y = event.cyPosition.y;
              }
            },
            {
              id: 'add-edge',
              title: 'Add edge',
              coreAsWell: true,
              onClickFunction: function (event) {
                  openAddEdgeData_Modal();
              }
            }
          ],
          menuItemClasses: ['custom-menu-item'],
          contextMenuClasses: ['custom-context-menu']
        });
}

$(function(){
  console.log("Ready to Go")

});
