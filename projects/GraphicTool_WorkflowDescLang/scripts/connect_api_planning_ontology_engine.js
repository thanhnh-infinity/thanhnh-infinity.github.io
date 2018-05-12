/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/

function request_PlanningOntologyEngine_List_Of_All_Resources(){
  //window.localStorage.setItem("ONTOLOGY_LIST_OF_HIERARCHY_CLASSES_OF_SERVICES","")  
  $.ajax({
        type: "GET",
        url: ONTOLOGY_API_ROOT,
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
              //window.localStorage.setItem(ONTOLOGY_LIST_RESOURCES,JSON.stringify(GLOBAL_LIST_RESOURCES_ONTOLOGY))  
        },
        error: function (textStatus, errorThrown) {
             console.log(textStatus)
        	 if (textStatus.status = 200){
        	 	jsonData = JSON.parse(textStatus.responseText)
        	 	console.log(JSON.parse(textStatus.responseText))
        	 	//GLOBAL_LIST_RESOURCES_ONTOLOGY = JSON.parse(window.localStorage.getItem(ONTOLOGY_LIST_RESOURCES))
        	 } else {
        	 	//GLOBAL_LIST_RESOURCES_ONTOLOGY = JSON.parse(window.localStorage.getItem(ONTOLOGY_LIST_RESOURCES))
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
        url: ONTOLOGY_API_ROOT,
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
                console.log(GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED)
                window.localStorage.setItem('SERVICES_HIERARCHY_STRUC_CLASSES_INSTANCES_ALL',JSON.stringify(jsonData))
              } else if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources") {
                GLOBAL_HIERARCHY_CLASSES_RESOURCE = jsonData
                console.log("Ngon o day")
                console.log(GLOBAL_HIERARCHY_CLASSES_RESOURCE)
                window.localStorage.setItem('RESOURCES_CLASSES_STRUC_ALL',JSON.stringify(jsonData))
              }
        },
        error: function (textStatus, errorThrown) {
             console.log(textStatus)
        	 if (textStatus.status == 200 && textStatus.readyState == 4 && textStatus.statusText == "OK"){
        	 	jsonData = JSON.parse(textStatus.responseText)
        	 	console.log(JSON.parse(textStatus.responseText))
        	 	if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/Ontologies/phylogenetic_methods.owl#operationClassification"){
                    GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = jsonData
                    window.localStorage.setItem('SERVICES_HIERARCHY_STRUC_CLASSES_INSTANCES_ALL',JSON.stringify(jsonData))
                } else if (str_owl_class_uri === "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_resources") {
                    GLOBAL_HIERARCHY_CLASSES_RESOURCE = jsonData
                    window.localStorage.setItem('RESOURCES_CLASSES_STRUC_ALL',JSON.stringify(jsonData))
                }
        	 } else {
                console.log("Cannot connet server - Go here")
                var data_services = window.localStorage.getItem('SERVICES_HIERARCHY_STRUC_CLASSES_INSTANCES_ALL')
                if (!isEmpty(data_services)){
                    GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = JSON.parse(data_services)
                }

                var data_resources = window.localStorage.getItem('RESOURCES_CLASSES_STRUC_ALL')
                if (!isEmpty(data_resources)){
                    GLOBAL_HIERARCHY_CLASSES_RESOURCE = JSON.parse(data_resources)
                }                   
        	 }
        }
  });
}
