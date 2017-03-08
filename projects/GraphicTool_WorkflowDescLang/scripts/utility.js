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
