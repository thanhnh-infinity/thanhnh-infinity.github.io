/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/

function request_PlanningOntologyEngine_List_Of_All_Resources(){
  $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/query",
        dataType: "application/x-www-urlencoded",
        async:false,
        data: { 
        		request : REQUEST_TYPE_GET_INSTANCES_OF_CLASS,
        		parser_engine : 1,
        		owl_class_uri : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources"
              },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
        	  jsonData = JSON.parse(data.responseText)
              GLOBAL_LIST_RESOURCES_ONTOLOGY = jsonData.list_instances
        },
        error: function (textStatus, errorThrown) {
        	 if (textStatus.status = 200){
        	 	jsonData = JSON.parse(textStatus.responseText)
        	 	console.log(JSON.parse(textStatus.responseText))
        	 	GLOBAL_LIST_RESOURCES_ONTOLOGY = jsonData.list_instances
        	 } else {
        	 	GLOBAL_LIST_RESOURCES_ONTOLOGY = []
        	 }
              
        }

  });
}

function request_HierarchyClasses_Of_Class(str_owl_class_uri){
	if (isEmpty(str_owl_class_uri)){
		str_owl_class_uri = "http://www.cs.nmsu.edu/~epontell/Ontologies/phylogenetic_methods.owl#operationClassification";
        GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = {}
	}

    if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/Ontologies/phylogenetic_methods.owl#operationClassification"){
        GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = {}   
    } else if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources"){
        GLOBAL_HIERARCHY_CLASSES_RESOURCE = {}
    } else {
        GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = {} 
    }
	
	$.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/query",
        dataType: "application/x-www-urlencoded",
        async:false,
        data: { 
        		request : REQUEST_TYPE_GET_HIERARCHY_SUBCLASS_OF_CLASS,
        		level : 0,
        		owl_class_uri : str_owl_class_uri
              },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
        	  jsonData = JSON.parse(data.responseText)
              if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/Ontologies/phylogenetic_methods.owl#operationClassification"){
                GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = jsonData
              } else if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources") {
                GLOBAL_HIERARCHY_CLASSES_RESOURCE = jsonData
              }
        },
        error: function (textStatus, errorThrown) {
        	 if (textStatus.status = 200){
        	 	jsonData = JSON.parse(textStatus.responseText)
        	 	console.log(JSON.parse(textStatus.responseText))
        	 	if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/Ontologies/phylogenetic_methods.owl#operationClassification"){
                    GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = jsonData
                } else if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources") {
                    GLOBAL_HIERARCHY_CLASSES_RESOURCE = jsonData
                }
        	 } else {
        	 	GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = {}
                GLOBAL_HIERARCHY_CLASSES_RESOURCE = {}
        	 }

        	 //console.log("Du lieu class")
        	 //console.log(GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED)     
        }
  });
}
