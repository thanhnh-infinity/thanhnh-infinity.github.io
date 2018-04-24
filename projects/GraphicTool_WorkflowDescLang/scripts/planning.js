/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/
function recomposite_get_simWorkflow(){
  var initial_state_data = {}
  var goal_state_data = {}

  /* Step 1  : Read data from initial_state_data */
  initial_state_data = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
  goal_state_data =   GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE

  /* Step 2 : Send POST METHOD API
     http://<planning_ontology_server:8080>/getPlanningWorkflow (Python + CherryPy)
     Input : Initial State, Goal State, Condition, etx
     Output: plan - workflow in JSON format
     POST METHOD with Initial State Data and Goal State Data - All Step about Create LP files and
     run planning are ON SERVER */
  console.log("Send API POST planning Engine Initial State :")
  console.log(initial_state_data)
  //Create input array object
  if (jQuery.isEmptyObject(initial_state_data) 
      || isEmpty(initial_state_data) 
      || (isEmpty(initial_state_data.components)) 
      || (initial_state_data.components.length <= 0)){
    //alert("No Initial State")

     $.msgBox({
      title:"Warning",
      content:"Please define Initial State"
      //type:"error"
     }); 
    return;
  }

  input_array_object = []
  for(var i = 0 ; i < initial_state_data.components.length ; i++){
    input_object = {}
    input_object.name = initial_state_data.components[i].local_name
    input_object.resource_ontology_uri = initial_state_data.components[i].uri
    input_object.resource_ontology_id = initial_state_data.components[i].local_name
    input_object.resource_data_format_id = initial_state_data.components[i].data_format
    input_object.resource_data_format_uri = PREFIX_URI_ONTOLOGY + initial_state_data.components[i].data_format
    input_array_object.push(input_object)
  }
  console.log("Send API POST planning Engine Goal State :")
  console.log(goal_state_data)

  if (jQuery.isEmptyObject(goal_state_data) 
      || isEmpty(goal_state_data) 
      || (isEmpty(goal_state_data.components)) 
      || (goal_state_data.components.length <= 0)){
    //alert("No Goal State")

     $.msgBox({
      title:"Warning",
      content:"Please define Goal State"
      //type:"error"
     }); 
    return;
  }
  output_array_object = []
  for(var i = 0 ; i < goal_state_data.components.length ; i++){
    output_object = {}
    output_object.name = goal_state_data.components[i].local_name
    output_object.resource_ontology_uri = goal_state_data.components[i].uri
    output_object.resource_ontology_id = goal_state_data.components[i].local_name
    output_object.resource_data_format_id = goal_state_data.components[i].data_format
    output_object.resource_data_format_uri = PREFIX_URI_ONTOLOGY + goal_state_data.components[i].data_format
    output_array_object.push(output_object)
  }

  /* Step 3 : Retrive Plan as JSON format from planning_ontology_server:8080 */
  request_data = { 
                   "request_parameters" : 
                   {
                      "input" : input_array_object,
                      "output" : output_array_object,
                      "avoidance" : [],
                      "inclusion" : ["phylotastic_GeneTree_Scaling"],
                      "insertion" : [],
                      "original_workflow" : GLOBAL_WORKFLOW_PLAN_DATA_PLANNING.workflow_plan[0].raw_plan,
                   },
                   "models" : {
                      "number" : 1,
                      "engine" : 2
                   }
                 };

  console.log(request_data)
  var result_workflow = {}
  string_request_data = JSON.stringify(request_data)
  console.log(string_request_data.length)
  document.getElementById("idLoading").style.display = "block";

  
  $.ajax({
        method: "POST",
        url: RE_PLANNING_ENGINE_API_ROOT,
        dataType: "json",
        //async:false,
        //processData: false,
        data: string_request_data,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (isEmpty(data)){
              alert("No planning found")
              document.getElementById("idLoading").style.display = "none";
              return;
            }
            console.log(data)
            result_workflow = data
            
            DisplayWorkflow_Graphic_From_Source(result_workflow)
            document.getElementById("idLoading").style.display = "none";
        },
        error: function (textStatus, errorThrown) {
           if (textStatus.status = 200){
               if (isEmpty(data)){
                 alert("No planning found")
                 document.getElementById("idLoading").style.display = "none";
                 return;
               }
               console.log(textStatus)

               result_workflow = textStatus

           } else {
               consol.log("sadasd")
               result_workflow = {}
               document.getElementById("idLoading").style.display = "none";
               return;
           }
           DisplayWorkflow_Graphic_From_Source(result_workflow)   
           document.getElementById("idLoading").style.display = "none";
        }

  });
}

