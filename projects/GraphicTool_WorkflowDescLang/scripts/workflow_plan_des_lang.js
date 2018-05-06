/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/

function reload(){
   console.log("Re-focus")
   cy.center()
   cy.fit()
}

function clearData(){
  GLOBAL_NODES_DATA = [];
  GLOBAL_EDGES_DATA = [];
  GLOBAL_INITIAL_STATE_ONTOLOGY = {};
  GLOBAL_GOAL_STATE_ONTOLOTY = {};
  CONSIDER_ADDED_OPERATION_CLASS = {};

  GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = {};
  GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = {};

  ADDED_OPERATION_NODES_LIST = []
  AVOIDANCE_OPERATION_NODES_LIST = []
  
  document.getElementById('cy').style.visibility = "visible";
  initGraphicFrame();
  toastr.remove();
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
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource ID :  <text name='txtOutputComponentOntologyResourceID'>" + component.resource_ontology_id + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource URI :  <text name='txtOutputComponentOntologyResourceLink'>" + component.resource_ontology_uri + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Data Format ID :  <text name='txtOutputComponentOntologyDataFormatID'>" + component.resource_data_format_id + "</text><br/>"
        html += "&nbsp;&nbsp;&nbsp;&nbsp;Data Format URI :  <text name='txtOutputComponentOntologyDataFormatURI'>" + component.resource_data_format_uri + "</text><br/>"
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
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Ontology Resource URI :  <text name='txtInputComponentOntologyResourceLink'>" + component.resource_ontology_uri + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Data Format ID :  <text name='txtInputComponentOntologyDataFormatID'>" + component.resource_data_format_id + "</text><br/>"
      html += "&nbsp;&nbsp;&nbsp;&nbsp;Data Format URI :  <text name='txtInputComponentOntologyDataFormatURI'>" + component.resource_data_format_uri + "</text><br/>"
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

function addArrayRecursive(ARRAY,SUB){
  if (isEmpty(SUB) || SUB.length <= 0){
    return
  } else {
    for(var i = 0 ; i < SUB.length ; i++){
      var operation_object = {}
      operation_object["parent_class_uri"] = SUB[i].parent_class_uri
      operation_object["parent_class_name"] = SUB[i].parent_class_name
      operation_object["class_ontology_name"] = SUB[i].class_ontology_name
      operation_object["class_ontology_uri"] = SUB[i].class_ontology_uri
      operation_object["level"] = SUB[i].level
      ARRAY.push(operation_object)
      if (isEmpty(SUB.subclasses) || SUB.subclasses <= 0){
        continue
      } else {
        //console.log(i)
        addArrayRecursive(ARRAY,SUB[i].subclasses)
      }
    }
  }
}

function saveAddOperationClass_Modal(){
  if(!isEmpty(CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri)){
     var addOperationClass_modal = document.getElementById('addOperationClassModal');
     addOperationClass_modal.style.display = "none";
     document.getElementById('cy').style.visibility = "visible";

     var data = {
         group: 'nodes',
         id: getResourceID_FromOWLLink(CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri),
         name: getResourceID_FromOWLLink(CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri),
         type:'service_node',
         faveShape:'ellipse'
     };

     
     var new_node = {}
     new_node.id = getResourceID_FromOWLLink(CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri),
     new_node.name = getResourceID_FromOWLLink(CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri),
     new_node.shape = 'ellipse'
     new_node.type = 'service_node'
     GLOBAL_NODES_DATA.push(initNode_forGraphic(new_node))
     

     cy.add({
         data: data,
         position: {
             x: CURRENT_X,
             y: CURRENT_Y
         }
     });
  } else {
    alert("You should select class of operation want to add")
    return
  }
}

function openAddGoalState_FromOntology_Modal_Hierarchy(){
    /* Set up view model for operation class hierarchy */
    var divDisplayGoalState_ResourcesClassHierarchy = document.getElementById("divDisplayGoalState_ResourcesClassHierarchy")
    /* Fix - should has in API */
    var numberOfLevel = 10
    var stringInnerHtml = ""
    for(var i = 0 ; i < numberOfLevel; i++){
      stringInnerHtml += '<div id="div_goal_resource_level_' + i + '"></div>'
    }
    divDisplayGoalState_ResourcesClassHierarchy.innerHTML = stringInnerHtml

    /* Add all operation class object to a flat array */
    ARRAY_RESOURCES_CLASSES_FLAT = []
    var resource_object = {}
    resource_object["parent_class_uri"] = "OWL::THING"
    resource_object["parent_class_name"] = "OWL::THING"
    resource_object["class_ontology_name"] = GLOBAL_HIERARCHY_CLASSES_RESOURCE.class_ontology_name
    resource_object["class_ontology_uri"] = GLOBAL_HIERARCHY_CLASSES_RESOURCE.class_ontology_uri
    resource_object["level"] = 0
    ARRAY_RESOURCES_CLASSES_FLAT.push(resource_object)
    addArrayRecursive(ARRAY_RESOURCES_CLASSES_FLAT,GLOBAL_HIERARCHY_CLASSES_RESOURCE.subclasses)
  

    /* Display operation class for level 0 */
    var div_goal_resource_level_0 = document.getElementById("div_goal_resource_level_0")
    stringHTML = '<select id="select_goal_resource_level_0" onchange="updateFollow_Resouces_Goal_ClassBy(this,0);">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_RESOURCES_CLASSES_FLAT.length ; i++){
      var considerResourceObj = ARRAY_RESOURCES_CLASSES_FLAT[i]
      if (considerResourceObj.level == 0 || considerResourceObj.parent_class_uri === "OWL::THING"){  
        stringHTML += '<option value="' + considerResourceObj.class_ontology_uri + '">' + considerResourceObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    div_goal_resource_level_0.innerHTML = stringHTML

    /* End to feed */
    document.getElementById('cy').style.visibility = "hidden";
    var addInitialStateModal_Hierarchy = document.getElementById('addGoalStateModal_Hierarchy');
    addInitialStateModal_Hierarchy.style.display = "block";
}

function openAddInitialState_FromOntology_Modal_Hierarchy(){
    /* Set up view model for operation class hierarchy */
    var divDisplayInitialState_ResourcesClassHierarchy = document.getElementById("divDisplayInitialState_ResourcesClassHierarchy")
    /* Fix - should has in API */
    var numberOfLevel = 10
    var stringInnerHtml = ""
    for(var i = 0 ; i < numberOfLevel; i++){
      stringInnerHtml += '<div id="div_initial_resource_level_' + i + '"></div>'
    }
    divDisplayInitialState_ResourcesClassHierarchy.innerHTML = stringInnerHtml

    /* Add all operation class object to a flat array */
    ARRAY_RESOURCES_CLASSES_FLAT = []
    var resource_object = {}
    resource_object["parent_class_uri"] = "OWL::THING"
    resource_object["parent_class_name"] = "OWL::THING"
    resource_object["class_ontology_name"] = GLOBAL_HIERARCHY_CLASSES_RESOURCE.class_ontology_name
    resource_object["class_ontology_uri"] = GLOBAL_HIERARCHY_CLASSES_RESOURCE.class_ontology_uri
    resource_object["level"] = 0
    ARRAY_RESOURCES_CLASSES_FLAT.push(resource_object)
    addArrayRecursive(ARRAY_RESOURCES_CLASSES_FLAT,GLOBAL_HIERARCHY_CLASSES_RESOURCE.subclasses)
  

    //console.log(ARRAY_RESOURCES_CLASSES_FLAT) 
    /* Display operation class for level 0 */
    var div_initial_resource_level_0 = document.getElementById("div_initial_resource_level_0")
    stringHTML = '<select id="select_initial_resource_level_0" onchange="updateFollow_Resouces_ClassBy(this,0);">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_RESOURCES_CLASSES_FLAT.length ; i++){
      var considerResourceObj = ARRAY_RESOURCES_CLASSES_FLAT[i]
      if (considerResourceObj.level == 0 || considerResourceObj.parent_class_uri === "OWL::THING"){  
        stringHTML += '<option value="' + considerResourceObj.class_ontology_uri + '">' + considerResourceObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    div_initial_resource_level_0.innerHTML = stringHTML

    /* End to feed */
    document.getElementById('cy').style.visibility = "hidden";
    var addInitialStateModal_Hierarchy = document.getElementById('addInitialStateModal_Hierarchy');
    addInitialStateModal_Hierarchy.style.display = "block";
}

function openAdd_ServiceClassData_Modal(){
    /* Set up view model for operation class hierarchy */
    var div_display_operation_class = document.getElementById("divDisplayOperationClassHierarchy")
    /* Fix - should has in API */
    var numberOfLevel = 10
    var stringInnerHtml = ""
    for(var i = 0 ; i < numberOfLevel; i++){
      stringInnerHtml += '<div id="div_operation_class_level_' + i + '"></div>'
    }

    div_display_operation_class.innerHTML = stringInnerHtml

    /* Add all operation class object to a flat array */
    ARRAY_OPERATION_CLASS_FLAT = []
    var operation_object = {}
    operation_object["parent_class_uri"] = "OWL::THING"
    operation_object["parent_class_name"] = "OWL::THING"
    operation_object["class_ontology_name"] = GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED.class_ontology_name
    operation_object["class_ontology_uri"] = GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED.class_ontology_uri
    operation_object["level"] = 0
    ARRAY_OPERATION_CLASS_FLAT.push(operation_object)
    addArrayRecursive(ARRAY_OPERATION_CLASS_FLAT,GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED.subclasses)
  
    /* Display operation class for level 0 */
    var div_display_operation_class_level_0 = document.getElementById("div_operation_class_level_0")
    stringHTML = '<select id="select_operation_class_level_0" onchange="updateFollowClassBy(this,0);">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_OPERATION_CLASS_FLAT.length ; i++){
      var considerOperationObj = ARRAY_OPERATION_CLASS_FLAT[i]
      if (considerOperationObj.level == 0 || considerOperationObj.parent_class_uri === "OWL::THING"){  
        stringHTML += '<option value="' + considerOperationObj.class_ontology_uri + '">' + considerOperationObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    div_display_operation_class_level_0.innerHTML = stringHTML

    /* End to feed */
    document.getElementById('cy').style.visibility = "hidden";
    var addOperationClass_modal = document.getElementById('addOperationClassModal');
    addOperationClass_modal.style.display = "block"; 
}

function updateFollow_Resouces_Goal_ClassBy(resourcesClassObj,level){
    level = level + 1

    checkData = false
    var div_display_resource_class_level_current = document.getElementById("div_goal_resource_level_" + level)

    CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri = resourcesClassObj.value

    /* update for lower classes */
    
    for(var i = level; i < 10 ; i++){
      //console.log("Clear from " + level)
      document.getElementById("div_goal_resource_level_" + level).innerHTML = ""
    }

    stringHTML = '<p>Ontology Sub-Class Level ' + level +'</p>'
    stringHTML += '<select id="select_goal_resource_level_"' + level + ' onchange="updateFollow_Resouces_Goal_ClassBy(this,'+ level +');">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_RESOURCES_CLASSES_FLAT.length ; i++){
      var considerResourceObj = ARRAY_RESOURCES_CLASSES_FLAT[i]
      if (considerResourceObj.parent_class_uri.trim().toUpperCase() === resourcesClassObj.value.trim().toUpperCase()){  
        checkData = true
        stringHTML += '<option value="' + considerResourceObj.class_ontology_uri + '">' + considerResourceObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    stringHTML += '<br/>'

    if (checkData==true){
      div_display_resource_class_level_current.innerHTML = stringHTML  
    } else {
      div_display_resource_class_level_current.innerHTML = ""
    }
}

function updateFollow_Resouces_ClassBy(resourcesClassObj,level){
    level = level + 1

    checkData = false
    var div_display_resource_class_level_current = document.getElementById("div_initial_resource_level_" + level)

    CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri = resourcesClassObj.value

    /* update for lower classes */
    
    for(var i = level; i < 10 ; i++){
      //console.log("Clear from " + level)
      document.getElementById("div_initial_resource_level_" + level).innerHTML = ""
    }

    stringHTML = '<p>Ontology Sub-Class Level ' + level +'</p>'
    stringHTML += '<select id="select_initial_resource_level_"' + level + ' onchange="updateFollow_Resouces_ClassBy(this,'+ level +');">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_RESOURCES_CLASSES_FLAT.length ; i++){
      var considerResourceObj = ARRAY_RESOURCES_CLASSES_FLAT[i]
      if (considerResourceObj.parent_class_uri.trim().toUpperCase() === resourcesClassObj.value.trim().toUpperCase()){  
        checkData = true
        stringHTML += '<option value="' + considerResourceObj.class_ontology_uri + '">' + considerResourceObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    stringHTML += '<br/>'

    if (checkData==true){
      div_display_resource_class_level_current.innerHTML = stringHTML  
    } else {
      div_display_resource_class_level_current.innerHTML = ""
    }
}

function updateFollowClassBy(operationClassObj,level){
    level = level + 1

    checkData = false
    var div_display_operation_class_level_current = document.getElementById("div_operation_class_level_" + level)

    CONSIDER_ADDED_OPERATION_CLASS.class_ontology_uri = operationClassObj.value

    /* update for lower classes */
    
    for(var i = level; i < 10 ; i++){
      //console.log("Clear from " + level)
      document.getElementById("div_operation_class_level_" + level).innerHTML = ""
    }

    stringHTML = '<p>Ontology Sub-Class Level ' + level +'</p>'
    stringHTML += '<select id="select_operation_class_level_"' + level + ' onchange="updateFollowClassBy(this,'+ level +');">'
    stringHTML += '<option value=""></option>'
    for(var i = 0 ; i < ARRAY_OPERATION_CLASS_FLAT.length ; i++){
      var considerOperationObj = ARRAY_OPERATION_CLASS_FLAT[i]
      if (considerOperationObj.parent_class_uri.trim().toUpperCase() === operationClassObj.value.trim().toUpperCase()){  
        checkData = true
        stringHTML += '<option value="' + considerOperationObj.class_ontology_uri + '">' + considerOperationObj.class_ontology_uri +'</option>'
      }
    }
    stringHTML += '</select>'
    stringHTML += '<br/>'

    if (checkData==true){
      div_display_operation_class_level_current.innerHTML = stringHTML  
    } else {
      div_display_operation_class_level_current.innerHTML = ""
    }    
}

function closeAddOperationNodeData_Modal(){
  var addOperationNodeData_modal = document.getElementById('addOperationNodeDataModal');
  addOperationNodeData_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
  return;
}

function closeAddOperationClass_Modal(){
  var addOperationClass_modal = document.getElementById('addOperationClassModal');
  addOperationClass_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
  return;
}

function closeAddGoalState_Modal_Hierarchy(){
  var addGoalStateModal_Hierarchy = document.getElementById('addGoalStateModal_Hierarchy');
  addGoalStateModal_Hierarchy.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
  return;
}

function closeAddInitialState_Modal_Hierarchy(){
  var addInitialState_modal_Hierarchy = document.getElementById('addInitialStateModal_Hierarchy');
  addInitialState_modal_Hierarchy.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
  return;
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

        console.log(Output_Source_Node)
        console.log(Input_Target_Node)

        var outputSource_Components = Output_Source_Node.service_parameters.output.components;
        var inputTarget_Components = Input_Target_Node.service_parameters.input.components;

        console.log(outputSource_Components)
        console.log(inputTarget_Components)

        for(var i = 0 ; i < outputSource_Components.length ; i++){
          for(var j = 0 ; j < inputTarget_Components.length ; j++){
            if ((outputSource_Components[i].resource_ontology_id.trim().toUpperCase() === inputTarget_Components[j].resource_ontology_id.trim().toUpperCase())
                && (outputSource_Components[i].resource_data_format.trim().toUpperCase() === inputTarget_Components[j].resource_data_format.trim().toUpperCase())){
              common.push(outputSource_Components[i].resource_ontology_id.trim().toUpperCase())
            }
          }
        }
        return common
  } catch(ex){
    console.log(ex)
    return []
  }
}

function openAddGoalState_FromOntology_Modal(){
  document.getElementById('cy').style.visibility = "hidden";
  var addGoalState_modal = document.getElementById('addGoalStateModal');
  addGoalState_modal.style.display = "block";
}

function openAddInitialState_FromOntology_Modal(){
  document.getElementById('cy').style.visibility = "hidden";
  var addInitialState_modal = document.getElementById('addInitialStateModal');
  addInitialState_modal.style.display = "block";
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

  //console.log(source_node)

  var common = mapCommonComponents(source_node,target_node)

  console.log(common)

  if (!isEmpty(source_node_id) && !isEmpty(target_node_id)){
    if (!isEmpty(common) && common.length > 0){
      edge_data = { group: "edges", data: { source: source_node_id, target: target_node_id, label:common.toString() } }
      cy.add(edge_data)
    } else {
      $.msgBox({
        title:"Warning",
        content:"This connection cannot be set up because no common exchanging resource between 2 nodes",
        type:"warning"
       });
    }
  } else {
    $.msgBox({
      title:"Warning",
      content:"You have to select source and target service node",
      type:"warning"
     }); 
  }
  
}

function closeAddEdgeData_Modal(){
   var addEdgeData_modal = document.getElementById('addEdgeDataModal');
   addEdgeData_modal.style.display = "none";
   document.getElementById('cy').style.visibility = "visible";
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


function interactiveNode(action,node){
  if (action.trim().toUpperCase() == "TAP"){
    //console.log("Taped " + node.id())
  }
}

function DisplayWorkflow_Graphic_From_Source(PLAN_DATA){
  GLOBAL_NODES_DATA = []
  GLOBAL_EDGES_DATA = []

  ORIGIN_OPERATION_NODE_LIST = PLAN_DATA.workflow_plan[0].full_plan

  /* Add node for Input request */
  var initNode = setUpInitialState_From_WorkFlow(PLAN_DATA)
  GLOBAL_NODES_DATA.push(initNode)

  /* Add Goal State */
  var goalNode = setUpGoalState_From_WorkFlow(PLAN_DATA)
  GLOBAL_NODES_DATA.push(goalNode)

  /* Set up action */
  var service_nodes = setUpAll_ServiceNodes_From_WorkFlow(PLAN_DATA)
  //console.log(service_nodes)
  for(var i = 0 ; i < service_nodes.length ; i++){
    GLOBAL_NODES_DATA.push(service_nodes[i])
  }

  /* Set up all edge for operation nodes */
  
  var service_edges = setUpAllEdgesFor_ServiceNodes_From_WorkFlow(service_nodes,PLAN_DATA.workflow_plan[0].full_plan,initNode,goalNode)
  for(var i = 0 ; i < service_edges.length ; i++){
    GLOBAL_EDGES_DATA.push(service_edges[i])
  }

  /* Check that an node have to have both at least one in and out edge */
  var BLACK_LIST_NODE = []

  for(var i = 0 ; i < GLOBAL_NODES_DATA.length ; i++){
      var considerNode = GLOBAL_NODES_DATA[i]
      
      if (considerNode.data.type == "service_node"){
        var kt_in = false
        var kt_out = false
        for(var j = 0 ; j < GLOBAL_EDGES_DATA.length ; j++){
          
          var source = GLOBAL_EDGES_DATA[j].data.source
          var target = GLOBAL_EDGES_DATA[j].data.target

          if (considerNode.data.id.trim().toUpperCase() === source.trim().toUpperCase()){       
            kt_out = true
          }
          if (considerNode.data.id.trim().toUpperCase() === target.trim().toUpperCase()){          
            kt_in = true
          }
        }

        if (!kt_in || !kt_out){
          BLACK_LIST_NODE.push(considerNode.data.id)
          GLOBAL_NODES_DATA.splice(i,1)
        }

        for(var j = 0 ; j < GLOBAL_EDGES_DATA.length ; j++){
           var target = GLOBAL_EDGES_DATA[j].data.target
           var dleIndex = BLACK_LIST_NODE.indexOf(target)
           if (dleIndex > -1){
               GLOBAL_EDGES_DATA.splice(j,1)
           }  
        }
      }
  }
  

  initGraphicFrame()
}

function DisplayWorkflow_Graphic(){
  /* Init GLOBAL_NODES_DATA object and GLOBAL_EDGES_DATA objects from workflow_plan.json or worflow_plan.js*/
  console.log(GLOBAL_WORKFLOW_PLAN_DATA)


  /* Add node for Input request */
  var initNode = setUpInitialState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA)
  GLOBAL_NODES_DATA.push(initNode)

  /* Add Goal State */
  var goalNode = setUpGoalState_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA)
  GLOBAL_NODES_DATA.push(goalNode)

  /* Set up action */
  var service_nodes = setUpAll_ServiceNodes_From_WorkFlow(GLOBAL_WORKFLOW_PLAN_DATA)
  for(var i = 0 ; i < service_nodes.length ; i++){
    GLOBAL_NODES_DATA.push(service_nodes[i])
  }

  /* Set up all edge for operation nodes */
  var service_edges = setUpAllEdgesFor_ServiceNodes_From_WorkFlow(service_edges,GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].full_plan,initNode,goalNode)
  for(var i = 0 ; i < service_edges.length ; i++){
    GLOBAL_EDGES_DATA.push(service_edges[i])
  }
  initGraphicFrame()
}


function saveAddGoalState_Modal_Hierarchy(){
   if(!isEmpty(CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri)){
      var addGoalStateModal_Hierarchy = document.getElementById('addGoalStateModal_Hierarchy');
      addGoalStateModal_Hierarchy.style.display = "none";
      document.getElementById('cy').style.visibility = "visible";
      document.getElementById('addGoalStateModal_Hierarchy').style.visible = "none"
      
      var goal_state_node = {}
      //console.log(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
      if (!isEmpty(GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && !objectIsEmpty(GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && (GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE.components.length > 0)){
         goal_state_node = GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
      } else {
         goal_state_node.components = []
      } 

      var e =  document.getElementById("selectGoalState_DataFormatClasses");
      var selected_data_format = e.options[e.selectedIndex].value
      if (isEmpty(selected_data_format)){
        selected_data_format = "unknown"
      }
      
      var an_goal_component = {"local_name":getResourceID_FromOWLLink(CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri),"uri":CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri,"data_format":selected_data_format}
      
      goal_state_node.components.push(an_goal_component)

      CONSIDER_ADDED_RESOURCE_CLASS = {}
      
      displayGoalState_From_Ontology(goal_state_node)
     
  } else {
    alert("You should select class of resource want to add")
    return
  }
}



function saveAddInitialState_Modal_Hierarchy(){
  if(!isEmpty(CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri)){
      var addInitialStateModal_Hierarchy = document.getElementById('addInitialStateModal_Hierarchy');
      addInitialStateModal_Hierarchy.style.display = "none";
      //console.log(CONSIDER_ADDED_RESOURCE_CLASS)
      document.getElementById('cy').style.visibility = "visible";
      document.getElementById('addInitialStateModal_Hierarchy').style.visible = "none"
  
      var initial_state_node = {}
      //console.log(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
      if (!isEmpty(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && !objectIsEmpty(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && (GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE.components.length > 0)){
         initial_state_node = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
      } else {
         initial_state_node.components = []
      } 
      
      var e =  document.getElementById("selectInitialState_DataFormatClasses");
      var selected_data_format = e.options[e.selectedIndex].value
      if (isEmpty(selected_data_format)){
        selected_data_format = "unknown"
      }

      var an_initial_component = {"local_name":getResourceID_FromOWLLink(CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri),"uri":CONSIDER_ADDED_RESOURCE_CLASS.class_ontology_uri,"data_format":selected_data_format}
      
    
      initial_state_node.components.push(an_initial_component)

      CONSIDER_ADDED_RESOURCE_CLASS = {}
      displayInitialState_From_Ontology(initial_state_node)
      
  } else {
    alert("You should select class of resource want to add")
    return
  }
}


function drawGraphicFrame_with_CurrentNodesEdge(){
  initGraphicFrame()   
}



function displayInfo_Node_V2(event, node_type){
  data = event.cyTarget._private.data
  message = ""
  info = ""
  if (node_type === "initial_state_node"){
     info = "Initial State Node"
     message = "There are " + data.components.length + " components in initial state<br/>"
     message += "<hr/>"
     for(var i = 0 ; i < data.components.length ; i++){
       message += "<i>ID</i> : <b>" + data.components[i] + "</b><br/>"
       message += "<i>Format</i> : <b>" + data.data_formats[i] + "</b><br/>"
       message += "<hr/>"
     }
  } else if (node_type === "goal_state_node"){
     info = "Goal State Node"
     message = "There are " + data.components.length + " components in goal state<br/>"
     message += "<hr/>"
     for(var i = 0 ; i < data.components.length ; i++){
       message += "<i>ID</i> : <b>" + data.components[i] + "</b><br/>"
       message += "<i>Format</i> : <b>" + data.data_formats[i] + "</b><br/>"
       message += "<hr/>"
     }
   } else if (node_type === "service_node"){
     info = "Concrete Service Node"
     message += "<br/><i>Name</i> : <b>" + data.id + "</b><br/>"
     message += "<hr/>"
     message += "<b>INPUT COMPONENTS (" + data.inputs.length +")</b><br/>"
     message += "<hr/>"
     for(var i = 0 ; i < data.inputs.length ; i++){
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>ID</i> : <b>" + data.inputs[i].resource_id + "</b><br/>"
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>Format</i> : <b>" + data.inputs[i].data_format_id + "</b><br/>"
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>Map with</i> : <b>" + data.inputs[i].map_to_resource_id  + "</b> of service operation <b>" + data.inputs[i].map_from_service +"</b><br/>"
       message += "<hr/>"
     }

    message += "<b>OUTPUT COMPONENTS (" + data.outputs.length + ")<br/></b>"
    message += "<hr/>"
    for(var i = 0 ; i < data.outputs.length ; i++){
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>ID</i> : <b>" + data.outputs[i].resource_id + "</b><br/>"
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>Format</i> : <b>" + data.outputs[i].data_format_id + "</b><br/>"
       message += "<hr/>"
    }
   }


  $.msgBox({
    title:info,
    content:message,
    type:"info"
   }); 
}

function removeOperationNode(event){
    /* Remove out of screen */
    event.cyTarget.remove();
    /* if this service is in inclusion list => Remove */
    var index = ADDED_OPERATION_NODES_LIST.indexOf(event.cyTarget._private.data.id);
    if (index > -1){
      ADDED_OPERATION_NODES_LIST.splice(index,1);
    }
}

function initGraphicFrame(){
  cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    layout: {
      name: 'dagre',
      rankDir:'LR',
      ranker:'network-simplex'
      //name:'preset'
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
          'font-size':6,
          //'background-color': '#11479e',
          'background-color': 'data(color)',
          'color' : 'data(text_color)',
          'font-weight':'bold'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 1,
          'label' : 'data(label)',
          'target-arrow-shape': 'triangle',
          'line-color': '#ad1a66',
          'target-arrow-color': '#ad1a66',
          'curve-style': 'bezier',
          'text-margin-y': 7,
          'text-margin-x' : 5,
          'text-halign':'center',
          'edge-text-rotation': 'autorotate',
          'font-size' : 5,
          'color':'#ad1a66'
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

  cy.on('taphold','node',function(event){
      if (event.cyTarget._private.data.type === "initial_state_node"){
       displayInfo_Node_V2(event,"initial_state_node")
     } else if (event.cyTarget._private.data.type === "goal_state_node"){
       displayInfo_Node_V2(event,"goal_state_node")
     } else {
       displayInfo_Node_V2(event,"service_node")
     }
  });

  /* Traditonal Right Click Context Menus */
  cy.contextMenus({
    menuItems: [
           {
              id: 'remove-node-edge',
              title: 'Remove node or edge',
              selector: 'node, edge',
              onClickFunction: function (event) {
                //event.cyTarget.remove();
                removeOperationNode(event);

              },
              hasTrailingDivider: true
            },
            {
               id: 'info-node',
               title: 'Info node',
               selector: 'node',
               onClickFunction: function (event) {
                   console.log(event)
                   if (event.cyTarget._private.data.type === "initial_state_node"){
                     displayInfo_Node_V2(event,"initial_state_node")
                   } else if (event.cyTarget._private.data.type === "goal_state_node"){
                     displayInfo_Node_V2(event,"goal_state_node")
                   } else {
                     displayInfo_Node_V2(event,"service_node")
                   }
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
              title: 'Add Concrete Service Node',
              coreAsWell: true,
              onClickFunction: function (event) {
                openAddOperationNodeData_Modal();
                CURRENT_X = event.cyPosition.x;
                CURRENT_Y = event.cyPosition.y;
              }
            },
            /*
            {
              id: 'add-node-operation-class',
              title: 'Add a Class of Service Node',
              coreAsWell: true,
              onClickFunction: function (event) {
                openAdd_ServiceClassData_Modal();
                CURRENT_X = event.cyPosition.x;
                CURRENT_Y = event.cyPosition.y;
              }
            },
            */
            {
              id: 'add-node-initial-state-hierarchy',
              title: 'Add/Update Inital State Node Data',
              coreAsWell: true,
              onClickFunction: function (event) {
                openAddInitialState_FromOntology_Modal_Hierarchy();
                CURRENT_X = event.cyPosition.x;
                CURRENT_Y = event.cyPosition.y;
              }
            },

             {
              id: 'add-node-goal-state-hierarchy',
              title: 'Add/Update Goal State Node Data',
              coreAsWell: true,
              onClickFunction: function (event) {
                openAddGoalState_FromOntology_Modal_Hierarchy();
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

  console.log("Make API to get list of hierarchy of phylotastic resources class ")
  request_HierarchyClasses_Of_Class("http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources");

  console.log("Make API to get hierarchy classes of operation classification class for add Operation class")
  request_HierarchyClasses_Of_Class("");

  console.log("Build up data for model");
  buildUpTreeView_Resources();

  console.log("Ready to Go")
  initGraphicFrame();


});


