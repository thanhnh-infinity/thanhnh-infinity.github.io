/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


function initComponent_forNode_Ontology(){
  return {
    "name" : "",
    "ontology_param_name" : "",
    "ontology_param_link" : "",
    "ontology_resource_link" : "",
    "ontology_resource_id" : ""
  };
}

function initOperationNode_Ontology(){
  return {
    "operation_id" : 0,
    "operation_name" : "",
    "operation_of_web_service" : "phylotastic_webservice",
    "operation_ontology_link" : "",
    "operation_parameters" :
    {
      "input" : {
          "info" : {
             "data_format" : ""
          },
          "components" : [
          ]
      },
      "output" : {
          "info" : {
             "data_format" : ""
          },
          "components" : [
          ]
      }
    }
  };
}

function removeNodeByType(type){
  if (objectIsEmpty(GLOBAL_NODES_DATA) || GLOBAL_NODES_DATA.length <= 0){
    return 
  } else {
    for(var i = 0 ; i < GLOBAL_NODES_DATA.length ; i++){
       var node = GLOBAL_NODES_DATA[i]
       if (node.data.type === type) {
           GLOBAL_NODES_DATA.splice(i,1)
       }
    }
    return 
  }
}

function getResourceID_FromOWLLink(owl_resource_link){
  if (!isEmpty(owl_resource_link) && owl_resource_link.indexOf("#") > 0){
    var index = owl_resource_link.indexOf("#")
    return owl_resource_link.substring(index + 1,owl_resource_link.length)
  } else {
    return null
  }
}
function objectIsEmpty(data){
  return jQuery.isEmptyObject(data)
}
function isEmpty(data){
  if (data === "" || data === "undefined" || data === null || data === "UNDEFINED") {
    return true
  } else {
    return false
  }
}
function getHTMLdocOption_ListOfNodes(nodes){
  var html = ""
  for(var i = 0 ; i < nodes.length ; i++ ){
    html += "<option value=" + nodes[i].data.id + ">" + nodes[i].data.id + "</option>";
  }
  return html
}

function checkExisted(item, list){
  for(var i = 0 ; i < list.length ; i++){
    if (item.ontology_resource_id.trim().toUpperCase === list[i].ontology_resource_id.trim().toUpperCase()){
      return true
    }
  }
  return false
}

function checkExisted_Ontology_Link(item, list){
  for(var i = 0 ; i < list.length ; i++){
    if (item.trim().toUpperCase === list[i].ontology_link.trim().toUpperCase()){
      return true
    }
  }
  return false
}
