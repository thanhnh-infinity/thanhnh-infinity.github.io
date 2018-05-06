/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/
function isExistedInitGoalComsList(item,list){
  for(var index = 0 ; index < list.components.length; index++){
        if (item.trim().toUpperCase() === list.components[index].local_name.trim().toUpperCase()){
            return true
        }
  }
  return false
}

function isExistedNormalList(item,list){
  for(var index = 0 ; index < list.length; index++){
        if (item.trim().toUpperCase() === list[index].trim().toUpperCase()){
            return true
        }
  }
  return false
}


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
    if (nodes[i].data.type === "service_node"){
      html += "<option value=" + nodes[i].data.id + ">" + nodes[i].data.id + "</option>";
    } else if (nodes[i].data.type === "initial_state_node"){
      html += "<option value=" + nodes[i].data.id + "> Init State: " + nodes[i].data.id + "</option>";
    } else if (nodes[i].data.type === "goal_state_node"){
      html += "<option value=" + nodes[i].data.id + "> Goal State: " + nodes[i].data.id + "</option>";
    }  
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

function seeToast(message, duration, type) {
    //toastr.remove();
     if (type === "INCLUSION"){
        toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-right",
          "preventDuplicates": true,
          "onclick": null,
          "timeOut": "50000",
          "extendedTimeOut": "0",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"

        };
        toastr.success(message); 
     } else if (type="AVOIDANCE"){

        toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-left",
          "preventDuplicates": true,
          "onclick": null,
          "timeOut": "50000",
          "extendedTimeOut": "0",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"

        };

        toastr.warning(message); 
     }
     
};
