export default {
  multiqcSidebar: [
    [
      "index",
      {
        "type": "category",
        "label": "Getting started",
        "collapsed": true,
        "link": {
          "type": "generated-index",
        },
        "items": [
          "getting_started/quick_start",
          "getting_started/installation",
          "getting_started/running_multiqc",
          "getting_started/config"
        ]
      },
      {
        "type": "category",
        "label": "Reports",
        "collapsed": true,
        "link": {
          "type": "generated-index",
        },
        "items": [
          "reports/reports",
          "reports/customisation"
        ]
      },
      "custom_content/index",
      {
        "type": "category",
        "label": "Usage",
        "collapsed": true,
        "link": {
          "type": "generated-index",
        },
        "items": [
          "usage/downstream",
          "usage/pipelines",
          "usage/scripts",
          "usage/troubleshooting"
        ]
      },
      {
        "type": "category",
        "label": "Development",
        "collapsed": true,
        "link": {type: "doc", id: "development/index"},
        "items": [
          "development/modules",
          "development/plots",
          "development/plugins",
          "development/templates",
          "development/compatibility",
          "development/contributing"
        ]
      },
      {
        "type": "category",
        "label": "Supported Tools",
        "collapsed": true,
        "link": {type: "doc", id: "modules"},
        "items": []
      },
      {
        "type": "doc",
        "label": "Changelog",
        "id": "changelog"
      }
    ]
  ]
};
