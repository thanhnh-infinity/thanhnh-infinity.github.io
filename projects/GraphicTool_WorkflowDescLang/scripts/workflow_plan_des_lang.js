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

  document.getElementById('cy').style.visibility = "visible";
  initGraphicFrame();
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
   var input_components_param_names = document.getElementsByName('txtInputComponentOntologyDataFormatID')
   var input_components_param_links = document.getElementsByName('txtInputComponentOntologyDataFormatURI')

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
   GLOBAL_NODES_DATA.push(initNode_forGraphic(new_node))


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



function closeAddInitialState_FromOntology_Modal(){
  var addInitialState_modal = document.getElementById('addInitialStateModal');
  addInitialState_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
}

function closeAddGoalState_FromOntology_Modal(){
  var addGoalState_modal = document.getElementById('addGoalStateModal');
  addGoalState_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
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
    console.log("Taped " + node.id())
  }
}

function DisplayWorkflow_Graphic_From_Source(PLAN_DATA){
  GLOBAL_NODES_DATA = []
  GLOBAL_EDGES_DATA = []

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

function saveGoalState_From_Ontology(){
  var selected_components_links = document.getElementsByName('goalState_Component')
  if (!isEmpty(selected_components_links) && selected_components_links.length > 0){
    var components= []

    if (!isEmpty(GLOBAL_LIST_RESOURCES_ONTOLOGY) && GLOBAL_LIST_RESOURCES_ONTOLOGY.length > 0){
      for(var i = 0 ; i < selected_components_links.length ; i++){
        var resource_uri = selected_components_links[i].value
        for(var j = 0 ; j < GLOBAL_LIST_RESOURCES_ONTOLOGY.length; j++){
          if (resource_uri.trim().toUpperCase() === GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri.trim().toUpperCase()){
            components.push(GLOBAL_LIST_RESOURCES_ONTOLOGY[j])
          }
        }
      }
    }

    /* End similator */
    var goal_state_node = {}
    goal_state_node.components = components

    displayGoalState_From_Ontology(goal_state_node)
  }

  var addGoalStateModal_modal = document.getElementById('addGoalStateModal');
  addGoalStateModal_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
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

function saveInitialState_From_Ontology(){
  var selected_components_links = document.getElementsByName('initialState_Component')
  if (!isEmpty(selected_components_links) && selected_components_links.length > 0){
    var components= []

    if (!isEmpty(GLOBAL_LIST_RESOURCES_ONTOLOGY) && GLOBAL_LIST_RESOURCES_ONTOLOGY.length > 0){
      for(var i = 0 ; i < selected_components_links.length ; i++){
        var resource_uri = selected_components_links[i].value
        for(var j = 0 ; j < GLOBAL_LIST_RESOURCES_ONTOLOGY.length; j++){
          if (resource_uri.trim().toUpperCase() === GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri.trim().toUpperCase()){
            components.push(GLOBAL_LIST_RESOURCES_ONTOLOGY[j])
          }
        }
      }
    }

    console.log(components)

    //if (isEmpty(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
    //    || jQuery.isEmptyObject(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)){
    //  console.log("Vao 1")
      var initial_state_node = {}
      initial_state_node.components = components
      //initial_state_node.components.push(component)
    //} else {
    //  console.log("Vao 2")
    //  initial_state_node = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
    //  initial_state_node.components.push.apply(initial_state_node.components,components)
    //}  

    displayInitialState_From_Ontology(initial_state_node)
  }

  var addInitialStateModal_modal = document.getElementById('addInitialStateModal');
  addInitialStateModal_modal.style.display = "none";
  document.getElementById('cy').style.visibility = "visible";
}

function drawGraphicFrame_with_CurrentNodesEdge(){
  initGraphicFrame()   
}

function update_Components_for_InitialState(htmlSelectNumberOfComponents_InitialState){
  var numberOfComponents = parseInt(htmlSelectNumberOfComponents_InitialState.value)
  var divInitialStateComponents = document.getElementById('divInitialStateComponents')
  divInitialStateComponents.innerHTML = ""
  for(var i = 0 ; i < numberOfComponents ; i++){
    var index_select = i + 1
    var innerHTMLString = '<p>Resource/Component '+ index_select +' : </p>'
    innerHTMLString += '<select name="initialState_Component">'
    innerHTMLString += '<option value=""></option>'
    if (!isEmpty(GLOBAL_LIST_RESOURCES_ONTOLOGY) && GLOBAL_LIST_RESOURCES_ONTOLOGY.length > 0){
      for(var j = 0 ; j < GLOBAL_LIST_RESOURCES_ONTOLOGY.length ; j++){
        innerHTMLString += '<option value="' + GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri +'">' +  GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri +'</option>'
      }
    }

    innerHTMLString += '</select>'
    divInitialStateComponents.innerHTML += innerHTMLString

  }
}

function update_Components_for_GoalState(htmlSelectNumberOfComponents_GoalState){
  var numberOfComponents = parseInt(htmlSelectNumberOfComponents_GoalState.value)
  var divGoalStateComponents = document.getElementById('divGoalStateComponents')
  divGoalStateComponents.innerHTML = ""
  for(var i = 0 ; i < numberOfComponents ; i++){
    var index_select = i + 1
    var innerHTMLString = '<p>Resource/Component '+ index_select +' : </p>'
    innerHTMLString += '<select name="goalState_Component">'
    innerHTMLString += '<option value=""></option>'
    if (!isEmpty(GLOBAL_LIST_RESOURCES_ONTOLOGY) && GLOBAL_LIST_RESOURCES_ONTOLOGY.length > 0){
      for(var j = 0 ; j < GLOBAL_LIST_RESOURCES_ONTOLOGY.length ; j++){
        innerHTMLString += '<option value="' + GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri +'">' +  GLOBAL_LIST_RESOURCES_ONTOLOGY[j].uri +'</option>'
      }
    }

    innerHTMLString += '</select>'
    divGoalStateComponents.innerHTML += innerHTMLString

  }
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
       message += "&nbsp;&nbsp;&nbsp;&nbsp;<i>ID</i> : <b>" + data.outputs[i] + "</b><br/>"
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

function displyInfo_Node(event,node_type){
   message = ""
   data = event.cyTarget._private.data
   if (node_type === "initial_state_node"){
     message = "----Initial State Node-----\n"
     message += "---------------------------\n"
     for(var i = 0 ; i < data.components.length ; i++){
       message += "-Component : " + data.components[i] + "\n"
       message += "-Data Format : " + data.data_formats[i] + "\n"
       message += "---------------------------\n"
     }
   } else if (node_type === "goal_state_node"){
     message = "----Goal State Node-----\n"
     message += "---------------------------\n"
     for(var i = 0 ; i < data.components.length ; i++){
       message += "-Component : " + data.components[i] + "\n"
       message += "-Data Format : " + data.data_formats[i] + "\n"
       message += "---------------------------\n"
     }
   } else if (node_type === "service_node"){
     message = "----A Class of Service-----\n"
     message += "- Name : " + data.id + "\n"
     message += "---------------------------\n"
     message += "--------INPUT--------------\n"
     for(var i = 0 ; i < data.inputs.length ; i++){
       message += "- Component : " + data.inputs[i].resource_id + "\n"
       message += "- Data Format : " + data.inputs[i].data_format_id + "\n"
       message += "- Map with : " + data.inputs[i].map_to_resource_id  + " of service operation " + data.inputs[i].map_from_service +"\n"
       message += "----------\n"
     }
     message += "---------------------------\n"
     message += "--------OUPUT--------------\n"
     for(var i = 0 ; i < data.outputs.length ; i++){
       message += "- Component : " + data.outputs[i] + "\n"
       message += "- Data Format : " + data.outputs[i].data_format_id + "\n"
       message += "----------\n"
     }
   }
   alert(message)
   /*
   $.msgBox({
    title:"Information",
    content:message
   });
   */
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
                event.cyTarget.remove();
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

  console.log("Ready to Go")
  initGraphicFrame();


});


