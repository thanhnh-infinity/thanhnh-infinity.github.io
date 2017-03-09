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
function getResourceID_FromOWLLink(owl_resource_link){
  if (!isEmpty(owl_resource_link) && owl_resource_link.indexOf("#") > 0){
    var index = owl_resource_link.indexOf("#")
    return owl_resource_link.substring(index + 1,owl_resource_link.length)
  } else {
    return null
  }
}
function isEmpty(data){
  if (data === "" || data === "undefined" || data === null || data === "UNDEFINED"){
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