function executePlanner_toGet_WorkFlow(){
  var initial_state_data = {}
  var goal_state_data = {}

  /* Step 1  : Read data from initial_state_data */
  initial_state_data = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
  goal_state_data =   GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE

  /* Step 2 : Send POST METHOD API
     http:<planning_ontology_server:8080>/getPlanningWorkflow (Python + CherryPy)
     Input : Initial State, Goal State, Condition, etx
     Output: plan - workflow in JSON format
     POST METHOD with Initial State Data and Goal State Data - All Step about Create LP files and
     run planning are ON SERVER */
  console.log("Send API POST planning Engine Initial State :")
  console.log(initial_state_data)
  //Create input array object
  if (jQuery.isEmptyObject(initial_state_data) 
      || isEmpty(initial_state_data) 
      || (isEmpty(initial_state_data.components)) 
      || (initial_state_data.components.length <= 0)){
    //alert("No Initial State")

     $.msgBox({
      title:"Warning",
      content:"Please define Initial State"
      //type:"error"
     }); 

    return;
  }

  input_array_object = []
  for(var i = 0 ; i < initial_state_data.components.length ; i++){
    input_object = {}
    input_object.name = initial_state_data.components[i].local_name
    input_object.resource_ontology_uri = initial_state_data.components[i].uri
    input_object.resource_ontology_id = initial_state_data.components[i].local_name
    input_object.resource_data_format_id = initial_state_data.components[i].data_format
    input_object.resource_data_format_uri = PREFIX_URI_ONTOLOGY + initial_state_data.components[i].data_format
    input_array_object.push(input_object)
  }
  console.log("Send API POST planning Engine Goal State :")
  console.log(goal_state_data)

  if (jQuery.isEmptyObject(goal_state_data) 
      || isEmpty(goal_state_data) 
      || (isEmpty(goal_state_data.components)) 
      || (goal_state_data.components.length <= 0)){
    //alert("No Goal State")
    $.msgBox({
      title:"Warning",
      content:"Please define Goal State"
      //type:"error"
     }); 
    return;
  }
  output_array_object = []
  for(var i = 0 ; i < goal_state_data.components.length ; i++){
    output_object = {}
    output_object.name = goal_state_data.components[i].local_name
    output_object.resource_ontology_uri = goal_state_data.components[i].uri
    output_object.resource_ontology_id = goal_state_data.components[i].local_name
    output_object.resource_data_format_id = goal_state_data.components[i].data_format
    output_object.resource_data_format_uri = PREFIX_URI_ONTOLOGY + goal_state_data.components[i].data_format
    output_array_object.push(output_object)
  }
  /* Step 3 : Retrive Plan as JSON format from planning_ontology_server:8080 */
  request_data = { 
                   "request_parameters" : 
                   {
                      "input" : input_array_object,
                      "output" : output_array_object
                   },
                   "models" : {
                      "number" : 1,
                      "engine" : 2
                   }
                 };

  console.log(request_data)
  var result_workflow = {}
  string_request_data = JSON.stringify(request_data)
  console.log(string_request_data.length)
  document.getElementById("idLoading").style.display = "block";

  /* Simulate data - Read from file */
  //document.getElementById("idLoading").style.display = "none";
  //DisplayWorkflow_Graphic_From_Source(TEST_ABSTRACT_CONCRETE_WORKFLOW_PLAN_DATA)

  
  $.ajax({
        method: "POST",
        url: PLANNING_ENGINE_API_ROOT,
        dataType: "json",
        //async:false,
        //processData: false,
        data: string_request_data,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (isEmpty(data)){
              alert("No planning found")
              document.getElementById("idLoading").style.display = "none";
              return;
            }
            console.log(data)
            result_workflow = data
            GLOBAL_WORKFLOW_PLAN_DATA_PLANNING = result_workflow
            DisplayWorkflow_Graphic_From_Source(result_workflow)
            document.getElementById("idLoading").style.display = "none";
        },
        error: function (textStatus, errorThrown) {
           if (textStatus.status = 200){
               if (isEmpty(data)){
                
                 $.msgBox({
                  title:"Error",
                  content:"No plan is found",
                  type:"error"
                 }); 
                 document.getElementById("idLoading").style.display = "none";
                 return;
               }
               console.log(textStatus)

               result_workflow = textStatus

           } else {
               consol.log("sadasd")
               result_workflow = {}
               document.getElementById("idLoading").style.display = "none";
               return;
           }
           DisplayWorkflow_Graphic_From_Source(result_workflow)   
           document.getElementById("idLoading").style.display = "none";
        }

  });
  
}
