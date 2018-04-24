var input_componets = []
var output_components = []

function buildUpTreeView_Resources(){
  var defaultData = [
          {
            text: 'Parent 1',
            nodes: [
              {
                text: 'Child 1',
                nodes: [
                  {
                    text: 'resource_FreeText',
                  },
                  {
                    text: 'ddd',
                  }
                ]
              },
              {
                text: 'resource_SetOfGeneStrings',
              }
            ]
          },
          {
            text: 'resource_Tree',
            nodes : [
               {
                  text:'resource_speciesTree',
               },
               {
                  text:'resource_geneTree',
               },
               {
                  text:'resource_reconcileTree',
               },
            ]
          },
          {
            text: 'Parent 3',
          },
          {
            text: 'Parent 4',
          },
          {
            text: 'Parent 5',
          }
        ];

    var arrTreeData = []
    var treeData = generate_tree_view_data(GLOBAL_HIERARCHY_CLASSES_RESOURCE)
    arrTreeData.push(treeData)
    console.log(arrTreeData)   

    $('#resource_tree_init').treeview({
          color: "#428bca",
          expandIcon: 'glyphicon glyphicon-chevron-right',
          collapseIcon: 'glyphicon glyphicon-chevron-down',
          nodeIcon: 'glyphicon glyphicon-file',
          multiSelect: false,
          data: arrTreeData,
          onNodeSelected: function(event, node) {
              input_componets.push(node.text)
              //console.log(input_componets)
          },
          onNodeUnselected: function (event, node) {
              var index = input_componets.indexOf(node.text)
              if (index > -1){
                input_componets.splice(index,1)
              }
          }
    });

    $('#resource_tree_goal').treeview({
          color: "#428bca",
          expandIcon: 'glyphicon glyphicon-chevron-right',
          collapseIcon: 'glyphicon glyphicon-chevron-down',
          nodeIcon: 'glyphicon glyphicon-file',
          multiSelect: false,
          data: arrTreeData,
          onNodeSelected: function(event, node) {
              output_components.push(node.text)
              //console.log(input_componets)
          },
          onNodeUnselected: function (event, node) {
              var index = output_components.indexOf(node.text)
              if (index > -1){
                output_components.splice(index,1)
              }
          }
    });
}

function generate_tree_view_data(resources_data){
  var root = {} 
  if (isEmpty(resources_data.subclasses) || resources_data.subclasses.length <= 0){
    root.text = resources_data.class_ontology_name
    return root
  } else {
    root.text = resources_data.class_ontology_name
    root.nodes = []
    var index = 0
    for(index = 0 ; index < resources_data.subclasses.length ; index++){
        root.nodes.push(generate_tree_view_data(resources_data.subclasses[index]))
    }
    return root
  }
}

/* Initial State Tree View **/

function saveAddInitialState_Modal_TreeView(){
    if(!isEmpty(input_componets) && input_componets.length >= 1){
      document.getElementById('cy').style.visibility = "visible";
      var addInitialStateModal_TreeView = document.getElementById('addInitialStateModal_TreeView');
      addInitialStateModal_TreeView.style.display = "none";
  
      var initial_state_node = {}

      if (!isEmpty(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && !objectIsEmpty(GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && (GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE.components.length > 0)){
         initial_state_node = GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
      } else {
         initial_state_node.components = []
      } 
      
      var e =  document.getElementById("selectInitialState_DataFormatClasses_TreeView");
      var selected_data_format = e.options[e.selectedIndex].value
      if (isEmpty(selected_data_format)){
        selected_data_format = "unknown"
      }

      var an_initial_component = {"local_name":input_componets[0],"uri":input_componets[0],"data_format":selected_data_format}
      initial_state_node.components.push(an_initial_component)
      displayInitialState_From_Ontology(initial_state_node)
  } else {
    $.msgBox({
      title:"Warning",
      content:"Please select resources and their data formats to define Initial State!",
      type:"warning"
     }); 
    return
  }
}

function closeAddInitialState_Modal_TreeView(){
   var addInitialStateModal_TreeView = document.getElementById('addInitialStateModal_TreeView');
   addInitialStateModal_TreeView.style.display = "none";
   document.getElementById('cy').style.visibility = "visible";
}

function openAddInitialState_FromOntology_Modal_TreeView(){
    document.getElementById('cy').style.visibility = "hidden";
    var addInitialStateModal_TreeView = document.getElementById('addInitialStateModal_TreeView');
    addInitialStateModal_TreeView.style.display = "block";
}

/* Goal State Tree View **/

function openAddGoalState_FromOntology_Modal_TreeView(){
    document.getElementById('cy').style.visibility = "hidden";
    var addGoalStateModal_TreeView = document.getElementById('addGoalStateModal_TreeView');
    addGoalStateModal_TreeView.style.display = "block";
}

function closeAddGoalState_Modal_TreeView(){
   var addGoalStateModal_TreeView = document.getElementById('addGoalStateModal_TreeView');
   addGoalStateModal_TreeView.style.display = "none";
   document.getElementById('cy').style.visibility = "visible";
}

function saveAddGoalState_Modal_TreeView(){
    if(!isEmpty(output_components) && output_components.length >= 1){
      document.getElementById('cy').style.visibility = "visible";
      var addGoalStateModal_TreeView = document.getElementById('addGoalStateModal_TreeView');
      addGoalStateModal_TreeView.style.display = "none";
  
      var goal_state_node = {}

      if (!isEmpty(GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && !objectIsEmpty(GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE)
          && (GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE.components.length > 0)){
         goal_state_node = GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE
      } else {
         goal_state_node.components = []
      } 
      
      var e =  document.getElementById("selectGoalState_DataFormatClasses_TreeView");
      var selected_data_format = e.options[e.selectedIndex].value
      if (isEmpty(selected_data_format)){
        selected_data_format = "unknown"
      }

      var an_goal_component = {"local_name":output_components[0],"uri":output_components[0],"data_format":selected_data_format}
      goal_state_node.components.push(an_goal_component)
      displayGoalState_From_Ontology(goal_state_node)
  } else {
     $.msgBox({
        title:"Warning",
        content:"Please select resources and their data formats to define Goal State !",
        type:"warning"
     }); 
    return
  }
}