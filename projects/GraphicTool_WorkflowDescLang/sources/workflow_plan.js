var GLOBAL_WORKFLOW_PLAN_DATA = {
  "request_parameters" : {
    "input" : [
      {
        "name" : "Free Format of Text",
        "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#free_text",
        "resource_ontology_id" : "free_text"
      }
    ],
    "output" : [
      {
        "name" : "Species Tree",
        "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#cdao_species_tree",
        "resource_ontology_id" : "cdao_species_tree"
      }
    ]
  },
  "workflow_plan": [
     {
        "info": {
          "name" : "Generate Species Tree",
          "project" : "phylotastic",
          "step_quantity" : 3,
          "start_index" : 1,
          "last_index" : 2,
          "actions_in_plan_is_ordered" : true
        },
        "plan": [
          {
            "operation_id" : 1,
            "operation_name" : "phylotastic_FindScientificNamesFromFreeText_GNRD_GET",
            "operation_of_web_service_name" : "phylotastic_ws",
            "operation_of_web_service_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ws",
            "operation_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_FindScientificNamesFromFreeText_GNRD_GET",
            "operation_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded",
                     "input_name" : "phylotastic_FindScientificNames_FromText_GNRD_GET_In",
                     "input_ontology_uri":"http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_FindScientificNames_FromText_GNRD_GET_In"
                  },
                  "components" : [
                    {
                      "name" : "text",
                      "component_ontology_name" : "param_text",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_text",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#free_text",
                      "resource_ontology_id" : "free_text"
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON",
                     "output_name" : "phylotastic_FindScientificNames_FromText_GNRD_GET_Out",
                     "output_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_FindScientificNames_FromText_GNRD_GET_Out"
                  },
                  "components" : [
                    {
                      "name" : "scientificNames",
                      "component_ontology_name" : "param_scientific_names_json",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_scientific_names_json",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_scientific_names",
                      "resource_ontology_id" : "phylotastic_scientific_names"
                    },
                    {
                      "name" : "execution_time",
                      "component_ontology_name" : "param_execution_time",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_execution_time",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_response_time",
                      "resource_ontology_id" : "http_response_time"
                    },
                    {
                      "name" : "status_code",
                      "component_ontology_name" : "param_status_code",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_status_code",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_status_code_int",
                      "resource_ontology_id" : "http_status_code_int"
                    }
                  ]
              }
            }
          },
          {
            "operation_id" : 2,
            "operation_name" : "phylotastic_ResolvedScientificNames_OT_TNRS_GET",
            "operation_of_web_service_name" : "phylotastic_ws",
            "operation_of_web_service_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ws",
            "operation_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ResolvedScientificNames_OT_TNRS_GET",
            "operation_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded",
                     "input_name" : "phylotastic_ResolvedScientificNames_OT_TNRS_GET_In",
                     "input_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ResolvedScientificNames_OT_TNRS_GET_In"
                  },
                  "components" : [
                    {
                      "name" : "names",
                      "component_ontology_name" : "param_names",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_names",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_scientific_names",
                      "resource_ontology_id" : "phylotastic_scientific_names"
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON",
                     "output_name" : "phylotastic_ResolvedScientificNames_OT_TNRS_GET_Out",
                     "output_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ResolvedScientificNames_OT_TNRS_GET_Out"
                  },
                  "components" : [
                    {
                      "name" : "resolvedNames",
                      "component_ontology_name" : "param_resolved_names",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_resolved_names",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#bio_taxa",
                      "resource_ontology_id" : "bio_taxa"
                    },
                    {
                      "name" : "status_code",
                      "component_ontology_name" : "param_status_code",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_status_code",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_status_code_int",
                      "resource_ontology_id" : "http_status_code_int"
                    }
                  ]
              }
            }
          },
          {
            "operation_id" : 3,
            "operation_name" : "phylotastic_GetPhylogeneticTree_OT_GET",
            "operation_of_web_service_name" : "phylotastic_ws",
            "operation_of_web_service_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ws",
            "operation_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_GetPhylogeneticTree_OT_GET",
            "operation_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded",
                     "input_name" : "phylotastic_GetPhylogeneticTree_OT_GET_In",
                     "input_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_GetPhylogeneticTree_OT_GET_In"
                  },
                  "components" : [
                    {
                      "name" : "taxa",
                      "component_ontology_name" : "param_taxa",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_taxa",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#bio_taxa",
                      "resource_ontology_id" : "bio_taxa"
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON",
                     "output_name" : "phylotastic_GetPhylogeneticTree_OT_GET_Out",
                     "output_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_GetPhylogeneticTree_OT_GET_Out"
                  },
                  "components" : [
                    {
                      "name" : "newick",
                      "component_ontology_name" : "param_species_tree",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_species_tree",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#cdao_species_tree",
                      "resource_ontology_id" : "cdao_species_tree"
                    },
                    {
                      "name" : "status_code",
                      "component_ontology_name" : "param_status_code",
                      "component_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_status_code",
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_status_code_int",
                      "resource_ontology_id" : "http_status_code_int"
                    }
                  ]
              }
            }
          }
        ]

     }
  ]
};
