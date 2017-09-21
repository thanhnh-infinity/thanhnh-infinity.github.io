var TEST_ABSTRACT_CONCRETE_WORKFLOW_PLAN_DATA = {
  "request_parameters" : {
    "input" : [
      {
        "name" : "Set of Gene Names",
        "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfGeneStrings",
        "resource_ontology_id" : "resource_SetOfGeneStrings",
        "resource_data_format_id":"list_of_strings",
        "resource_data_format_uri":"http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#list_of_strings"
      },
      {
        "name" : "Method",
        "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#phylomatic_method",
        "resource_ontology_id" : "phylomatic_method",
        "resource_data_format_id":"string",
        "resource_data_format_uri":"http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#string"
      }
    ],
    "output" : [
      {
        "name" : "Reconciliation Tree",
        "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_reconcileTree",
        "resource_ontology_id" : "resource_reconcileTree",
        "resource_data_format_id":"newickTree",
        "resource_data_format_uri":"http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#newickTree",
        "map":{
          "resource_ontology_id" : "resource_reconcileTree",
          "at_step":5,
          "from":"tree_reconciliation"
        }
      }
    ]
  },
  "workflow_plan": [
     {
        "info": {
          "name" : "Generate Reconciliation Tree",
          "project" : "phylotastic",
          "step_quantity" : 6,
          "actions_in_plan_is_ordered" : true
        },
        "abstract_plan": [
          {
            "service_class_index" : 0,
            "service_class_name" : "gene_based_extraction",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#gene_based_extraction",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfGeneStrings",
                      "resource_ontology_id" : "resource_SetOfGeneStrings",
                      "map":{
                        "resource_ontology_id" : "resource_SetOfGeneStrings",
                        "at_step":0,
                        "from":"initial_state"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                    }
                  ]
              }
            }
          },
          {
            "service_class_index" : 1,
            "service_class_name" : "gene_tree_scaling",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#gene_tree_scaling",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                      "map":{
                        "resource_ontology_id" : "resource_geneTree",
                        "at_step":1,
                        "from":"gene_based_extraction"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                    }
                  ]
              }
            }
          },
          {
            "service_class_index" : 2,
            "service_class_name" : "names_extraction_tree",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#names_extraction_tree",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                      "map":{
                        "resource_ontology_id" : "resource_geneTree",
                        "at_step":2,
                        "from":"gene_based_extraction"
                      }
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#method",
                      "resource_ontology_id" : "method",
                      "map":{
                        "resource_ontology_id" : "phylomatic_method",
                        "at_step":0,
                        "from":"initial_state"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfSciName",
                      "resource_ontology_id" : "resource_SetOfSciName",
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_HTTPCode",
                      "resource_ontology_id" : "resource_HTTPCode",
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_ConnectionTime",
                      "resource_ontology_id" : "resource_ConnectionTime",
                    }
                  ]
              }
            }
          },
          {
            "service_class_index" : 3,
            "service_class_name" : "names_resolution_operation",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#names_resolution_operation",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfSciName",
                      "resource_ontology_id" : "resource_SetOfSciName",
                      "map":{
                        "resource_ontology_id" : "resource_SetOfSciName",
                        "at_step":3,
                        "from":"names_extraction_tree"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfTaxon",
                      "resource_ontology_id" : "resource_SetOfTaxon",
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_HTTPCode",
                      "resource_ontology_id" : "resource_HTTPCode",
                    }
                  ]
              }
            }
          },
          {
            "service_class_index" : 4,
            "service_class_name" : "taxonomy_based_extraction",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#taxonomy_based_extraction",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_SetOfTaxon",
                      "resource_ontology_id" : "resource_SetOfTaxon",
                      "map":{
                        "resource_ontology_id" : "resource_SetOfTaxon",
                        "at_step":4,
                        "from":"names_resolution_operation"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_speciesTree",
                      "resource_ontology_id" : "resource_speciesTree",
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_HTTPCode",
                      "resource_ontology_id" : "resource_HTTPCode",
                    }
                  ]
              }
            }
          },
          {
            "service_class_index" : 5,
            "service_class_name" : "tree_reconciliation",
            "service_class_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#tree_reconciliation",
            "service_class_parameters" :
            {
              "input" : {
                  "info" : {
                     "data_format" : "x-www-urlencoded"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_speciesTree",
                      "resource_ontology_id" : "resource_speciesTree",
                      "map":{
                        "resource_ontology_id" : "resource_speciesTree",
                        "at_step":5,
                        "from":"taxonomy_based_extraction"
                      }
                    },
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_geneTree",
                      "resource_ontology_id" : "resource_geneTree",
                      "map":{
                        "resource_ontology_id" : "resource_geneTree",
                        "at_step":2,
                        "from":"gene_tree_scaling"
                      }
                    }
                  ]
              },
              "output" : {
                  "info" : {
                     "data_format" : "JSON"
                  },
                  "components" : [
                    {
                      "resource_ontology_uri" : "http://www.cs.nmsu.edu/~epontell/CDAO/cdao.owl#resource_reconcileTree",
                      "resource_ontology_id" : "resource_reconcileTree",
                    }
                  ]
              }
            }
          },
        ],
        "concrete_plan":[
          {
            "0" : [
                {
                  "1":1
                },
                {
                  "2":2
                },
                {
                  "3":3
                }
            ]
          },
          {
            "1" : [
                {
                  "4":4
                },
                {
                  "5":5
                },
                {
                  "6":6
                }
            ]
          }
        ]

     }
  ]
};
