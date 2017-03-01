var GLOBAL_WORKFLOW_PLAN_DATA = {
  "request_parameters" : {
    "input" : [
      {
        "name" : "Free Format of Text",
        "ontology_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#free_text",
        "ontology_resource_id" : "free_text"
      }
    ],
    "output" : [
      {
        "name" : "Species Tree",
        "ontology_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#cdao_species_tree",
        "ontology_resource_id" : "cdao_species_tree"
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
            "operation_name" : "findScientificNamesFromText_GNRD_GET",
            "operation_of_web_service" : "phylotastic_webservice",
            "operation_ontology_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_FindScientificNamesFromFreeText_GNRD_GET",
            "operation_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "name" : "text",
                      "ontology_param_name" : "param_text",
                      "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_text",
                      "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#free_text",
                      "ontology_resource_id" : "free_text"
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "json"
                  },
                  "components" : [
                    {
                      "name" : "scientificNames",
                      "ontology_param_name" : "param_scientific_names_json",
                      "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_scientific_names_json",
                      "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_scientific_names",
                      "ontology_resource_id" : "phylotastic_scientific_names"
                    },
                    {
                      "name" : "execution_time",
                      "ontology_param_name" : "param_execution_time",
                      "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_execution_time",
                      "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#http_response_time",
                      "ontology_resource_id" : "http_response_time"
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
          },
          {
            "operation_id" : 2,
            "operation_name" : "resolvedScientificNames_OT_TNRS_GET",
            "operation_of_web_service" : "phylotastic_webservice",
            "operation_ontology_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_ResolvedScientificNames_OT_TNRS_GET",
            "operation_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "name" : "names",
                      "ontology_param_name" : "param_names",
                      "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_names",
                      "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_scientific_names",
                      "ontology_resource_id" : "phylotastic_scientific_names"
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "json"
                  },
                  "components" : [
                    {
                      "name" : "resolvedNames",
                      "ontology_param_name" : "param_resolved_names",
                      "ontology_param_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#param_resolved_names",
                      "ontology_resource_link" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#bio_taxa",
                      "ontology_resource_id" : "bio_taxa"
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
          },
          {
            "operation_id" : 3,
            "operation_name" : "getPhylogeneticTree_OT_GET",
            "operation_of_web_service" : "phylotastic_webservice",
            "operation_owlref" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylotastic_GetPhylogeneticTree_OT_GET",
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
          }
        ]

     }
  ]
};
