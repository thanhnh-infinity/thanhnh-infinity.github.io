/**
 * Author : Thanh Nguyen
 * Doc : Service composition framework - Workflow Description Tool
 * Date : 25-Feb-2017
 **/


/* Global variable and components */
var GLOBAL_NODES_DATA = [];
var cy;
var CURRENT_X;
var CURRENT_Y;
var GLOBAL_EDGES_DATA = [];
var ORIGIN_INIT_INPUT = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.input
var ORIGIN_GOAL_OUTPUT = GLOBAL_WORKFLOW_PLAN_DATA.request_parameters.output
var ORIGIN_FIRST_OPERATION = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan[0]
var ORIGIN_OPERATION_NODE_LIST = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan
var ORIGIN_LAST_OPERATION = GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan[GLOBAL_WORKFLOW_PLAN_DATA.workflow_plan[0].plan.length - 1]
var ADDED_OPERATION_NODES_LIST = []
var GLOBAL_INITIAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = {}
var GLOBAL_GOAL_STATE_ONTOLOGY_FOR_PLANNING_PURPOSE = {}
var GLOBAL_LIST_RESOURCES_ONTOLOGY = []
var LIST_CURRENT_RESOURCE_INSTANCES = []

var GLOBAL_HIERARCHY_CLASSES_STRUCTURE_ROOTED = {}
var GLOBAL_HIERARCHY_CLASSES_RESOURCE = {}

var ONTOLOGY_API_ENGINE_ROOT_MATERIAL = "http://phylo.cs.nmsu.edu:8000/query"
var ONTOLOGY_API_ENGINE_ROOT_TRIPLE = "http://phylo.cs.nmsu.edu:8000/getTriples"
var ONTOLOGY_API_ENGINE_ROOT_GRAPH = "http://phylo.cs.nmsu.edu:8000/buildGraph"

var PLANNING_ENGINE_API_ROOT = "http://127.0.0.1:8000/planningEngine/generateWorkflow"


var REQUEST_TYPE_GET_INSTANCES_OF_CLASS = "get_all_instances_of_a_class"
var REQUEST_TYPE_GET_HIERARCHY_SUBCLASS_OF_CLASS = "get_hierarchy_subclasses_of_a_class"

var CONSIDER_ADDED_OPERATION_CLASS = {}
var CONSIDER_ADDED_RESOURCE_CLASS = {}

var GLOBAL_NO_ONTOLOGY_DATA = "NO_ONTOLOGY_DATA"
var WS_COMPOSITION_ONTOLOGY_API = "http://thanhnh-infinity.github.io/projects/GraphicTool_WorkflowDescLang/sources/"
var TEST_OPERATION_API_JSON = {
  "operation_id" : 0,
  "operation_name" : "getPhylogeneticTree_TreeBase_GET",
  "operation_of_web_service" : "phylotastic_webservice",
  "operation_ontology_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_GetPhylogeneticTree_TreeBase_GET",
  "operation_parameters" :
  {
    "input" : {
        "info" : {
           "data_format" : "x-www-urlencoded"
        },
        "components" : [
          {
            "name" : "taxa",
            "ontology_param_name" : "param_taxa",
            "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_taxa",
            "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#bio_taxa",
            "ontology_resource_id" : "bio_taxa"
          }
        ]
    },
    "output" : {
        "info" : {
           "data_format" : "json"
        },
        "components" : [
          {
            "name" : "newick",
            "ontology_param_name" : "pram_species_tree",
            "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_species_tree",
            "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#cdao_species_tree",
            "ontology_resource_id" : "cdao_species_tree"
          },
          {
            "name" : "status_code",
            "ontology_param_name" : "param_status_code",
            "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_status_code",
            "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_status_code_int",
            "ontology_resource_id" : "http_status_code_int"
          }
        ]
    }
  }
};
